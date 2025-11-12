'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown, Grid2X2, List } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ProductCardMinimal } from '@/components/ui/product-card-minimal'
import { CategorySystem, getSmartCategories, getBasicCategories } from '@/lib/utils/category-system'
import { Locale } from '@/lib/types'



interface ProductsPageContentProps {
  products: any[]
  locale: Locale
  dictionary: any
  categoryTitle?: string
  searchQuery?: string
  isSearchResults?: boolean
}

export function ProductsPageContent({ products, locale, dictionary, categoryTitle }: ProductsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColorHexes, setSelectedColorHexes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState<string>('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  
  const isRTL = locale === 'ar' || locale === 'he'

  // Get categories using unified system - prioritize smart categories
  const smartCategories = getSmartCategories()
  const basicCategories = getBasicCategories()
  
  // Build category options for filter
  const categories = [
    'all',
    ...smartCategories.map(cat => cat.id),
    // Add divider for basic categories
    'divider',
    ...basicCategories.map(cat => cat.id)
  ]
  const sizes = ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M', '2T', '3T', '4T', '5', '6', '7', '8']
  const colors = [
    { name: 'Coral', hex: '#FF6B6B' },
    { name: 'Mint', hex: '#4ECDC4' },
    { name: 'Yellow', hex: '#FFE66D' },
    { name: 'Blue', hex: '#5DADE2' },
    { name: 'Navy', hex: '#2C3E50' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Grey', hex: '#808080' },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter using unified system
    if (selectedCategory !== 'all' && selectedCategory !== 'divider') {
      filtered = CategorySystem.filterProductsByCategory(filtered, selectedCategory)
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some((size: string) => selectedSizes.includes(size))
      )
    }

    // Color filter
    if (selectedColorHexes.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some((color: any) => selectedColorHexes.includes(color.hex))
      )
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return filtered
  }, [products, selectedCategory, selectedSizes, selectedColorHexes, priceRange, sortBy])

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColorHexes(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSizes([])
    setSelectedColorHexes([])
    setPriceRange([0, 100])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-fredoka font-bold text-gray-900">
            {categoryTitle || dictionary.navigation.collections}
          </h1>
          <p className="text-gray-600 mt-2">
            {filteredProducts.length} {dictionary.products.items}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4 me-2" />
            {dictionary.common.filter}
          </Button>

          {/* Layout Toggle */}
          <div className="hidden sm:flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setLayout('grid')}
              className={cn(
                "p-2 rounded transition-all",
                layout === 'grid' ? "bg-white shadow-sm" : "hover:bg-gray-200"
              )}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn(
                "p-2 rounded transition-all",
                layout === 'list' ? "bg-white shadow-sm" : "hover:bg-gray-200"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[150px] justify-between"
            >
              {dictionary.products.sortBy[sortBy] || dictionary.products.sortBy.featured}
              <ChevronDown className="h-4 w-4 ms-2" />
            </Button>
            <div className="absolute top-full end-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {Object.entries(dictionary.products.sortBy).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={cn(
                    "block w-full px-4 py-2 text-start text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg",
                    sortBy === key && "bg-coral-50 text-coral-600"
                  )}
                >
                  {String(value)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{dictionary.common.filter}</h2>
              {(selectedCategory !== 'all' || selectedSizes.length > 0 || selectedColorHexes.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-coral-500 hover:text-coral-600"
                >
                  {dictionary.common.clearAll}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">{dictionary.products.category}</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-coral-500 focus:ring-coral-500"
                    />
                    <span className="text-sm group-hover:text-coral-500">
                      {category === 'all' 
                        ? dictionary.common.all || 'All'
                        : dictionary.navigation[category] || category
                      }
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">{dictionary.products.sizes}</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-lg border transition-all",
                      selectedSizes.includes(size)
                        ? "border-coral-500 bg-coral-50 text-coral-600"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">{dictionary.products.colors}</h3>
              <div className="grid grid-cols-4 gap-3">
                {colors.map(color => (
                  <button
                    key={color.hex}
                    onClick={() => toggleColor(color.hex)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all",
                      selectedColorHexes.includes(color.hex)
                        ? "border-gray-900 scale-110 shadow-lg"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">{dictionary.products.price}</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedSizes.join('-')}-${selectedColorHexes.join('-')}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                layout === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                  : "space-y-4"
              )}
            >
              {filteredProducts.map((product) => (
                                  <ProductCardMinimal
                  key={product.id}
                  product={product}
                  locale={locale}
                  dictionary={dictionary}

                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {dictionary.products.noResults || 'No products found'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search terms to find what you&apos;re looking for.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-coral-500 hover:bg-coral-600 text-white"
              >
                {dictionary.common.clearAll}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              className={cn(
                "fixed top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto",
                isRTL ? 'left-0' : 'right-0'
              )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{dictionary.common.filter}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile filters content (same as desktop) */}
                {/* Category Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{dictionary.products?.category || 'Category'}</h3>
                  <div className="space-y-2">
                    {categories.map(category => {
                      // Handle divider
                      if (category === 'divider') {
                        return (
                          <div key="divider" className="border-t border-gray-200 my-3 pt-2">
                            <span className="text-xs text-gray-500 font-medium">Basic Categories</span>
                          </div>
                        )
                      }
                      
                      // Get category definition
                      const categoryDef = CategorySystem.getCategoryBySlug(category)
                      const displayName = category === 'all' 
                        ? dictionary.common?.all || 'All Products'
                        : categoryDef?.name[locale] || category
                      
                      return (
                        <label
                          key={category}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-4 h-4 text-coral-500 focus:ring-coral-500"
                          />
                          <span className="text-sm group-hover:text-coral-500">
                            {displayName}
                            {categoryDef?.type === 'smart' && (
                              <span className="ml-1 text-xs text-coral-500">✨</span>
                            )}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{dictionary.products.sizes}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg border transition-all",
                          selectedSizes.includes(size)
                            ? "border-coral-500 bg-coral-50 text-coral-600"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{dictionary.products.colors}</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map(color => (
                      <button
                        key={color.hex}
                        onClick={() => toggleColor(color.hex)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          selectedColorHexes.includes(color.hex)
                            ? "border-gray-900 scale-110 shadow-lg"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{dictionary.products.price}</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="pt-6 border-t">
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}