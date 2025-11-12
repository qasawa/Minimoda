'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronRight, Shield, Truck, Package } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ProductCardMinimal } from '@/components/ui/product-card-minimal'
import { useCart } from '@/lib/contexts/cart-context'

import type { Locale } from '@/lib/types'

interface ProductDetailProps {
  product: any
  relatedProducts: any[]
  locale: Locale
  dictionary: any
}

export function ProductDetail({ product, relatedProducts, locale, dictionary }: ProductDetailProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  
  const isRTL = locale === 'ar' || locale === 'he'

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Show size selection error
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColorIndex)
    }

    // Trigger cart icon wiggle animation
    document.querySelector('.cart-icon')?.classList.add('wiggle')
    setTimeout(() => {
      document.querySelector('.cart-icon')?.classList.remove('wiggle')
    }, 500)
  }

  return (
    <div className="container-responsive mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <a href={`/${locale}`} className="hover:text-coral-500">
          {dictionary.common.home || 'Home'}
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href={`/${locale}/products`} className="hover:text-coral-500">
          {dictionary.navigation.collections}
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">
          {product.name[locale]}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
          >
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name[locale]}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.isNew && (
              <span className={cn(
                "badge-playful bg-mint-500 text-white absolute top-4",
                isRTL ? "right-4" : "left-4"
              )}>
                {dictionary.products.new}
              </span>
            )}
            {product.isSale && (
              <span className={cn(
                "badge-playful bg-coral-500 text-white absolute top-4",
                isRTL ? "left-4" : "right-4",
                product.isNew && (isRTL ? "left-24" : "right-24")
              )}>
                -{product.discount}%
              </span>
            )}
          </motion.div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-[3/4] overflow-hidden rounded-xl transition-all",
                  selectedImage === index
                    ? "ring-2 ring-coral-500"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name[locale]} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 150px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-fredoka font-bold text-gray-900 mb-2">
              {product.name[locale]}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {product.description[locale]}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating || 4.5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews || 127} {dictionary.products.reviews || 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.isSale && (
                <span className="text-2xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-4xl font-bold text-coral-500">
                ${product.price}
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-3">
              {dictionary.products.colors}: 
              <span className="font-normal text-gray-600 ms-2">
                {product.colors[selectedColorIndex].name[locale]}
              </span>
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color: any, idx: number) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all",
                    selectedColorIndex === idx
                      ? "border-gray-900 shadow-lg scale-110"
                      : "border-gray-300"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name[locale]}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-medium mb-3">
              {dictionary.products.size}
              {!selectedSize && (
                <span className="text-sm text-coral-500 ms-2">
                  {dictionary.products.selectSize}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "py-3 px-4 rounded-xl font-medium transition-all",
                    selectedSize === size
                      ? "bg-coral-500 text-white shadow-playful"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <button className="text-sm text-coral-500 hover:text-coral-600 mt-3">
              {dictionary.common.sizeGuide}
            </button>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-3">{dictionary.products.quantity || 'Quantity'}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 rounded-s-xl"
                >
                  -
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 rounded-e-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 btn-base bg-coral-500 hover:bg-coral-600 text-white"
              disabled={!selectedSize}
            >
              <ShoppingBag className="h-5 w-5 me-2" />
              {dictionary.common.addToCart}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLiked(!isLiked)}
              className="px-4"
            >
              <Heart className={cn(
                "h-5 w-5",
                isLiked ? "fill-coral-500 text-coral-500" : "text-gray-600"
              )} />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Shield className="h-8 w-8 text-mint-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Safe Materials</p>
              <p className="text-xs text-gray-600">100% Organic</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 text-mint-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Fast Shipping</p>
              <p className="text-xs text-gray-600">2-3 Days</p>
            </div>
            <div className="text-center">
              <Package className="h-8 w-8 text-mint-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">30 Days</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-6 border-t">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3">
                <span className="font-medium">{dictionary.products.details || 'Product Details'}</span>
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-2 pb-4 text-sm text-gray-600 space-y-2">
                <p>• 100% Organic Cotton</p>
                <p>• Machine washable</p>
                <p>• Pre-shrunk fabric</p>
                <p>• GOTS certified</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3">
                <span className="font-medium">{dictionary.products.shipping || 'Shipping & Returns'}</span>
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="pt-2 pb-4 text-sm text-gray-600 space-y-2">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• Express shipping available</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t">
          <h2 className="text-2xl sm:text-3xl font-fredoka font-bold text-gray-900 mb-8">
            {dictionary.products.youMayAlsoLike || 'You May Also Like'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCardMinimal
                key={relatedProduct.id}
                product={relatedProduct}
                locale={locale}
                dictionary={dictionary}

              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
