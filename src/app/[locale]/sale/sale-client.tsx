'use client'

import { useEffect, useState } from 'react'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductsPageContent } from '@/components/sections/products-page-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function SaleClient({ locale }: { locale: Locale }) {
  const [products, setProducts] = useState<Product[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Load sale products from Supabase or mock data
        const allProducts = await productService.getAll(locale)
        // Filter only sale products
        const saleProducts = allProducts.filter(product => product.isSale)
        setProducts(saleProducts)
      } catch (error) {
        console.error('Error loading sale data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale])

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
        <ProductsPageContent 
          products={products}
          locale={locale}
          dictionary={dictionary}
          categoryTitle={locale === 'he' ? 'מבצעים חמים' :
                      locale === 'ar' ? 'تخفيضات ساخنة' :
                      'Hot Sale'}
        />
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}
