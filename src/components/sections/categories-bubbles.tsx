'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import React from 'react'
import type { BaseProps } from '@/lib/types'

type CategoriesBubblesProps = BaseProps

interface CategoryBubble {
  id: string
  name: {
    en: string
    he: string
    ar: string
  }
  image: string
  link: string
  subtitle?: {
    en: string
    he: string
    ar: string
  }
}

// SMART CATEGORY BUBBLES - ALIGNED WITH NAVIGATION
const categories: CategoryBubble[] = [
  {
    id: 'tiny-treasures',
    name: { en: 'Tiny Treasures', he: 'אוצרות קטנים', ar: 'كنوز صغيرة' },
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    link: '/category/tiny-treasures',
    subtitle: { en: 'Safe & Gentle 0-24mo', he: 'בטוח ועדין 0-24 חודשים', ar: 'آمن ولطيف 0-24 شهر' }
  },
  {
    id: 'girls-world',
    name: { en: 'Girls World', he: 'עולם הבנות', ar: 'عالم البنات' },
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    link: '/category/girls-world',
    subtitle: { en: 'Beautiful Fashion', he: 'אופנה יפה', ar: 'أزياء جميلة' }
  },
  {
    id: 'boys-zone',
    name: { en: 'Boys Zone', he: 'אזור הבנים', ar: 'منطقة الأولاد' },
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    link: '/category/boys-zone',
    subtitle: { en: 'Tough & Active', he: 'חזק ופעיל', ar: 'قوي ونشيط' }
  },
  {
    id: 'smart-deals',
    name: { en: 'Smart Deals', he: 'הצעות חכמות', ar: 'عروض ذكية' },
    image: '/Pictures/full-shot-kids-posing-together.jpg',
    link: '/category/smart-deals',
    subtitle: { en: 'Real Savings 30%+ Off', he: 'חיסכון אמיתי 30%+ הנחה', ar: 'توفير حقيقي خصم 30%+' }
  },
  {
    id: 'special-moments',
    name: { en: 'Special Moments', he: 'רגעים מיוחדים', ar: 'لحظات خاصة' },
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    link: '/category/special-moments',
    subtitle: { en: 'Holiday & Event Wear', he: 'בגדי חג ואירועים', ar: 'ملابس العطل والمناسبات' }
  },
  {
    id: 'cozy-corner',
    name: { en: 'Cozy Corner', he: 'פינת נוחות', ar: 'ركن الراحة' },
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    link: '/category/cozy-corner',
    subtitle: { en: 'Home & Sleep Comfort', he: 'נוחות בית ושינה', ar: 'راحة البيت والنوم' }
  },
  {
    id: 'new-drops',
    name: { en: 'New Drops', he: 'הכי חדש', ar: 'الأحدث' },
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    link: '/category/new-drops',
    subtitle: { en: 'Latest Arrivals', he: 'הגעות אחרונות', ar: 'آخر الوصولات' }
  },
  {
    id: 'pajamas',
    name: { en: 'Pajamas', he: 'פיג׳מות', ar: 'ملابس النوم' },
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    link: '/category/cozy-corner',
    subtitle: { en: 'Cozy Nights', he: 'לילות נוחים', ar: 'ليالي مريحة' }
  }
]

export function CategoriesBubbles({ locale }: CategoriesBubblesProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  


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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }



  return (
    <section className="py-16 bg-maisonette-alt categories-bubbles-section">

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container mx-auto px-4 lg:px-6"
      >
        {/* Categories Grid - Maisonette Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="group text-center bubble-card"
            >
              {/* Circular Image Container - Maisonette Blue Background */}
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  y: -3
                }}
                whileTap={{ scale: 0.98 }}
                className="relative mb-4 mx-auto"
                style={{ width: '180px', height: '180px' }}
              >
                {/* Blue Circular Background - Exact Maisonette Color */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: '#7EAED3' }} // Maisonette's signature blue
                />
                
                {/* Product Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden p-3">
                  <img
                    src={category.image}
                    alt={category.name[locale] || category.name.en}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-full"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
              </motion.div>

              {/* Category Info */}
              <div className="space-y-2">
                <h3 className="text-base lg:text-lg font-serif text-maisonette-blue-800 
                  group-hover:text-maisonette-blue-600 transition-colors duration-200">
                  {category.name[locale] || category.name.en}
                </h3>
                
                {category.subtitle && (
                  <p className="text-xs text-text-secondary mb-3">
                    {category.subtitle[locale] || category.subtitle.en}
                  </p>
                )}

                {/* SHOP NOW Button - Maisonette Style */}
                <Link
                  href={`/${locale}${category.link}`}
                  className="inline-block mt-3 px-4 py-1.5 text-xs font-medium tracking-wider
                    text-maisonette-blue-600 border border-maisonette-blue-300 
                    hover:bg-maisonette-blue-500 hover:text-white hover:border-maisonette-blue-500
                    transition-all duration-300 uppercase"
                >
                  SHOP NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}