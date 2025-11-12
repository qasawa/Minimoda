'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Eye, ShoppingBag, Star, Zap, Shield, Leaf } from 'lucide-react'
import { useCart } from '@/lib/contexts/cart-context'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'
import { useIsMobile, useReducedMotion } from '@/lib/hooks/use-media-query'

interface RevolutionaryProductCardProps {
  product: Product
  locale: string
  className?: string
  priority?: boolean
  variant?: 'default' | 'compact' | 'featured'
  staggerIndex?: number
}

export function RevolutionaryProductCard({
  product,
  locale,
  className,
  priority = false,
  variant = 'default',
  staggerIndex = 0
}: RevolutionaryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const shouldUseAnimations = !isMobile && !reducedMotion
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()
  const { addToCart } = useCart()

  const images = product.images || []
  const hasMultipleImages = images.length > 1
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  // Smart Badge Logic
  const badges = []
  if (hasDiscount && discountPercentage >= 30) {
    badges.push({ text: `${discountPercentage}% OFF`, color: 'bg-red-500' })
  }
  if (product.isNew) {
    badges.push({ text: 'NEW', color: 'bg-blue-500' })
  }
  if (product.tags?.includes('organic')) {
    badges.push({ text: 'ORGANIC', color: 'bg-green-500' })
  }
  if (product.parentReviews?.overallRating && product.parentReviews.overallRating >= 4.5) {
    badges.push({ text: 'LOVED', color: 'bg-yellow-500' })
  }

  // Auto-cycle images on hover
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (hasMultipleImages) {
      let index = 0
      const cycleImages = () => {
        index = (index + 1) % images.length
        setCurrentImageIndex(index)
        hoverTimeoutRef.current = setTimeout(cycleImages, 800)
      }
      hoverTimeoutRef.current = setTimeout(cycleImages, 600)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
  }

  // Stagger animation delay
  const animationDelay = staggerIndex * 0.1

  return (
    <motion.article
      className={cn(
        "group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden",
        "border border-gray-100 hover:border-gray-200",
        variant === 'featured' && "lg:col-span-2 lg:row-span-2",
        className
      )}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Smart Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <AnimatePresence>
          {badges.slice(0, 2).map((badge, index) => (
            <motion.div
              key={badge.text}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1`}
            >
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="absolute top-3 right-3 z-20 flex flex-col gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handleWishlist}
          className={cn(
            "w-10 h-10 rounded-full shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center transition-colors duration-300",
            isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:text-red-500"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </motion.button>

        <motion.button
          onClick={handleQuickView}
          className="w-10 h-10 rounded-full bg-white/90 text-gray-600 hover:text-blue-500 shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Product Link */}
      <Link href={`/${locale}/product/${product.id}`} className="block">
        {/* Image Section with Carousel */}
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? "aspect-[4/3]" : "aspect-square"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex]}
                alt={product.name[locale as keyof typeof product.name] || product.name.en}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={variant === 'featured' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                priority={priority}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Navigation Dots */}
          {hasMultipleImages && isHovered && (
            <motion.div 
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {images.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentImageIndex 
                      ? "bg-white shadow-lg scale-125" 
                      : "bg-white/50"
                  )}
                />
              ))}
            </motion.div>
          )}

          {/* Gradient Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Quick Add to Cart */}
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.button
              onClick={handleAddToCart}
              className="w-full bg-black/80 backdrop-blur-sm text-white py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-300 hover:bg-black flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {locale === 'he' ? 'הוסף לעגלה' :
                 locale === 'ar' ? 'أضف للسلة' :
                 'Add to Cart'}
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-2">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className={cn(
            "font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight",
            variant === 'featured' ? "text-lg" : "text-sm"
          )}>
            {product.name[locale as keyof typeof product.name] || product.name.en}
          </h3>

          {/* Smart Pricing Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "font-bold text-gray-900",
                variant === 'featured' ? "text-xl" : "text-lg"
              )}>
                {formatCurrency(product.price, locale as 'he' | 'ar' | 'en')}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.originalPrice!, locale as 'he' | 'ar' | 'en')}
                  </span>
                  <motion.span 
                    className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    Save {formatCurrency(product.originalPrice! - product.price, locale as 'he' | 'ar' | 'en')}
                  </motion.span>
                </>
              )}
            </div>
          </div>

          {/* Smart Features */}
          <div className="flex items-center gap-4 mb-4">
            {/* Rating */}
            {product.parentReviews?.overallRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600 font-medium">
                  {product.parentReviews.overallRating}
                </span>
              </div>
            )}

            {/* Social Proof */}
            {product.parentReviews?.totalReviews && product.parentReviews.totalReviews > 10 && (
              <motion.div 
                className="flex items-center gap-1 text-xs text-gray-600"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <span className="text-pink-500">♥</span>
                <span>
                  {product.parentReviews.totalReviews} 
                  {locale === 'he' ? ' הורים אוהבים' :
                   locale === 'ar' ? ' والد يحب' :
                   ' parents love this'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Feature Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag, index) => {
                const getTagIcon = (tag: string) => {
                  if (tag.includes('organic')) return <Leaf className="w-3 h-3" />
                  if (tag.includes('quick-dry')) return <Zap className="w-3 h-3" />
                  if (tag.includes('stain-resistant')) return <Shield className="w-3 h-3" />
                  return null
                }

                const getTagColor = (tag: string) => {
                  if (tag.includes('organic')) return 'bg-green-50 text-green-700 border-green-200'
                  if (tag.includes('quick-dry')) return 'bg-blue-50 text-blue-700 border-blue-200'
                  if (tag.includes('stain-resistant')) return 'bg-purple-50 text-purple-700 border-purple-200'
                  return 'bg-gray-50 text-gray-700 border-gray-200'
                }

                return (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                      getTagColor(tag)
                    )}
                  >
                    {getTagIcon(tag)}
                    <span className="capitalize">{tag.replace('-', ' ')}</span>
                  </motion.span>
                )
              })}
            </div>
          )}
        </div>
      </Link>

      {/* Magnetic Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  )
}
