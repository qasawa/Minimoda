'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import type { BaseProps } from '@/lib/types'

type FeaturedBrandsProps = BaseProps

interface Brand {
  id: string
  name: string
  logo: string
  description: string
  link: string
}

const featuredBrands: Brand[] = [
  {
    id: 'bonpoint',
    name: 'Bonpoint',
    logo: 'BONPOINT',
    description: 'French luxury for children',
    link: '/brands/bonpoint'
  },
  {
    id: 'moncler',
    name: 'Moncler',
    logo: 'MONCLER',
    description: 'Alpine luxury outerwear',
    link: '/brands/moncler'
  },
  {
    id: 'burberry',
    name: 'Burberry',
    logo: 'BURBERRY',
    description: 'British heritage fashion',
    link: '/brands/burberry'
  },
  {
    id: 'fendi',
    name: 'Fendi Kids',
    logo: 'FENDI',
    description: 'Italian luxury craftsmanship',
    link: '/brands/fendi'
  },
  {
    id: 'stella',
    name: 'Stella McCartney Kids',
    logo: 'STELLA\nMcCARTNEY',
    description: 'Sustainable luxury fashion',
    link: '/brands/stella-mccartney'
  }
]

// Brand descriptions in multiple languages
const getBrandDescription = (brandId: string, locale: string) => {
  const descriptions: Record<string, Record<string, string>> = {
    bonpoint: {
      en: 'French luxury for children',
      he: 'יוקרה צרפתית לילדים',
      ar: 'الفخامة الفرنسية للأطفال'
    },
    moncler: {
      en: 'Alpine luxury outerwear',
      he: 'מעילים יוקרתיים אלפיניים',
      ar: 'ملابس خارجية فاخرة جبلية'
    },
    burberry: {
      en: 'British heritage fashion',
      he: 'אופנה בריטית מסורתית',
      ar: 'أزياء التراث البريطاني'
    },
    fendi: {
      en: 'Italian luxury craftsmanship',
      he: 'אומנות יוקרה איטלקית',
      ar: 'الصناعة الإيطالية الفاخرة'
    },
    stella: {
      en: 'Sustainable luxury fashion',
      he: 'אופנת יוקרה בת קיימא',
      ar: 'أزياء فاخرة مستدامة'
    }
  }
  
  return descriptions[brandId]?.[locale] || descriptions[brandId]?.en || 'Premium Brand'
}

