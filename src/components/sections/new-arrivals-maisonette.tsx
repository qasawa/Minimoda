'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCardMaisonette } from '@/components/ui/product-card-maisonette'
import { Product, BaseProps } from '@/lib/types'

interface NewArrivalsMaisonetteProps extends BaseProps {
  products: Product[]
}

export function NewArrivalsMaisonette({ products, locale, dictionary }: NewArrivalsMaisonetteProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isRTL = locale === 'ar' || locale === 'he'

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3))
  }

  if (!products.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 
              className="text-3xl lg:text-4xl font-fredoka font-bold text-gray-900 mb-2"
              style={{ 
                fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                           locale === 'he' ? 'var(--font-rubik)' : 
                           'inherit' 
              }}
            >
              {locale === 'ar' ? 'الوصولات الجديدة' :
               locale === 'he' ? 'הגעות חדשות' :
               'New Arrivals'}
            </h2>
            <p 
              className="text-gray-600 text-lg"
              style={{ 
                fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                           locale === 'he' ? 'var(--font-rubik)' : 
                           'inherit' 
              }}
            >
              {locale === 'ar' ? 'أساليب جديدة للصغار' :
               locale === 'he' ? 'סטיילים חדשים לקטנטנים' :
               'Fresh styles for little ones'}
            </p>
          </div>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={isRTL ? nextSlide : prevSlide}
              className="p-3 rounded-full border border-gray-200 hover:border-gray-300 transition-colors bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={isRTL ? prevSlide : nextSlide}
              className="p-3 rounded-full border border-gray-200 hover:border-gray-300 transition-colors bg-white hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: isRTL 
                ? `${currentIndex * (100 / 4)}%`
                : `-${currentIndex * (100 / 4)}%`
            }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-full sm:w-1/2 lg:w-1/4">
                <ProductCardMaisonette 
                  product={product} 
                  locale={locale} 
                  dictionary={dictionary}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator - Mobile */}
        <div className="flex justify-center mt-8 lg:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: Math.max(1, products.length - 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}