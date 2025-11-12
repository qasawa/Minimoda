'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCardMaisonette } from '@/components/ui/product-card-maisonette'
import type { Product, BaseProps } from '@/lib/types'
import { useState, useEffect } from 'react'

interface NewInSectionProps extends BaseProps {
  products: Product[]
}

export function NewInSection({ products, locale, dictionary }: NewInSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [currentSlide, setCurrentSlide] = useState(0)
  const itemsPerSlide = 5
  const totalSlides = Math.ceil(products.length / itemsPerSlide)
  
  // New In section magnetic cursor effects
  const [newInElements, setNewInElements] = useState<Set<HTMLElement>>(new Set())
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // New In Magnetic Effects 
  useEffect(() => {
    const applyNewInMagneticEffect = (element: HTMLElement, mouseX: number, mouseY: number) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = mouseX - centerX
      const deltaY = mouseY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      const magneticRange = 100
      
      if (distance < magneticRange) {
        const strength = Math.max(0, 1 - distance / magneticRange)
        const elasticity = 0.15
        
        const moveX = deltaX * strength * elasticity
        const moveY = deltaY * strength * elasticity
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.05})`
        element.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        element.style.filter = `brightness(${1 + strength * 0.1})`
        element.style.pointerEvents = 'auto' // Ensure clicks work
      } else {
        element.style.transform = 'translate(0px, 0px) scale(1)'
        element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease'
        element.style.filter = 'brightness(1)'
      }
    }

    const handleNewInMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      
      const newInSection = document.querySelector('.new-in-section')
      if (!newInSection?.contains(e.target as Node)) return
      
      newInElements.forEach(element => {
        if (element && element.isConnected) {
          applyNewInMagneticEffect(element, e.clientX, e.clientY)
        }
      })
    }

    const registerNewInElements = () => {
      const newInSelectors = ['a[href]', 'button', '.product-card']
      const newElements = new Set<HTMLElement>()
      
      const newInSection = document.querySelector('.new-in-section')
      if (!newInSection) return
      
      newInSelectors.forEach(selector => {
        const elements = newInSection.querySelectorAll(selector)
        elements.forEach(el => {
          const htmlEl = el as HTMLElement
          newElements.add(htmlEl)
          htmlEl.addEventListener('mouseenter', () => setIsHovering(true))
          htmlEl.addEventListener('mouseleave', () => setIsHovering(false))
        })
      })
      
      setNewInElements(newElements)
    }

    const timer = setTimeout(registerNewInElements, 100)
    window.addEventListener('mousemove', handleNewInMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleNewInMouseMove)
      newInElements.forEach(el => {
        if (el && el.isConnected) {
          el.style.transform = 'translate(0px, 0px) scale(1)'
          el.style.filter = 'brightness(1)'
        }
      })
    }
  }, [newInElements])

  return (
    <section className="py-16 bg-maisonette-main new-in-section">
      {/* Beautiful New In Magnetic Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[100]"
        style={{
          left: cursorPosition.x - 14,
          top: cursorPosition.y - 14,
        }}
        animate={{
          scale: isHovering ? 1.6 : 0,
          opacity: isHovering ? 0.85 : 0,
        }}
        transition={{ duration: 0.2, type: "spring", stiffness: 350 }}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-400/40 to-emerald-400/40 backdrop-blur-sm border border-green-300/60" />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-green-400/50"
          animate={{ rotate: -360, scale: [1, 1.15, 1] }}
          transition={{ rotate: { duration: 2.5, repeat: Infinity, ease: "linear" }, scale: { duration: 1.8, repeat: Infinity } }}
        />
      </motion.div>
      <div
        ref={ref}
        className="container mx-auto px-4 lg:px-6"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="font-serif text-3xl lg:text-4xl text-maisonette-blue-500 font-light mb-4"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'الجديد في المتجر' :
             locale === 'he' ? 'חדש בחנות' :
             'New In'}
          </h2>
          <p 
            className="text-text-secondary max-w-2xl mx-auto"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'أساليب جديدة للموسم القادم - اكتشف أحدث الوصولات من مجموعتنا المنتقاة' :
             locale === 'he' ? 'סטיילים חדשים לעונה הקרובה - גלו את ההגעות החדשות מהקולקציה המיוחדת שלנו' :
             'Fresh styles for the season ahead – discover the latest arrivals from our curated collection'}
          </p>
        </div>

        {/* Product Grid - Simple version for now */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {products.slice(0, 10).map((product) => (
            <ProductCardMaisonette
              key={product.id}
              product={product}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href={`/${locale}/new-arrivals`}
            className="inline-block text-maisonette-blue-600 font-medium tracking-wide
              hover:text-maisonette-blue-700 transition-colors duration-300
              border-b border-maisonette-blue-300 hover:border-maisonette-blue-500 pb-1"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'عرض جميع الوصولات الجديدة' :
             locale === 'he' ? 'צפה בכל ההגעות החדשות' :
             'View All New Arrivals'}
          </a>
        </div>
      </div>
    </section>
  )
}