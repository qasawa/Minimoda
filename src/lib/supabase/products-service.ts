import { createClient } from '@supabase/supabase-js'
import { Database } from './client'
import { products as mockProducts } from '@/lib/data/products'
import { Product, Locale } from '@/lib/types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co'

export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Transform database product to app Product type
function transformDbProduct(dbProduct: any, locale: Locale = 'en'): Product {
  return {
    id: dbProduct.id,
    name: {
      en: dbProduct.name_en,
      he: dbProduct.name_he,
      ar: dbProduct.name_ar
    },
    description: {
      en: dbProduct.description_en,
      he: dbProduct.description_he,
      ar: dbProduct.description_ar
    },
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    colors: dbProduct.colors || [],
    sizes: dbProduct.sizes || [],
    isSale: dbProduct.is_sale,
    isNew: dbProduct.is_new || false,
    featured: dbProduct.is_featured,
    age: dbProduct.age_group || '2-8',
    brand: dbProduct.brand || 'Minimoda',
    stock: dbProduct.stock || 0,
    tags: dbProduct.tags || [],
    createdAt: dbProduct.created_at,
    discount: dbProduct.discount || 0,
    isExclusive: dbProduct.is_exclusive || false
  }
}

// Product service functions
export const productService = {
  // Get all products
  async getAll(locale: Locale = 'en') {
    // Use mock data if Supabase not configured
    if (!supabase) {
      return mockProducts
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return data ? data.map(p => transformDbProduct(p, locale)) : []
    } catch (error) {
      console.warn('Falling back to mock data:', error)
      return mockProducts
    }
  },

  // Get single product
  async getById(id: string, locale: Locale = 'en') {
    if (!supabase) {
      const product = mockProducts.find(p => p.id === id)
      return product || null
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data ? transformDbProduct(data, locale) : null
    } catch (error) {
      console.warn('Falling back to mock data:', error)
      return mockProducts.find(p => p.id === id) || null
    }
  },

  // Create product (admin only)
  async create(product: any) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update product (admin only)
  async update(id: string, updates: any) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete product (admin only)
  async delete(id: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  },

  // Get inventory for product
  async getInventory(productId: string) {
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
    
    if (error) throw error
    return data || []
  },

  // Update inventory
  async updateInventory(productId: string, size: string, colorIndex: number, quantity: number) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('inventory')
      .upsert({
        product_id: productId,
        size,
        color_index: colorIndex,
        stock_quantity: quantity,
        last_updated: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Add analytics reference
  get analyticsService() {
    return analyticsService
  }
}

// Analytics service
export const analyticsService = {
  // Track product view and other events
  async trackView(productId: string, eventData?: any) {
    if (!supabase) return

    // Generate a session ID if not provided
    const sessionId = eventData?.session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { error } = await supabase
      .from('analytics')
      .insert({
        event_type: eventData?.event_type || 'product_view',
        product_id: productId,
        session_id: sessionId,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        event_data: eventData || {}
      })
    
    if (error) console.error('Analytics error:', error)
  },

  // Get product analytics
  async getProductAnalytics(productId: string) {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('product_id', productId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    return data || []
  }
}
