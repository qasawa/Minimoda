'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Share2, Ruler, Shield, Truck, ArrowLeft, Star, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/contexts/cart-context'
import { ProductCardMinimal } from '@/components/ui/product-card-minimal'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/currency'
import { productService } from '@/lib/supabase/products-service'
import type { Product } from '@/lib/types'
import type { BaseProps } from '@/lib/types'

interface ProductDetailPremiumProps extends BaseProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailPremium({ 
  product, 
  relatedProducts,
  locale, 
  dictionary 
}: ProductDetailPremiumProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Track product view on component mount
  useEffect(() => {
    const trackProductView = async () => {
      try {
        await productService.analyticsService.trackView(product.id, {
          product_name: product.name[locale] || product.name.en,
          category: product.category,
          price: product.price,
          currency: 'ILS',
          brand: product.brand || 'Minimoda'
        })
      } catch (error) {
        console.error('Error tracking product view:', error)
      }
    }

    trackProductView()
  }, [product.id, product.name, product.category, product.price, product.brand, locale])
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  
  const { addToCart } = useCart()
  
  const productName = product.name[locale as keyof typeof product.name] || product.name.en
  const productDescription = product.description[locale as keyof typeof product.description] || product.description.en
  const isRTL = locale === 'ar' || locale === 'he'

  const handleAddToCart = async () => {
    if (!selectedSize) return
    
    try {
      // Track add to cart event
      await productService.analyticsService.trackView(product.id, {
        product_name: product.name[locale] || product.name.en,
        category: product.category,
        price: product.price,
        currency: 'ILS',
        brand: product.brand || 'Minimoda',
        event_type: 'add_to_cart',
        quantity: quantity,
        selected_size: selectedSize,
        selected_color: product.colors[selectedColorIndex]?.name?.en || 'Default'
      })
    } catch (error) {
      console.error('Error tracking add to cart:', error)
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColorIndex)
    }
    
    // Success animation
    const button = document.querySelector('.add-to-cart-btn')
    button?.classList.add('animate-pulse')
    setTimeout(() => {
      button?.classList.remove('animate-pulse')
    }, 600)
  }

  const features = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Made with organic cotton and premium materials'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₪300'
    },
    {
      icon: Star,
      title: 'Easy Returns',
      description: '30-day return policy for your peace of mind'
    }
  ]

  const tabs = [
    { id: 'details', name: 'Details' },
    { id: 'care', name: 'Care' },
    { id: 'shipping', name: 'Shipping' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container-responsive mx-auto px-6 lg:px-8 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{productName}</span>
        </motion.nav>
      </div>

      <div className="container-responsive mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <ImageWithFallback
                    src={product.colors[selectedColorIndex]?.images?.[selectedImageIndex] || product.images[selectedImageIndex]}
                    fallbackSrc="/images/product-placeholder.svg"
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && (
                  <motion.span
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    className="inline-flex items-center gap-1 bg-coral-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    New
                  </motion.span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <motion.span
                    initial={{ scale: 0, rotate: 12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg"
                  >
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </motion.span>
                )}
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(
                    "p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200",
                    isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </button>
                <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl text-gray-600 hover:text-coral-500 transition-all duration-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200",
                    selectedImageIndex === index 
                      ? "border-coral-500 scale-105" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <ImageWithFallback
                    src={image}
                    fallbackSrc="/images/product-placeholder.svg"
                    alt={`${productName} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Product Info */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-medium text-coral-500 uppercase tracking-wider mb-2"
              >
                {product.category}
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                {productName}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-600 leading-relaxed mb-6"
              >
                {productDescription}
              </motion.p>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </motion.div>

            {/* Color Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Color: {product.colors[selectedColorIndex]?.name.en || 'Unknown'}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColorIndex(index)
                      setSelectedImageIndex(0)
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full border-4 transition-all duration-200 shadow-md hover:shadow-lg",
                      index === selectedColorIndex 
                        ? "border-coral-500 scale-110" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-coral-500 hover:text-coral-600 transition-colors"
                >
                  <Ruler className="h-4 w-4" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-4 px-4 rounded-xl border-2 font-medium transition-all duration-200",
                      selectedSize === size
                        ? "border-coral-500 bg-coral-50 text-coral-700 scale-105"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 add-to-cart-btn",
                  !selectedSize 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-coral-500 hover:bg-coral-600 text-white"
                )}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {selectedSize ? `Add to Bag - ${formatCurrency(product.price * quantity)}` : 'Select Size'}
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 gap-4 pt-8 border-t border-gray-100"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <feature.icon className="h-5 w-5 text-coral-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Product Details Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-8 border-t border-gray-100"
            >
              <div className="flex border-b border-gray-100 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-6 py-3 font-medium transition-colors relative",
                      activeTab === tab.id
                        ? "text-coral-500"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {tab.name}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-600 leading-relaxed"
                >
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <p>Premium organic cotton blend provides ultimate comfort and durability.</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>100% organic cotton</li>
                        <li>Machine washable</li>
                        <li>Pre-shrunk for perfect fit</li>
                        <li>Hypoallergenic and gentle on skin</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div className="space-y-4">
                      <p>Follow these care instructions to keep your item looking its best:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Machine wash cold with like colors</li>
                        <li>Use gentle detergent</li>
                        <li>Tumble dry low or hang to dry</li>
                        <li>Iron on low heat if needed</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <p>Fast and reliable shipping options:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Free standard shipping on orders over ₪300</li>
                        <li>Express shipping available</li>
                        <li>International shipping to select countries</li>
                        <li>30-day return policy</li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 pt-16 border-t border-gray-100"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCardMinimal
                  key={relatedProduct.id}
                  product={relatedProduct}
                  locale={locale}
                  dictionary={dictionary}

                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
