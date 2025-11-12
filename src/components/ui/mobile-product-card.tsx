'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/contexts/cart-context'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'

interface MobileProductCardProps {
  product: Product
  locale: string
  className?: string
  priority?: boolean
}

export function MobileProductCard({
  product,
  locale,
  className,
  priority = false,
}: MobileProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()

  const images = product.images || []
  const mainImage = images[0] || '/images/product-placeholder.jpg'
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(
      product,
      product.sizes?.[0] || 'M',
      0
    )
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className={cn(
      "relative bg-white rounded-lg border border-gray-200 overflow-hidden",
      className
    )}>
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container - No animations */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name?.en || product.name?.he || product.name?.ar || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Sale badge - Simple, no animations */}
          {product.isSale && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                Sale
              </span>
            </div>
          )}

          {/* Quick actions - No hover animations */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              onClick={handleWishlist}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "bg-white shadow-sm border border-gray-200",
                isWishlisted ? "text-red-500" : "text-gray-600"
              )}
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-gray-900 text-white shadow-sm
                         flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info - No animations */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
            {product.name?.en || product.name?.he || product.name?.ar || 'Product Name'}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                {formatCurrency(product.price, locale as 'en' | 'he' | 'ar')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
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
    </div>
  )
}
