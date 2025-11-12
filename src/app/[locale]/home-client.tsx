'use client'

import { useEffect, useState } from 'react'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { HeroMaisonette } from '@/components/sections/hero-maisonette'

import { NewArrivalsMaisonette } from '@/components/sections/new-arrivals-maisonette'
import { FeaturedBrands } from '@/components/sections/featured-brands'
import { DiverseCategories } from '@/components/sections/diverse-categories'

import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { NavigationSkeleton, HeroSkeleton, ProductCardSkeleton } from '@/components/ui/skeleton'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'

interface HomeClientProps {
  locale: Locale
}

export default function HomeClient({ locale }: HomeClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Load products from Supabase or mock data
        const allProducts = await productService.getAll(locale)
        setProducts(allProducts)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale])

  if (isLoading || !dictionary) {
    return (
      <>
        <NavigationSkeleton />
        <HeroSkeleton />
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    )
  }

  // Get new arrivals for the minimal homepage
  const newArrivals = products.filter(p => p.isNew).slice(0, 8)

  const handleRefresh = async () => {
    // Refresh the page
    window.location.reload()
  }

    return (
    <PullToRefresh onRefresh={handleRefresh}>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="bg-maisonette-cream">
        {/* Hero Section - Minimal */}
        <HeroMaisonette locale={locale} dictionary={dictionary} />

        {/* Diverse Categories - Mixed Layouts */}
        <DiverseCategories locale={locale} />

        {/* New Arrivals Section */}
        <NewArrivalsMaisonette products={newArrivals} locale={locale} dictionary={dictionary} />

        {/* Featured Brands */}
        <FeaturedBrands locale={locale} dictionary={dictionary} />
      </main>

      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </PullToRefresh>
  )
}
