'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { formatCurrency } from '@/lib/utils/currency'
import { productService } from '@/lib/supabase/products-service'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import type { Product } from '@/lib/types'
import type { BaseProps } from '@/lib/types'

interface ProductCardMinimalProps extends BaseProps {
  product: Product
  priority?: boolean
}

export function ProductCardMinimal({ 
  product, 
  locale, 
  priority = false 
}: ProductCardMinimalProps) {
  
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  // Cycle through images on hover (max 2 images)
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.images.length > 1) {
      setCurrentImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
  }

  const handleProductClick = useCallback(async () => {
    try {
      // Track product click event
      await productService.analyticsService.trackView(product.id, {
        product_name: product.name[locale] || product.name.en,
        category: product.category,
        price: product.price,
        currency: 'ILS',
        brand: product.brand || 'Minimoda',
        event_type: 'product_click'
      })
    } catch (error) {
      console.error('Error tracking product click:', error)
    }
  }, [product.id, product.name, product.category, product.price, product.brand, locale])

  return (
    <motion.article
      ref={inViewRef}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
        <ImageWithFallback
          src={product.images[currentImageIndex] || product.images[0] || "/images/product-placeholder.svg"}
          fallbackSrc="/images/product-placeholder.svg"
          alt={product.name[locale] || product.name.en}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-102"
          priority={priority}
        />
        
        {/* Sale Badge */}
        {product.isSale && product.originalPrice && (
          <div className="absolute top-3 left-3 bg-coral-500 text-white px-2 py-1 text-xs font-medium rounded">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && !product.isSale && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 text-xs font-medium rounded">
            NEW
          </div>
        )}
        
        {/* Subtle image transition */}
        {product.images.length > 1 && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Product Info - Clean and minimal */}
      <div className="p-4">
        <Link href={`/${locale}/product/${product.id}`} className="block" onClick={handleProductClick}>
          
          {/* Brand Name - Small caps */}
          <p className="text-xs font-nav text-neutral-400 mb-1 tracking-wide">
            MINIMODA
          </p>
          
          {/* Product Name */}
          <h3 className="text-sm font-body font-normal text-charcoal-800 mb-2 line-clamp-2 leading-relaxed">
            {product.name[locale] || product.name.en}
          </h3>
          
          {/* Price - Clean typography */}
          <div className="flex items-center">
            <span className="text-sm font-body text-charcoal-700">
{formatCurrency(product.price, locale as 'he' | 'ar' | 'en')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through ml-2">
{formatCurrency(product.originalPrice, locale as 'he' | 'ar' | 'en')}
              </span>
            )}
          </div>
        </Link>

        {/* Color swatches - minimal dots */}
        {product.colors.length > 1 && (
          <div className="flex gap-1 mt-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.hex }}
                aria-label={color.name.en}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-3 h-3 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="text-xs text-neutral-500 leading-none">+</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
