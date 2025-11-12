import { supabase } from '../supabase/client'
import { Product } from '../types'
import { products as mockProducts } from '../data/products'
import { CategorySystem } from '../utils/category-system'

export interface SearchFilters {
  category?: string[]           // Can be basic categories (boys, girls) or smart categories (boys-zone, girls-world)
  smartCategories?: string[]    // Explicit smart category filtering
  basicCategories?: string[]    // Explicit basic category filtering
  tags?: string[]              // Filter by tags
  priceMin?: number
  priceMax?: number
  sizes?: string[]
  colors?: string[]
  ageGroups?: string[]
  genders?: string[]
  brands?: string[]
  inStock?: boolean
  onSale?: boolean
  newArrivals?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'featured' | 'name'
  limit?: number
  offset?: number
}

export interface SearchResults {
  products: Product[]
  total: number
  filters: {
    categories: { value: string; count: number }[]
    priceRange: { min: number; max: number }
    sizes: { value: string; count: number }[]
    colors: { value: string; count: number }[]
    brands: { value: string; count: number }[]
  }
  suggestions?: string[]
}

export interface SearchSuggestion {
  text: string
  type: 'product' | 'category' | 'brand'
  count?: number
}

export class SearchService {
  
  // Main search function with filters
  static async searchProducts(
    query: string = '',
    filters: SearchFilters = {},
    locale: string = 'he'
  ): Promise<{ data: SearchResults | null; error: string | null }> {
    try {
      // Use mock data if Supabase not configured
      if (!supabase) {
        return this.searchMockProducts(query, filters, locale)
      }

      // Build the base query
      let queryBuilder = supabase
        .from('products')
        .select(`
          *,
          inventory (
            stock_quantity,
            size,
            color_index
          )
        `, { count: 'exact' })
        .eq('is_active', true)

      // Text search across multiple languages
      if (query.trim()) {
        const searchTerm = query.trim()
        
        if (locale === 'he') {
          queryBuilder = queryBuilder.or(`name_he.ilike.%${searchTerm}%,description_he.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
        } else if (locale === 'ar') {
          queryBuilder = queryBuilder.or(`name_ar.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
        } else {
          queryBuilder = queryBuilder.or(`name_en.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
        }
      }

      // Apply category filters - handle both basic and smart categories
      if (filters.category?.length) {
        // Separate basic and smart categories
        const basicCats: string[] = []
        const smartCats: string[] = []
        
        filters.category.forEach(cat => {
          const categoryDef = CategorySystem.getCategoryBySlug(cat)
          if (categoryDef?.type === 'basic') {
            basicCats.push(cat)
          } else if (categoryDef?.type === 'smart') {
            smartCats.push(cat)
          }
        })
        
        // Apply basic category filter to database query
        if (basicCats.length > 0) {
          queryBuilder = queryBuilder.in('category', basicCats)
        }
        
        // Note: Smart category filtering will be applied post-database query
        // as it requires complex logic that can't be done in SQL easily
      }
      
      // Apply explicit basic category filter
      if (filters.basicCategories?.length) {
        queryBuilder = queryBuilder.in('category', filters.basicCategories)
      }
      
      // Apply tag filters
      if (filters.tags?.length) {
        // Use PostgreSQL array overlap operator
        queryBuilder = queryBuilder.overlaps('tags', filters.tags)
      }

      if (filters.priceMin !== undefined) {
        queryBuilder = queryBuilder.gte('price', filters.priceMin)
      }

      if (filters.priceMax !== undefined) {
        queryBuilder = queryBuilder.lte('price', filters.priceMax)
      }

      if (filters.ageGroups?.length) {
        queryBuilder = queryBuilder.in('age_group', filters.ageGroups)
      }

      if (filters.genders?.length) {
        queryBuilder = queryBuilder.in('gender', filters.genders)
      }

      if (filters.brands?.length) {
        queryBuilder = queryBuilder.in('brand', filters.brands)
      }

      if (filters.onSale) {
        queryBuilder = queryBuilder.eq('is_sale', true)
      }

      if (filters.newArrivals) {
        queryBuilder = queryBuilder.eq('is_new', true)
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true })
          break
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false })
          break
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
        case 'name':
          const nameField = locale === 'he' ? 'name_he' : locale === 'ar' ? 'name_ar' : 'name_en'
          queryBuilder = queryBuilder.order(nameField, { ascending: true })
          break
        case 'featured':
        default:
          queryBuilder = queryBuilder.order('is_featured', { ascending: false })
            .order('sort_order', { ascending: true })
          break
      }

      // Pagination
      if (filters.limit) {
        queryBuilder = queryBuilder.limit(filters.limit)
      }
      if (filters.offset) {
        queryBuilder = queryBuilder.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }

      const { data: products, error, count } = await queryBuilder

      if (error) {
        return { data: null, error: error.message }
      }

      // Filter by stock if requested
      let filteredProducts = products || []
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => 
          product.inventory?.some((inv: any) => inv.stock_quantity > 0)
        )
      }

      // Apply smart category filtering post-database query
      if (filters.category?.length || filters.smartCategories?.length) {
        const smartCategoriesFilter = [
          ...(filters.smartCategories || []),
          ...(filters.category?.filter(cat => {
            const categoryDef = CategorySystem.getCategoryBySlug(cat)
            return categoryDef?.type === 'smart'
          }) || [])
        ]
        
        if (smartCategoriesFilter.length > 0) {
          filteredProducts = filteredProducts.filter(product => {
            // Transform product to match expected interface
            const transformedProduct = {
              ...product,
              name: {
                he: product.name_he,
                ar: product.name_ar,
                en: product.name_en
              },
              isSale: product.is_sale,
              isNew: product.is_new,
              featured: product.is_featured
            }
            
            return smartCategoriesFilter.some(smartCat => 
              CategorySystem.doesProductBelongToCategory(transformedProduct, smartCat)
            )
          })
        }
      }

      // Filter by sizes and colors if specified
      if (filters.sizes?.length || filters.colors?.length) {
        filteredProducts = filteredProducts.filter(product => {
          const colors = product.colors || []
          
          // Check sizes
          if (filters.sizes?.length) {
            const productSizes = product.sizes || []
            const hasSize = filters.sizes.some(size => productSizes.includes(size))
            if (!hasSize) return false
          }

          // Check colors
          if (filters.colors?.length) {
            const hasColor = filters.colors.some(filterColor => 
              colors.some((color: any) => 
                color.name?.he === filterColor || 
                color.name?.ar === filterColor || 
                color.name?.en === filterColor
              )
            )
            if (!hasColor) return false
          }

          return true
        })
      }

      // Get filter aggregations
      const filterAggregations = await this.getFilterAggregations(query, locale)

      // Get search suggestions if query is provided
      const suggestions = query ? await this.getSearchSuggestions(query, locale) : []

      const searchResults: SearchResults = {
        products: filteredProducts,
        total: filteredProducts.length, // Use filtered count after smart category filtering
        filters: filterAggregations,
        suggestions
      }

      // Store search analytics
      await this.logSearchAnalytics(query, filters, filteredProducts.length)

      return { data: searchResults, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Get search suggestions
  static async getSearchSuggestions(
    query: string,
    locale: string = 'he',
    limit: number = 5
  ): Promise<string[]> {
    try {
      if (!supabase) {
        // Use mock data for suggestions
        const searchTerm = query.toLowerCase()
        return mockProducts
          .filter(product => {
            const name = product.name[locale as keyof typeof product.name] || product.name.en
            return name.toLowerCase().includes(searchTerm)
          })
          .slice(0, limit)
          .map(product => product.name[locale as keyof typeof product.name] || product.name.en)
      }

      const nameField = locale === 'he' ? 'name_he' : locale === 'ar' ? 'name_ar' : 'name_en'
      
      const { data } = await supabase
        .from('products')
        .select(nameField)
        .eq('is_active', true)
        .ilike(nameField, `%${query}%`)
        .limit(limit)

      return data?.map(product => (product as any)[nameField]) || []
    } catch (error) {
      return []
    }
  }

  // Get autocomplete suggestions
  static async getAutocompleteSuggestions(
    query: string,
    locale: string = 'he'
  ): Promise<SearchSuggestion[]> {
    try {
      const suggestions: SearchSuggestion[] = []
      
      if (query.length < 2) return suggestions

      if (!supabase) {
        // Use mock data for autocomplete
        const searchTerm = query.toLowerCase()
        
        // Product suggestions
        mockProducts
          .filter(product => {
            const name = product.name[locale as keyof typeof product.name] || product.name.en
            return name.toLowerCase().includes(searchTerm)
          })
          .slice(0, 5)
          .forEach(product => {
            suggestions.push({
              text: product.name[locale as keyof typeof product.name] || product.name.en,
              type: 'product'
            })
          })

        // Category suggestions
        const categories = await this.getCategorySuggestions(query, locale)
        suggestions.push(...categories)

        return suggestions.slice(0, 8)
      }

      // Product name suggestions
      const nameField = locale === 'he' ? 'name_he' : locale === 'ar' ? 'name_ar' : 'name_en'
      const { data: products } = await supabase
        .from('products')
        .select(`${nameField}, category, brand`)
        .eq('is_active', true)
        .ilike(nameField, `%${query}%`)
        .limit(5)

      products?.forEach(product => {
        suggestions.push({
          text: (product as any)[nameField],
          type: 'product'
        })
      })

      // Category suggestions
      const categories = await this.getCategorySuggestions(query, locale)
      suggestions.push(...categories)

      // Brand suggestions
      const brands = await this.getBrandSuggestions(query)
      suggestions.push(...brands)

      return suggestions.slice(0, 8) // Limit total suggestions
    } catch (error) {
      return []
    }
  }

  // Get trending searches
  static async getTrendingSearches(locale: string = 'he', limit: number = 10): Promise<string[]> {
    try {
      if (!supabase) {
        // Return default trending searches for mock data
        const trendingTerms = ['בנים', 'בנות', 'תינוקות', 'שמלות', 'נעליים', 'מכנסיים', 'טישרטים', 'חורף']
        return trendingTerms.slice(0, limit)
      }

      // This would typically come from analytics data
      // For now, return popular categories and products
      const nameField = locale === 'he' ? 'name_he' : locale === 'ar' ? 'name_ar' : 'name_en'
      
      const { data } = await supabase
        .from('products')
        .select(nameField)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(limit)

      return data?.map(product => (product as any)[nameField]) || []
    } catch (error) {
      return []
    }
  }

  // Search by barcode or SKU
  static async searchByCode(code: string): Promise<{ data: Product | null; error: string | null }> {
    try {
      if (!supabase) {
        // Search mock data by id (since we don't have SKU/barcode in mock data)
        const product = mockProducts.find(p => p.id === code)
        return { data: product || null, error: product ? null : 'Product not found' }
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`sku.eq.${code},barcode.eq.${code}`)
        .eq('is_active', true)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Get filter aggregations for faceted search
  private static async getFilterAggregations(query: string = '', locale: string = 'he') {
    try {
      if (!supabase) {
        // Use mock data for aggregations
        let products = mockProducts

        if (query.trim()) {
          const searchTerm = query.toLowerCase()
          products = mockProducts.filter(product => {
            const name = product.name[locale as keyof typeof product.name] || product.name.en
            const description = product.description?.[locale as keyof typeof product.description] || product.description?.en || ''
            return name.toLowerCase().includes(searchTerm) || description.toLowerCase().includes(searchTerm)
          })
        }

        // Create aggregations from mock data
        const categories = Array.from(new Set(products.map(p => p.category)))
        const prices = products.map(p => p.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return {
          categories: categories.map(cat => ({ value: cat, count: products.filter(p => p.category === cat).length })),
          priceRange: { min: minPrice, max: maxPrice },
          sizes: [],
          colors: [],
          brands: []
        }
      }

      // Get all active products for aggregations
      let baseQuery = supabase
        .from('products')
        .select('category, price, sizes, colors, brand, age_group, gender')
        .eq('is_active', true)

      if (query.trim()) {
        const nameField = locale === 'he' ? 'name_he' : locale === 'ar' ? 'name_ar' : 'name_en'
        const descField = locale === 'he' ? 'description_he' : locale === 'ar' ? 'description_ar' : 'description_en'
        baseQuery = baseQuery.or(`${nameField}.ilike.%${query}%,${descField}.ilike.%${query}%`)
      }

      const { data: products } = await baseQuery

      if (!products) {
        return {
          categories: [],
          priceRange: { min: 0, max: 0 },
          sizes: [],
          colors: [],
          brands: []
        }
      }

      // Aggregate categories
      const categoryCount: Record<string, number> = {}
      const brandCount: Record<string, number> = {}
      const sizeCount: Record<string, number> = {}
      const colorCount: Record<string, number> = {}
      let minPrice = Infinity
      let maxPrice = 0

      products.forEach(product => {
        // Categories
        if (product.category) {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
        }

        // Brands
        if (product.brand) {
          brandCount[product.brand] = (brandCount[product.brand] || 0) + 1
        }

        // Price range
        const price = parseFloat(product.price) || 0
        minPrice = Math.min(minPrice, price)
        maxPrice = Math.max(maxPrice, price)

        // Sizes
        if (product.sizes) {
          product.sizes.forEach((size: string) => {
            sizeCount[size] = (sizeCount[size] || 0) + 1
          })
        }

        // Colors
        if (product.colors) {
          product.colors.forEach((color: any) => {
            const colorName = color.name?.[locale] || color.name?.en || 'Unknown'
            colorCount[colorName] = (colorCount[colorName] || 0) + 1
          })
        }
      })

      return {
        categories: Object.entries(categoryCount).map(([value, count]) => ({ value, count })),
        priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
        sizes: Object.entries(sizeCount).map(([value, count]) => ({ value, count })),
        colors: Object.entries(colorCount).map(([value, count]) => ({ value, count })),
        brands: Object.entries(brandCount).map(([value, count]) => ({ value, count }))
      }
    } catch (error) {
      return {
        categories: [],
        priceRange: { min: 0, max: 0 },
        sizes: [],
        colors: [],
        brands: []
      }
    }
  }

  // Get category suggestions
  private static async getCategorySuggestions(query: string, locale: string): Promise<SearchSuggestion[]> {
    const categories = ['baby', 'kids', 'womens', 'home', 'toys', 'gear', 'dress', 'outlet']
    const suggestions: SearchSuggestion[] = []

    categories.forEach(category => {
      if (category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          text: category,
          type: 'category'
        })
      }
    })

    return suggestions
  }

  // Get brand suggestions
  private static async getBrandSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      if (!supabase) {
        // Mock brands for fallback
        const mockBrands = ['Mini Moda', 'Kids Style', 'Little Fashions']
        const filteredBrands = mockBrands.filter(brand => 
          brand.toLowerCase().includes(query.toLowerCase())
        )
        
        return filteredBrands.map(brand => ({
          text: brand,
          type: 'brand' as const
        }))
      }

      const { data } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .ilike('brand', `%${query}%`)
        .limit(3)

      const uniqueBrands = Array.from(new Set(data?.map(p => p.brand) || []))
      
      return uniqueBrands.map(brand => ({
        text: brand,
        type: 'brand' as const
      }))
    } catch (error) {
      return []
    }
  }

  // Log search analytics
  private static async logSearchAnalytics(
    query: string,
    filters: SearchFilters,
    resultCount: number
  ) {
    try {
      if (!supabase) {
        // Skip analytics logging if Supabase not configured
        return
      }

      await supabase
        .from('analytics')
        .insert({
          date: new Date().toISOString().split('T')[0],
          event_type: 'search',
          metadata: {
            query,
            filters,
            result_count: resultCount
          }
        })
    } catch (error) {
      console.error('Error logging search analytics:', error)
    }
  }

  // Get popular search terms
  static async getPopularSearches(locale: string = 'he', limit: number = 10): Promise<string[]> {
    try {
      if (!supabase) {
        // Return default popular searches for mock data
        const popularTerms = ['בנים', 'בנות', 'תינוקות', 'שמלות', 'נעליים', 'חולצות', 'מכנסיים', 'טישרטים']
        return popularTerms.slice(0, limit)
      }

      const { data } = await supabase
        .from('analytics')
        .select('metadata')
        .eq('event_type', 'search')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .limit(100)

      if (!data) return []

      // Count query frequency
      const queryCount: Record<string, number> = {}
      data.forEach(record => {
        const query = record.metadata?.query
        if (query && query.trim()) {
          queryCount[query] = (queryCount[query] || 0) + 1
        }
      })

      // Sort by frequency and return top results
      return Object.entries(queryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([query]) => query)
    } catch (error) {
      return []
    }
  }

  // Fallback search using mock data
  private static async searchMockProducts(
    query: string = '',
    filters: SearchFilters = {},
    locale: string = 'he'
  ): Promise<{ data: SearchResults | null; error: string | null }> {
    try {
      let filteredProducts = [...mockProducts]

      // Text search
      if (query.trim()) {
        const searchTerm = query.toLowerCase().trim()
        filteredProducts = filteredProducts.filter(product => {
          const name = product.name[locale as keyof typeof product.name] || product.name.en
          const description = product.description?.[locale as keyof typeof product.description] || product.description?.en || ''
          return name.toLowerCase().includes(searchTerm) || 
                 description.toLowerCase().includes(searchTerm) ||
                 product.category.toLowerCase().includes(searchTerm)
        })
      }

      // Apply filters
      if (filters.category?.length) {
        filteredProducts = filteredProducts.filter(p => filters.category!.includes(p.category))
      }

      if (filters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.priceMin!)
      }

      if (filters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.priceMax!)
      }

      if (filters.onSale) {
        filteredProducts = filteredProducts.filter(p => p.isSale)
      }

      if (filters.newArrivals) {
        filteredProducts = filteredProducts.filter(p => p.isNew)
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        case 'name':
          filteredProducts.sort((a, b) => {
            const nameA = a.name[locale as keyof typeof a.name] || a.name.en
            const nameB = b.name[locale as keyof typeof b.name] || b.name.en
            return nameA.localeCompare(nameB)
          })
          break
        case 'featured':
        default:
          filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          break
      }

      // Pagination
      const offset = filters.offset || 0
      const limit = filters.limit || 50
      const paginatedProducts = filteredProducts.slice(offset, offset + limit)

      // Create mock filter aggregations
      const categories = Array.from(new Set(mockProducts.map(p => p.category)))
      const prices = mockProducts.map(p => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      const searchResults: SearchResults = {
        products: paginatedProducts,
        total: filteredProducts.length,
        filters: {
          categories: categories.map(cat => ({ value: cat, count: mockProducts.filter(p => p.category === cat).length })),
          priceRange: { min: minPrice, max: maxPrice },
          sizes: [],
          colors: [],
          brands: []
        },
        suggestions: []
      }

      return { data: searchResults, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }
}
