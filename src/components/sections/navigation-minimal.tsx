'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Search, ShoppingBag, User, Heart, Sparkles } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useCart } from '@/lib/contexts/cart-context'
import type { BaseProps } from '@/lib/types'

type NavigationMinimalProps = BaseProps

export function NavigationMinimal({ locale, dictionary }: NavigationMinimalProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { getTotalItems } = useCart()
  const { scrollY } = useScroll()
  
  const cartItemsCount = getTotalItems()

  // Minimal scroll effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  // Minimal navigation categories - clean text-based
  const categories = [
    { name: { he: 'חדש', ar: 'جديد', en: 'NEW ARRIVALS' }, href: '/category/new-drops' },
    { name: { he: 'בנות', ar: 'بنات', en: 'GIRLS' }, href: '/category/girls-world' },
    { name: { he: 'בנים', ar: 'أولاد', en: 'BOYS' }, href: '/category/boys-zone' },
    { name: { he: 'תינוקות', ar: 'أطفال', en: 'BABY' }, href: '/category/tiny-treasures' },
    { name: { he: 'מותגים', ar: 'العلامات التجارية', en: 'BRANDS' }, href: '/brands' },
    { name: { he: 'מבצע', ar: 'تخفيضات', en: 'SALE' }, href: '/category/smart-deals' }
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200' 
            : 'bg-white border-b border-neutral-100'
        }`}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo - Web3 Enhanced */}
            <Link href={`/${locale}`} className="flex items-center space-x-3 rtl:space-x-reverse group">
              {/* Kiddora Logo Image */}
              <motion.img 
                src="/Kiddora.jpeg"
                alt="Kiddora Logo"
                className="h-12 w-12 object-contain rounded-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className="text-2xl font-heading font-light text-charcoal-800 tracking-wide relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Logo shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-full group-hover:translate-x-full"
                  transition={{ duration: 0.8 }}
                />
                
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                  animate={{
                    y: [0, -4, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                </motion.div>
                
                KIDDORA
              </motion.span>
            </Link>

            {/* Desktop Categories - Web3 Enhanced */}
            <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              {categories.map((category, index) => (
                <motion.div
                  key={category.href}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <Link
                    href={`/${locale}${category.href}`}
                    className="font-nav text-charcoal-700 hover:text-charcoal-800 transition-colors duration-200 relative overflow-hidden"
                  >
                    {/* Magnetic underline effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Text shimmer on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full"
                      transition={{ duration: 0.6 }}
                    />
                    
                    <span className="relative z-10">
                      {category.name[locale as keyof typeof category.name]}
                    </span>
                  </Link>
                  
                  {/* Floating micro-interaction */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Search - icon only */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-charcoal-600" />
              </motion.button>

              {/* Account */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200 hidden lg:flex"
                aria-label="Account"
              >
                <User className="h-5 w-5 text-charcoal-600" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200 hidden lg:flex"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-charcoal-600" />
              </motion.button>

              {/* Language Toggle */}
              <LanguageToggle currentLocale={locale} />

              {/* Cart with minimal badge */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
                data-cart-icon
                aria-label={`Cart (${cartItemsCount})`}
              >
                <ShoppingBag className="h-5 w-5 text-charcoal-600" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal-800 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu - simplified */}
          <div className="lg:hidden border-t border-neutral-100 py-3">
            <div className="flex justify-center space-x-6 overflow-x-auto">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.href}
                  href={`/${locale}${category.href}`}
                  className="font-nav text-charcoal-600 hover:text-charcoal-800 whitespace-nowrap transition-colors duration-200"
                >
                  {category.name[locale as keyof typeof category.name]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
