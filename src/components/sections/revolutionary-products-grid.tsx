'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevolutionaryProductCard } from '@/components/ui/revolutionary-product-card'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface RevolutionaryProductsGridProps {
  products: Product[]
  locale: string
  className?: string
  title?: string
  subtitle?: string
  layout?: 'staggered' | 'masonry' | 'grid' | 'featured'
  maxProducts?: number
  showFilters?: boolean
}

export function RevolutionaryProductsGrid({
  products,
  locale,
  className,
  title,
  subtitle,
  layout = 'staggered',
  maxProducts,
  showFilters = false
}: RevolutionaryProductsGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular')

  // Smart filters
  const filters = [
    { id: 'all', name: { en: 'All', he: 'הכל', ar: 'الكل' } },
    { id: 'new', name: { en: 'New', he: 'חדש', ar: 'جديد' } },
    { id: 'sale', name: { en: 'Sale', he: 'מבצע', ar: 'تخفيض' } },
    { id: 'organic', name: { en: 'Organic', he: 'אורגני', ar: 'عضوي' } },
    { id: 'popular', name: { en: 'Popular', he: 'פופולרי', ar: 'شائع' } }
  ]

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = products

    // Apply filter
    if (selectedFilter !== 'all') {
      filtered = products.filter(product => {
        switch (selectedFilter) {
          case 'new':
            return product.isNew
          case 'sale':
            return product.originalPrice && product.originalPrice > product.price
          case 'organic':
            return product.tags?.includes('organic')
          case 'popular':
            return product.parentReviews?.overallRating && product.parentReviews.overallRating >= 4.5
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'popular':
        default:
          return (b.parentReviews?.overallRating || 0) - (a.parentReviews?.overallRating || 0)
      }
    })

    // Limit products if specified
    if (maxProducts) {
      filtered = filtered.slice(0, maxProducts)
    }

    return filtered
  }, [products, selectedFilter, sortBy, maxProducts])

  // Generate staggered layout classes
  const getStaggeredClasses = (index: number) => {
    if (layout === 'masonry') {
      // Create varied heights for masonry effect
      const heights = ['row-span-1', 'row-span-2', 'row-span-1', 'row-span-3', 'row-span-1', 'row-span-2']
      return heights[index % heights.length]
    }
    
    if (layout === 'featured') {
      // First item is featured (large), then smaller items
      if (index === 0) return 'md:col-span-2 md:row-span-2'
      return ''
    }
    
    // Staggered layout with varied sizes
    if (layout === 'staggered') {
      const patterns = ['', 'md:col-span-2', '', '', 'md:row-span-2', '']
      return patterns[index % patterns.length]
    }
    
    return ''
  }

  const getGridClasses = () => {
    switch (layout) {
      case 'masonry':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min'
      case 'featured':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'
      case 'staggered':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    }
  }

  return (
    <section className={cn("py-16 bg-gradient-to-b from-white to-gray-50", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title && (
              <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Filters and Sorting */}
        {showFilters && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 mb-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Filter Tabs */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {locale === 'he' ? 'סנן לפי:' :
                 locale === 'ar' ? 'تصفية حسب:' :
                 'Filter by:'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      selectedFilter === filter.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.name[locale as keyof typeof filter.name] || filter.name.en}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {locale === 'he' ? 'מיין לפי:' :
                 locale === 'ar' ? 'ترتيب حسب:' :
                 'Sort by:'}
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="popular">
                  {locale === 'he' ? 'הכי פופולרי' :
                   locale === 'ar' ? 'الأكثر شعبية' :
                   'Most Popular'}
                </option>
                <option value="newest">
                  {locale === 'he' ? 'הכי חדש' :
                   locale === 'ar' ? 'الأحدث' :
                   'Newest'}
                </option>
                <option value="price-low">
                  {locale === 'he' ? 'מחיר: נמוך לגבוה' :
                   locale === 'ar' ? 'السعر: منخفض إلى مرتفع' :
                   'Price: Low to High'}
                </option>
                <option value="price-high">
                  {locale === 'he' ? 'מחיר: גבוה לנמוך' :
                   locale === 'ar' ? 'السعر: مرتفع إلى منخفض' :
                   'Price: High to Low'}
                </option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Products Count */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{processedProducts.length}</span>
            {' '}
            {locale === 'he' ? 'מוצרים' :
             locale === 'ar' ? 'منتجات' :
             'products'}
            {selectedFilter !== 'all' && (
              <span className="text-sm text-gray-500 ml-2">
                ({locale === 'he' ? 'מסונן' :
                  locale === 'ar' ? 'مصفى' :
                  'filtered'})
              </span>
            )}
          </p>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Layout:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['staggered', 'masonry', 'grid'].map((layoutType) => (
                <button
                  key={layoutType}
                  onClick={() => {}}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                    layout === layoutType
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedFilter}-${sortBy}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={getGridClasses()}
          >
            {processedProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "transform transition-all duration-500",
                  getStaggeredClasses(index)
                )}
              >
                <RevolutionaryProductCard
                  product={product}
                  locale={locale}
                  staggerIndex={index}
                  variant={layout === 'featured' && index === 0 ? 'featured' : 'default'}
                  priority={index < 4}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {maxProducts && processedProducts.length >= maxProducts && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {locale === 'he' ? 'טען עוד מוצרים' :
                 locale === 'ar' ? 'تحميل المزيد من المنتجات' :
                 'Load More Products'}
              </span>
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ⬇️
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {/* No Products Found */}
        {processedProducts.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'he' ? 'לא נמצאו מוצרים' :
               locale === 'ar' ? 'لم يتم العثور على منتجات' :
               'No Products Found'}
            </h3>
            <p className="text-gray-600 mb-8">
              {locale === 'he' ? 'נסו לשנות את הפילטרים או חפשו משהו אחר' :
               locale === 'ar' ? 'حاولوا تغيير المرشحات أو البحث عن شيء آخر' :
               'Try changing your filters or search for something else'}
            </p>
            <motion.button
              onClick={() => setSelectedFilter('all')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {locale === 'he' ? 'נקה פילטרים' :
               locale === 'ar' ? 'مسح المرشحات' :
               'Clear Filters'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