export function FeaturedBrands({ locale }: FeaturedBrandsProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  
  // Featured brands magnetic cursor effects
  const [brandElements, setBrandElements] = useState<Set<HTMLElement>>(new Set())
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  // Featured Brands Magnetic Effects 
  useEffect(() => {
    const applyBrandMagneticEffect = (element: HTMLElement, mouseX: number, mouseY: number) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = mouseX - centerX
      const deltaY = mouseY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      const magneticRange = 110
      
      if (distance < magneticRange) {
        const strength = Math.max(0, 1 - distance / magneticRange)
        const elasticity = 0.18
        
        const moveX = deltaX * strength * elasticity
        const moveY = deltaY * strength * elasticity
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.06})`
        element.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        element.style.filter = `brightness(${1 + strength * 0.12}) contrast(${1 + strength * 0.1})`
        element.style.pointerEvents = 'auto' // Ensure clicks work
      } else {
        element.style.transform = 'translate(0px, 0px) scale(1)'
        element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease'
        element.style.filter = 'brightness(1) contrast(1)'
      }
    }

    const handleBrandMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      
      const brandsSection = document.querySelector('.featured-brands-section')
      if (!brandsSection?.contains(e.target as Node)) return
      
      brandElements.forEach(element => {
        if (element && element.isConnected) {
          applyBrandMagneticEffect(element, e.clientX, e.clientY)
        }
      })
    }

    const registerBrandElements = () => {
      const brandSelectors = ['a[href]', 'button', '.brand-card']
      const newElements = new Set<HTMLElement>()
      
      const brandsSection = document.querySelector('.featured-brands-section')
      if (!brandsSection) return
      
      brandSelectors.forEach(selector => {
        const elements = brandsSection.querySelectorAll(selector)
        elements.forEach(el => {
          const htmlEl = el as HTMLElement
          newElements.add(htmlEl)
          htmlEl.addEventListener('mouseenter', () => setIsHovering(true))
          htmlEl.addEventListener('mouseleave', () => setIsHovering(false))
        })
      })
      
      setBrandElements(newElements)
    }

    const timer = setTimeout(registerBrandElements, 100)
    window.addEventListener('mousemove', handleBrandMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleBrandMouseMove)
      brandElements.forEach(el => {
        if (el && el.isConnected) {
          el.style.transform = 'translate(0px, 0px) scale(1)'
          el.style.filter = 'brightness(1) contrast(1)'
        }
      })
    }
  }, [brandElements])

  return (
    <section className="py-16 bg-maisonette-alt featured-brands-section">
      {/* Beautiful Brands Magnetic Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[100]"
        style={{
          left: cursorPosition.x - 15,
          top: cursorPosition.y - 15,
        }}
        animate={{
          scale: isHovering ? 1.7 : 0,
          opacity: isHovering ? 0.9 : 0,
        }}
        transition={{ duration: 0.2, type: "spring", stiffness: 320 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400/40 to-yellow-400/40 backdrop-blur-sm border border-amber-300/60" />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-amber-400/40"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
        />
      </motion.div>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container mx-auto px-4 lg:px-6"
      >
        {/* Section Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 
            className="font-serif text-3xl lg:text-4xl text-maisonette-blue-500 font-light mb-4"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'تسوق حسب الماركة' :
             locale === 'he' ? 'קנה לפי מותג' :
             'Shop by Brand'}
          </h2>
          <p 
            className="text-text-secondary max-w-2xl mx-auto"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'اكتشف المجموعات المتميزة من أشهر العلامات التجارية الفاخرة في العالم' :
             locale === 'he' ? 'גלו קולקציות פרימיום מהמותגים הפאר המבוקשים ביותר בעולם' :
             'Discover premium collections from the world&apos;s most coveted luxury brands'}
          </p>
        </motion.div>

        {/* Brand Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12"
        >
          {featuredBrands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              className="group text-center brand-card"
            >
              <Link href={`/${locale}${brand.link}`} className="block">
                {/* Brand Logo Container */}
                <div className="relative bg-white rounded-lg shadow-sm border border-neutral-200 
                  h-24 lg:h-28 flex items-center justify-center mb-4 
                  transition-all duration-300 group-hover:shadow-md group-hover:border-maisonette-blue-200
                  group-hover:-translate-y-1">
                  
                  {/* Logo Text */}
                  <div className="text-center">
                    <div className="font-serif font-light text-xs lg:text-sm text-maisonette-blue-800 
                      leading-tight tracking-wider whitespace-pre-line">
                      {brand.logo}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-maisonette-blue-500/5 rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Brand Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-sm text-maisonette-blue-800 
                    group-hover:text-maisonette-blue-600 transition-colors duration-200">
                    {brand.name}
                  </h3>
                  <p 
                    className="text-xs text-text-secondary"
                    style={{ 
                      fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                 locale === 'he' ? 'var(--font-rubik)' : 
                                 'inherit' 
                    }}
                  >
                    {getBrandDescription(brand.id, locale)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Brands Link */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Link
            href={`/${locale}/brands`}
            className="inline-block text-maisonette-blue-600 font-medium tracking-wide
              hover:text-maisonette-blue-700 transition-colors duration-300
              border-b border-maisonette-blue-300 hover:border-maisonette-blue-500 pb-1"
            style={{ 
              fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                         locale === 'he' ? 'var(--font-rubik)' : 
                         'inherit' 
            }}
          >
            {locale === 'ar' ? 'استكشف جميع الماركات' :
             locale === 'he' ? 'חקור את כל המותגים' :
             'Explore All Brands'}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
