'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, User, Heart, Menu, X, Search } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useCart } from '@/lib/contexts/cart-context'
import EnhancedSearch from '@/components/ui/enhanced-search'
import { useMouseInteractive } from '@/lib/hooks/use-mouse-interactive'
import { KiddoraAnimatedLogo } from '@/components/ui/kiddora-animated-logo'

import type { BaseProps } from '@/lib/types'

type NavigationMaisonetteProps = BaseProps

export function NavigationMaisonette({ locale, dictionary }: NavigationMaisonetteProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const { items: cartItems } = useCart()
  const pathname = usePathname()

  // Interactive mouse effects for logo
  const logoMouse = useMouseInteractive({
    strength: 0.3,
    perspective: 1000,
    scale: 1.02
  })

  // Track scroll for navigation styles
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const categories = [
    {
      name: {
        en: 'New Drops',
        he: 'חדש',
        ar: 'جديد'
      },
      href: '/category/new-drops',
      id: 'new-drops'
    },
    {
      name: {
        en: 'Boys Zone',
        he: 'אזור בנים',
        ar: 'منطقة الأولاد'
      },
      href: '/category/boys-zone',
      id: 'boys-zone'
    },
    {
      name: {
        en: "Girls World",
        he: 'עולם בנות',
        ar: 'عالم البنات'
      },
      href: '/category/girls-world',
      id: 'girls-world'
    },
    {
      name: {
        en: 'Tiny Treasures',
        he: 'אוצרות קטנים',
        ar: 'كنوز صغيرة'
      },
      href: '/category/tiny-treasures',
      id: 'tiny-treasures'
    },
    {
      name: {
        en: 'Smart Deals',
        he: 'מבצעים',
        ar: 'العروض'
      },
      href: '/category/smart-deals',
      id: 'smart-deals'
    },
    {
      name: {
        en: 'Special Moments',
        he: 'אירועים',
        ar: 'المناسبات'
      },
      href: '/category/special-moments',
      id: 'special-moments'
    },
    {
      name: {
        en: 'Cozy Corner',
        he: 'פינת נוחות',
        ar: 'ركن الراحة'
      },
      href: '/category/cozy-corner',
      id: 'cozy-corner'
    },
    {
      name: {
        en: 'Brands',
        he: 'מותגים',
        ar: 'العلامات التجارية'
      },
      href: '/brands',
      id: 'brands'
    }
  ]

  // Helper function to check if current page matches category
  const isCurrentPage = (href: string) => {
    const fullPath = `/${locale}${href}`
    return pathname === fullPath
  }

  return (
    <>
      {/* Promotional Banner */}
      <motion.div 
        initial={{ height: 'auto' }}
        animate={{ height: isScrolled ? 0 : 'auto' }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-kiddora-pink via-kiddora-blue to-kiddora-teal text-white text-center py-2 px-4 overflow-hidden"
      >
        <p className="text-sm font-medium">
          {locale === 'he' ? '🌟 משלוח חינם מעל ₪200 • NEW10 לקבלת 10% הנחה' :
           locale === 'ar' ? '🌟 شحن مجاني فوق ₪200 • NEW10 للحصول على خصم 10%' :
           '🌟 Get 10% Off 1st Order of ₪300+ • NEW10 • Free Shipping ₪200+'}
        </p>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ease-out bg-maisonette-blue-500
          ${isScrolled ? 'shadow-lg py-2' : 'shadow-md py-3'}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          {/* Single Row Layout */}
          <div className={`flex items-center justify-between transition-all duration-300 
            ${isScrolled ? 'h-12' : 'h-14'}`}>
            
            {/* Left: Animated Kiddora Logo */}
            <Link href={`/${locale}`} className="flex items-center logo brand-name web3-element glow-element" data-magnetic="true">
              <KiddoraAnimatedLogo 
                width={isScrolled ? 140 : 180}
                height={isScrolled ? 70 : 90}
                playOnHover={true}
                className="cursor-pointer"
              />
            </Link>

            {/* Center: Navigation (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}${category.href}`}
                  className={`
                    relative py-2 px-3 text-sm font-medium transition-all duration-300 rounded-lg
                    ${isCurrentPage(category.href)
                      ? 'text-yellow-300 bg-white/10 shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {category.name[locale as keyof typeof category.name]}
                  
                  {/* Active indicator */}
                  {isCurrentPage(category.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Search */}
              <button className="hidden md:flex p-2 text-white hover:text-white/80 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Language Toggle */}
              <LanguageToggle currentLocale={locale} />

              {/* Account */}
              <Link href={`/${locale}/account`} className="p-2 text-white hover:text-white/80 transition-colors">
                <User className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link href={`/${locale}/wishlist`} className="p-2 text-white hover:text-white/80 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link href={`/${locale}/cart`} className="relative p-2 text-white hover:text-white/80 transition-colors">
                <ShoppingBag className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-white ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {!isScrolled && (
          <div className="lg:hidden px-4 pb-2">
            <EnhancedSearch 
              locale={locale}
              compact={true}
              showFilters={false}
            />
          </div>
        )}

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden bg-maisonette-blue-400"
        >
          <div className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}${category.href}`}
                className={`
                  block py-3 px-4 rounded-lg transition-colors mb-1
                  ${isCurrentPage(category.href)
                    ? 'text-yellow-300 bg-white/10'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name[locale as keyof typeof category.name]}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.nav>
    </>
  )
}
