'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCart } from '@/lib/contexts/cart-context'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'
import { LazyAnimationWrapper } from '@/components/ui/lazy-motion'
import { useIsMobile, useReducedMotion } from '@/lib/hooks/use-media-query'

interface OptimizedProductCardProps {
  product: Product
  locale: string
  className?: string
  priority?: boolean
}

export function OptimizedProductCard({
  product,
  locale,
  className,
  priority = false,
}: OptimizedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const shouldUseAnimations = !isMobile && !reducedMotion

  const images = product.images || []
  const mainImage = images[0] || '/images/product-placeholder.jpg'
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(
      product,
      product.sizes?.[0] || 'M',
      0 // First color index
    )
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <LazyAnimationWrapper
      className={cn(
        "group relative bg-white rounded-2xl shadow-sm transition-all duration-300",
        "border border-gray-100 hover:border-gray-200 hover:shadow-lg",
        "overflow-hidden",
        className
      )}
      initial={shouldUseAnimations ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={shouldUseAnimations ? { opacity: 1, y: 0 } : { opacity: 1 }}
      whileHover={shouldUseAnimations ? { y: -4, scale: 1.01 } : undefined}
      transition={shouldUseAnimations ? { duration: 0.3, ease: "easeOut" } : undefined}
    >
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name?.en || product.name?.he || product.name?.ar || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDzY4Hf3vT2s61XTcraxjVA8eaw2aNEbeCNTXn3nxGtT4vTfLU5byIg/z/9k="
          />
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlist}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "backdrop-blur-sm transition-colors duration-200",
                isWishlisted 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
              )}
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-white/80 text-gray-600 backdrop-blur-sm
                         flex items-center justify-center hover:bg-black hover:text-white
                         transition-colors duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          {/* Badge */}
          {product.tags && product.tags.includes('new') && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                New
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {product.name?.en || product.name?.he || product.name?.ar || 'Product Name'}
          </h3>
          
          {/* Rating */}
          {product.parentReviews?.overallRating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.parentReviews.overallRating}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {formatCurrency(product.price, locale as 'en' | 'he' | 'ar')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice, locale as 'en' | 'he' | 'ar')}
                </span>
              )}
            </div>
            
            {/* Size indicator */}
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.sizes.length} sizes
              </span>
            )}
          </div>
        </div>
      </Link>
    </LazyAnimationWrapper>
  )
}
