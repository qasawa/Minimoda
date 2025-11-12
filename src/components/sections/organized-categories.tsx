'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Crown, Star, Shirt, Bot, Footprints, Palette } from 'lucide-react'
import { Web3Background } from '@/components/ui/web3-background'
import { SplitText } from '@/components/ui/morphing-text'
import { useIsMobile, useReducedMotion, useIsLowPerformanceDevice } from '@/lib/hooks/use-media-query'

import type { BaseProps } from '@/lib/types'

interface OrganizedCategoriesProps extends BaseProps {
  className?: string;
}

export function OrganizedCategories({ locale }: OrganizedCategoriesProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const isLowPerformance = useIsLowPerformanceDevice()
  
  // Reduce animations for better mobile performance
  const shouldReduceAnimations = isMobile || reducedMotion || isLowPerformance

  // Hierarchical clothing organization (top to bottom) - Maisonette Colors
  const clothingHierarchy = [
    {
      id: 'headwear',
      name: {
        en: 'Hats & Caps',
        he: 'כובעים וכפות',
        ar: 'قبعات وطواقي'
      },
      icon: Crown,
      color: 'from-amber-400 via-orange-500 to-amber-600',
      bgGlow: 'shadow-amber-500/30',
      count: 24,
      href: '/category/headwear',
      description: {
        en: 'Stylish headwear for every occasion',
        he: 'כובעים מעוצבים לכל אירוע',
        ar: 'قبعات أنيقة لكل مناسبة'
      }
    },
    {
      id: 'tops',
      name: {
        en: 'Tops & Shirts', 
        he: 'חולצות וטישרטים',
        ar: 'قمصان وتيشرتات'
      },
      icon: Shirt,
      color: 'from-emerald-400 via-teal-500 to-emerald-600',
      bgGlow: 'shadow-emerald-500/30',
      count: 156,
      href: '/category/tops',
      description: {
        en: 'Trendy tops for boys and girls',
        he: 'חולצות טרנדיות לבנים ובנות',
        ar: 'قمصان عصرية للأولاد والبنات'
      }
    },
    {
      id: 'dresses',
      name: {
        en: 'Dresses & Skirts',
        he: 'שמלות וחצאיות', 
        ar: 'فساتين وتنانير'
      },
      icon: Star,
      color: 'from-pink-400 via-rose-500 to-pink-600',
      bgGlow: 'shadow-pink-500/30',
      count: 89,
      href: '/category/dresses',
      description: {
        en: 'Beautiful dresses for special moments',
        he: 'שמלות יפות לרגעים מיוחדים',
        ar: 'فساتين جميلة للحظات الخاصة'
      }
    },
    {
      id: 'bottoms',
      name: {
        en: 'Pants & Shorts',
        he: 'מכנסיים ושורטים',
        ar: 'بناطيل وشورتات'
      },
      icon: Bot,
      color: 'from-indigo-400 via-blue-500 to-indigo-600',
      bgGlow: 'shadow-indigo-500/30',
      count: 203,
      href: '/category/bottoms',
      description: {
        en: 'Comfortable bottoms for active kids',
        he: 'מכנסיים נוחים לילדים פעילים',
        ar: 'بناطيل مريحة للأطفال النشطين'
      }
    },
    {
      id: 'shoes',
      name: {
        en: 'Shoes & Footwear',
        he: 'נעליים והנעלה',
        ar: 'أحذية وأحذية'
      },
      icon: Footprints,
      color: 'from-purple-400 via-violet-500 to-purple-600',
      bgGlow: 'shadow-purple-500/30',
      count: 67,
      href: '/category/shoes',
      description: {
        en: 'Stylish and comfortable footwear',
        he: 'נעליים מעוצבות ונוחות',
        ar: 'أحذية أنيقة ومريحة'
      }
    },
    {
      id: 'accessories',
      name: {
        en: 'Accessories',
        he: 'אקססוריז',
        ar: 'إكسسوارات'
      },
      icon: Palette,
      color: 'from-cyan-400 via-sky-500 to-cyan-600',
      bgGlow: 'shadow-cyan-500/30', 
      count: 134,
      href: '/category/accessories',
      description: {
        en: 'Perfect finishing touches',
        he: 'נגיעות אחרונות מושלמות',
        ar: 'اللمسات الأخيرة المثالية'
      }
    }
  ]

  // Animation Variants - Optimized for mobile performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceAnimations ? 0.05 : 0.1,
        delayChildren: shouldReduceAnimations ? 0.1 : 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceAnimations ? 20 : 50,
      scale: shouldReduceAnimations ? 0.95 : 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: shouldReduceAnimations ? {
        duration: 0.3,
        ease: "easeOut" as const
      } : {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden organized-categories-section">

      {/* Enhanced Web3 Background Effects - Conditionally rendered */}
      <Web3Background variant="subtle" className="absolute inset-0" />
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse delay-500" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Enhanced Typography - Fixed parallax */}
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SplitText 
            text={locale === 'he' ? 'קטגוריות מאورגנות' : locale === 'ar' ? 'فئات منظمة' : 'Beautiful Categories'}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4"
          />
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {locale === 'he' 
              ? 'גלו את הקולקציה המושלמת שלנו, מאורגנת בקפידה עבור הילדים שלכם'
              : locale === 'ar'
              ? 'اكتشف مجموعتنا المثالية، منظمة بعناية لأطفالكم'
              : 'Discover our perfectly curated collection, thoughtfully organized for your little ones'
            }
          </motion.p>
        </motion.div>

        {/* Enhanced Grid Layout - Mobile Optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
        >
          {clothingHierarchy.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={shouldReduceAnimations ? {} : { 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={shouldReduceAnimations ? {} : { scale: 0.95 }}
                className="group relative"
              >
                <Link href={category.href}>
                  <div className={`
                    relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50
                    shadow-xl ${category.bgGlow} hover:shadow-2xl
                    transition-all duration-500 ease-out
                    p-4 sm:p-6 md:p-8 h-full min-h-[250px] sm:min-h-[280px] md:min-h-[300px]
                    cursor-pointer
                  `}>
                    {/* Gradient Background Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-xl" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-2xl" />
                    
                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon Section */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <motion.div
                          whileHover={shouldReduceAnimations ? {} : { rotate: 360, scale: 1.1 }}
                          transition={shouldReduceAnimations ? {} : { duration: 0.6, ease: "easeInOut" }}
                          className={`
                            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.color} 
                            flex items-center justify-center shadow-lg
                            group-hover:shadow-xl transition-shadow duration-300
                          `}
                        >
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </motion.div>
                        
                        {/* Count Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                          className="px-2 py-1 sm:px-3 bg-white/80 rounded-full text-xs sm:text-sm font-semibold text-gray-700 shadow-md"
                        >
                          {category.count} {locale === 'he' ? 'פריטים' : locale === 'ar' ? 'عناصر' : 'items'}
                        </motion.div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-grow">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-gray-900 transition-colors">
                          {category.name[locale as keyof typeof category.name]}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 transition-colors">
                          {category.description[locale as keyof typeof category.description]}
                        </p>
                      </div>

                      {/* Action Arrow */}
                      <motion.div
                        className="flex items-center mt-4 sm:mt-6 text-gray-500 group-hover:text-gray-700"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-xs sm:text-sm font-medium mr-2">
                          {locale === 'he' ? 'עيين' : locale === 'ar' ? 'تصفح' : 'Browse'}
                        </span>
                        <motion.svg
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="transform group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4"
                        >
                          <path 
                            d="M5 12h14M12 5l7 7-7 7" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={false}
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="mr-2">
                {locale === 'he' ? 'צפה בכל הקטגוריות' : locale === 'ar' ? 'عرض جميع الفئات' : 'View All Categories'}
              </span>
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className="sm:w-5 sm:h-5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}