'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductsPageContent } from '@/components/sections/products-page-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function BrandsClient({ locale }: { locale: Locale }) {
  const [products, setProducts] = useState<Product[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Load products from Supabase or mock data
        const allProducts = await productService.getAll(locale)
        console.log(`Loaded ${allProducts.length} total products`)
        setProducts(allProducts)

        // Extract unique brands
        const brandArray = allProducts.map(p => p.brand).filter(Boolean) as string[]
        const uniqueBrands = Array.from(new Set(brandArray))
        setBrands(uniqueBrands)
        console.log(`Found ${uniqueBrands.length} brands:`, uniqueBrands)
      } catch (error) {
        console.error('Error loading brands data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale])

  const filteredProducts = selectedBrand === 'all' 
    ? products 
    : products.filter(p => p.brand === selectedBrand)

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
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-maisonette-blue-50 to-maisonette-cream">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-maisonette-blue-900 mb-6">
                {locale === 'he' ? 'מותגי פרימיום' : 
                 locale === 'ar' ? 'العلامات التجارية المميزة' : 
                 'Premium Brands'}
              </h1>
              <p className="text-lg text-maisonette-blue-700 max-w-2xl mx-auto">
                {locale === 'he' ? 'גלו את מגוון המותגים הטובים ביותר לילדים במקום אחד' :
                 locale === 'ar' ? 'اكتشف أفضل ماركات الأطفال في مكان واحد' :
                 'Discover the finest children\'s brands all in one place'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Brand Filter */}
        <section className="py-12">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.button
                key="all"
                onClick={() => setSelectedBrand('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedBrand === 'all'
                    ? 'bg-maisonette-blue-600 text-white shadow-lg'
                    : 'bg-white text-maisonette-blue-600 hover:bg-maisonette-blue-50 border border-maisonette-blue-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {locale === 'he' ? 'כל המותגים' : 
                 locale === 'ar' ? 'جميع الماركات' : 
                 'All Brands'} ({products.length})
              </motion.button>
              
              {brands.map((brand) => {
                const brandCount = products.filter(p => p.brand === brand).length
                return (
                  <motion.button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedBrand === brand
                        ? 'bg-maisonette-blue-600 text-white shadow-lg'
                        : 'bg-white text-maisonette-blue-600 hover:bg-maisonette-blue-50 border border-maisonette-blue-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {brand} ({brandCount})
                  </motion.button>
                )
              })}
            </div>

            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-maisonette-blue-600">
                {selectedBrand === 'all' 
                  ? (locale === 'he' ? `${filteredProducts.length} מוצרים ממותגים מובחרים` :
                     locale === 'ar' ? `${filteredProducts.length} منتج من ماركات مختارة` :
                     `${filteredProducts.length} products from selected brands`)
                  : (locale === 'he' ? `${filteredProducts.length} מוצרים מ-${selectedBrand}` :
                     locale === 'ar' ? `${filteredProducts.length} منتج من ${selectedBrand}` :
                     `${filteredProducts.length} products from ${selectedBrand}`)
                }
              </p>
            </div>

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-maisonette-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🏷️</span>
                  </div>
                  <h3 className="text-xl font-fredoka font-semibold text-maisonette-blue-900 mb-2">
                    {locale === 'he' ? `אין מוצרים מ-${selectedBrand}` : 
                     locale === 'ar' ? `لا توجد منتجات من ${selectedBrand}` : 
                     `No ${selectedBrand} Products`}
                  </h3>
                  <p className="text-maisonette-blue-600 mb-6">
                    {locale === 'he' ? 'נסו לבחור מותג אחר או עיינו בכל המוצרים' :
                     locale === 'ar' ? 'جرب اختيار ماركة أخرى أو تصفح جميع المنتجات' :
                     'Try selecting another brand or browse all products'}
                  </p>
                  <motion.button
                    onClick={() => setSelectedBrand('all')}
                    className="bg-maisonette-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-maisonette-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {locale === 'he' ? 'כל המותגים' : 
                     locale === 'ar' ? 'جميع الماركات' : 
                     'All Brands'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
                            <ProductsPageContent
                products={filteredProducts}
                locale={locale}
                dictionary={dictionary}
                categoryTitle={selectedBrand !== 'all' 
                  ? `${selectedBrand} ${locale === 'he' ? 'קולקציה' : locale === 'ar' ? 'مجموعة' : 'Collection'}`
                  : undefined
                }
              />
            )}
          </div>
        </section>
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}
