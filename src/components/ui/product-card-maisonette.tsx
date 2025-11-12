'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Heart, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/contexts/cart-context'
import { formatCurrency } from '@/lib/utils/currency'
import { productService } from '@/lib/supabase/products-service'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { KidsProductFeatures } from '@/components/ui/kids-product-features'
import { SizeConfidenceTool } from '@/components/ui/size-confidence-tool'
import type { Product } from '@/lib/types'
import type { BaseProps } from '@/lib/types'

interface ProductCardMaisonetteProps extends BaseProps {
  product: Product
  priority?: boolean
}

export function ProductCardMaisonette({
  product,
  locale,
  priority = false,
}: ProductCardMaisonetteProps) {

  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { addToCart } = useCart()
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const cardRef = useRef<HTMLElement | null>(null)
  const imageRotationInterval = useRef<NodeJS.Timeout>()
  
  // Web3-inspired mouse tracking for magnetic effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 20, stiffness: 300 }
  const cardX = useSpring(mouseX, springConfig)
  const cardY = useSpring(mouseY, springConfig)
  const rotateX = useTransform(cardY, [-100, 100], [10, -10])
  const rotateY = useTransform(cardX, [-100, 100], [-10, 10])

  // Auto-cycle through images on hover
  useEffect(() => {
    if (isHovered && product.images.length > 1) {
      let imageIndex = 0
      imageRotationInterval.current = setInterval(() => {
        imageIndex = (imageIndex + 1) % Math.min(3, product.images.length) // Cycle through first 3 images
        setCurrentImageIndex(imageIndex)
      }, 1200) // Slower cycling for elegant feel
    } else {
      setCurrentImageIndex(0)
      if (imageRotationInterval.current) {
        clearInterval(imageRotationInterval.current)
      }
    }

    return () => {
      if (imageRotationInterval.current) {
        clearInterval(imageRotationInterval.current)
      }
    }
  }, [isHovered, product.images.length])

  const handleWishlistToggle = useCallback(() => {
    setIsWishlisted(!isWishlisted)
    // Add logic to update wishlist in backend/context
  }, [isWishlisted])

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

  // Enhanced mouse handling for Web3 effects
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseXPos = e.clientX - centerX
    const mouseYPos = e.clientY - centerY
    
    mouseX.set(mouseXPos * 0.1)
    mouseY.set(mouseYPos * 0.1)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Combine refs
  const setRefs = useCallback((element: HTMLElement | null) => {
    if (cardRef.current !== element) {
      cardRef.current = element
    }
    inViewRef(element)
  }, [inViewRef])

  // Mock status labels based on product properties
  const getStatusLabel = () => {
    if (product.isExclusive) return 'Exclusives'
    if (product.isMostWished) return 'Most Wished'
    if (product.isSellingFast) return 'Selling Fast Today'
    if (product.isJustIn) return 'Just In'
    return null
  }

  const statusLabel = getStatusLabel()
  const hasDiscount = product.isSale && product.originalPrice
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0

  return (
    <motion.article
      ref={setRefs}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(91,124,153,0.25)',
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 border border-transparent hover:border-purple-200/50 product-card"
      data-magnetic="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Web3 Holographic border effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Floating sparkle effects */}
      <motion.div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
      </motion.div>
      {/* Wishlist Button */}
      <motion.button
        onClick={handleWishlistToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${isWishlisted
            ? 'bg-coral-500 text-white'
            : 'bg-white/80 text-neutral-500 hover:bg-white hover:text-coral-500'
          } opacity-0 group-hover:opacity-100`}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Sale Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-coral-500 text-white px-2 py-1 text-xs font-medium rounded">
          -{discountPercent}%
        </div>
      )}

      {/* Image Container */}
      <Link href={`/${locale}/product/${product.id}`} className="block" onClick={handleProductClick}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
          {/* Web3 gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={product.images[currentImageIndex] || product.images[0]}
                fallbackSrc="/images/product-placeholder.svg"
                alt={product.name[locale] || product.name.en}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                priority={priority}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand Name */}
        {product.brand && (
          <p className="text-xs text-text-brand uppercase font-medium tracking-wider mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/${locale}/product/${product.id}`} className="block" onClick={handleProductClick}>
          <h3 className="font-sans text-sm text-text-primary mb-3 line-clamp-2 leading-tight">
            {product.name[locale] || product.name.en}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm font-medium text-text-primary">
{formatCurrency(product.price, locale as 'he' | 'ar' | 'en')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
{formatCurrency(product.originalPrice!, locale as 'he' | 'ar' | 'en')}
            </span>
          )}
        </div>

        {/* Kids Product Features */}
        <KidsProductFeatures 
          product={product} 
          locale={locale} 
          className="mb-3"
        />

        {/* Discount Code */}
        {hasDiscount && (
          <p className="text-xs text-coral-600 mb-3 font-medium">
            Additional 15% OFF with code FALLSTYLE15
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Size Confidence Tool */}
          <SizeConfidenceTool 
            product={product}
            locale={locale}
          />
          
          {/* Status Button */}
          {statusLabel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-3 text-xs font-medium tracking-wide
                bg-maisonette-blue-50 text-maisonette-blue-700 
                hover:bg-maisonette-blue-100 transition-colors duration-200
                border border-maisonette-blue-200 rounded-sm"
            >
              {statusLabel}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
