'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { SearchService } from '@/lib/services/search-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductsPageContent } from '@/components/sections/products-page-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function ProductsClient({ locale }: { locale: Locale }) {
  const [products, setProducts] = useState<Product[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchResults, setIsSearchResults] = useState(false)
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Get search parameters from URL
        const searchTerm = searchParams.get('search')
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sortBy = searchParams.get('sortBy')

        if (searchTerm || category || brand || minPrice || maxPrice) {
          // Use SearchService for filtered/search results
          setIsSearchResults(true)
          setSearchQuery(searchTerm || '')
          
          const filters = {
            ...(category && { category: [category] }),
            ...(brand && { brands: [brand] }),
            ...(minPrice && { priceMin: parseFloat(minPrice) }),
            ...(maxPrice && { priceMax: parseFloat(maxPrice) }),
            ...(sortBy && { sortBy: sortBy as any })
          }

          const { data, error } = await SearchService.searchProducts(
            searchTerm || '',
            filters,
            locale
          )

          if (error) {
            console.error('Search error:', error)
            setProducts([])
          } else {
            setProducts(data?.products || [])
          }
        } else {
          // Load all products (default behavior)
          setIsSearchResults(false)
          setSearchQuery('')
          const allProducts = await productService.getAll(locale)
          setProducts(allProducts)
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale, searchParams])

  if (isLoading || !dictionary) {
    return (
      <div className="min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="bg-maisonette-cream">
        {/* Search Results Header */}
        {isSearchResults && (
          <div className="bg-white border-b">
            <div className="max-w-screen-xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchQuery ? (
                      locale === 'he' ? `תוצאות חיפוש עבור "${searchQuery}"` :
                      locale === 'ar' ? `نتائج البحث عن "${searchQuery}"` :
                      `Search results for "${searchQuery}"`
                    ) : (
                      locale === 'he' ? 'תוצאות מסוננות' :
                      locale === 'ar' ? 'نتائج مفلترة' :
                      'Filtered results'
                    )}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {products.length === 0 ? (
                      locale === 'he' ? 'לא נמצאו תוצאות' :
                      locale === 'ar' ? 'لم يتم العثور على نتائج' :
                      'No results found'
                    ) : (
                      `${products.length} ${locale === 'he' ? 'פריטים נמצאו' : 
                                             locale === 'ar' ? 'عنصر موجود' :
                                             'items found'}`
                    )}
                  </p>
                </div>
                
                {searchQuery && (
                  <button
                    onClick={() => window.location.href = `/${locale}/products`}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {locale === 'he' ? 'צפה בכל המוצרים' :
                     locale === 'ar' ? 'عرض جميع المنتجات' :
                     'View all products'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <ProductsPageContent 
          products={products}
          locale={locale}
          dictionary={dictionary}
          searchQuery={searchQuery}
          isSearchResults={isSearchResults}
        />
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}