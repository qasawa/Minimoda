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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { scrollY } = useScroll()
  const pathname = usePathname()

  // Enhanced magnetic effects for navigation
  const logoMouse = useMouseInteractive({ strength: 0.3, scale: 1.05 })
  const navItemMouse = useMouseInteractive({ strength: 0.2, scale: 1.02 })
  


  const cartItemsCount = getTotalItems()

  // Scroll effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  // Navigation Magnetic Effects (Hero-level beauty!)
  useEffect(() => {
    const applyMagneticEffect = (element: HTMLElement, mouseX: number, mouseY: number) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = mouseX - centerX
      const deltaY = mouseY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // Navigation-specific magnetic range and strength
      const magneticRange = element.classList.contains('logo') ? 120 : 80
      
      if (distance < magneticRange) {
        const strength = Math.max(0, 1 - distance / magneticRange)
        const elasticity = element.classList.contains('logo') ? 0.25 : 0.15
        
        const moveX = deltaX * strength * elasticity
        const moveY = deltaY * strength * elasticity
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.05})`
        element.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        
        // Add glow effect for navigation elements
        element.style.filter = `brightness(${1 + strength * 0.2}) saturate(${1 + strength * 0.3})`
      } else {
        element.style.transform = 'translate(0px, 0px) scale(1)'
        element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease'
        element.style.filter = 'brightness(1) saturate(1)'
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Cursor position tracking removed - using global cursor now
      
      // Magnetic effects removed - using global cursor now
    }

    const handleMouseEnter = () => {
      // Mouse enter tracking removed - using global cursor now
    }

    const handleMouseLeave = () => {
      // Mouse leave tracking removed - using global cursor now
    }

    const registerNavElements = () => {
      const navSelectors = [
        '.nav-link', '.logo', '.brand-name', 
        'a[href]', 'button', '.web3-element'
      ]
      
      const newElements = new Set<HTMLElement>()
      
      navSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          const htmlEl = el as HTMLElement
          // Only register elements within navigation
          if (htmlEl.closest('nav') || htmlEl.closest('.navigation')) {
            newElements.add(htmlEl)
            htmlEl.addEventListener('mouseenter', handleMouseEnter)
            htmlEl.addEventListener('mouseleave', handleMouseLeave)
          }
        })
      })
      
      // Magnetic elements registration removed - using global cursor now
    }

    // Register elements after component mounts
    const timer = setTimeout(registerNavElements, 100)
    
    // Re-register on route changes
    registerNavElements()

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
      
      // Clean up magnetic elements
      // Cleanup removed - using global cursor now
    }
  }, [pathname])

  // PURPOSE-DRIVEN SMART CATEGORIES
  const categories = [
    { 
      name: { he: 'הכי חדש', ar: 'الأحدث', en: 'NEW DROPS' }, 
      href: '/category/new-drops',
      purpose: 'Latest arrivals across all categories',
      isHighlight: false
    },
    { 
      name: { he: 'אזור הבנים', ar: 'منطقة الأولاد', en: 'BOYS ZONE' }, 
      href: '/category/boys-zone',
      purpose: 'Activity-focused boys clothing',
      isHighlight: false
    },
    { 
      name: { he: 'עולם הבנות', ar: 'عالم البنات', en: 'GIRLS WORLD' }, 
      href: '/category/girls-world',
      purpose: 'Style-focused girls fashion',
      isHighlight: false
    },
    { 
      name: { he: 'אוצרות קטנים', ar: 'كنوز صغيرة', en: 'TINY TREASURES' }, 
      href: '/category/tiny-treasures',
      purpose: 'Everything for babies 0-24mo',
      isHighlight: false
    },
    { 
      name: { he: 'הצעות חכמות', ar: 'عروض ذكية', en: 'SMART DEALS' }, 
      href: '/category/smart-deals',
      purpose: 'Curated deals with real value',
      isHighlight: true
    },
    { 
      name: { he: 'רגעים מיוחדים', ar: 'لحظات خاصة', en: 'SPECIAL MOMENTS' }, 
      href: '/category/special-moments',
      purpose: 'Occasion wear for memorable events',
      isHighlight: false
    },
    { 
      name: { he: 'פינת נוחות', ar: 'ركن الراحة', en: 'COZY CORNER' }, 
      href: '/category/cozy-corner',
      purpose: 'Comfort-first clothing for home',
      isHighlight: false
    },
    { 
      name: { he: 'מותגים', ar: 'العلامات التجارية', en: 'BRANDS' }, 
      href: '/brands',
      purpose: 'Shop by favorite designers',
      isHighlight: false
    },
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
        className="overflow-hidden"
      >
        <div className="bg-maisonette-blue-600 text-white py-1.5 text-center text-xs font-normal">
          <div className="container mx-auto px-4 flex items-center justify-center space-x-3">
            <span className="hidden md:inline">Get 10% Off 1st Order of ₪300+</span>
            <span className="hidden md:inline">•</span>
            <span className="font-medium bg-white/20 px-1.5 py-0.5 rounded text-xs">NEW10</span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline">Free Shipping ₪300+</span>
          </div>
        </div>
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
            
            {/* Left: Logo - Interactive */}
            <Link href={`/${locale}`} className="flex items-center logo brand-name web3-element glow-element" data-magnetic="true">
              <KiddoraAnimatedLogo 
                width={isScrolled ? 140 : 180}
                height={isScrolled ? 70 : 90}
                playOnHover={true}
                className="cursor-pointer"
              />
            </Link>

            {/* Center: Navigation (Desktop) */}



            {/* Center: Navigation (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {categories.slice(0, 8).map((category) => {
                const isCurrent = isCurrentPage(category.href)
                
                if (isCurrent) {
                  // Current page - show as active but non-clickable with improved styling
                  return (
                    <motion.div
                      key={category.href}
                      className="relative cursor-default"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      {...navItemMouse.handlers}
                      style={{
                        perspective: navItemMouse.motionValues.perspective,
                        rotateX: navItemMouse.motionValues.rotateX,
                        rotateY: navItemMouse.motionValues.rotateY,
                      }}
                    >
                      <span className="relative text-xs font-bold tracking-wide text-yellow-300 drop-shadow-lg">
                        {category.name[locale as keyof typeof category.name]}
                        
                        {/* Active indicator - full width underline */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 w-full bg-yellow-300 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Glow effect for current page */}
                        <motion.div
                          className="absolute inset-0 bg-yellow-300/20 rounded-md -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </span>
                    </motion.div>
                  )
                }
                
                return (
                  <motion.div
                    key={category.href}
                    {...navItemMouse.handlers}
                    style={{
                      perspective: navItemMouse.motionValues.perspective,
                      rotateX: navItemMouse.motionValues.rotateX,
                      rotateY: navItemMouse.motionValues.rotateY,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/${locale}${category.href}`}
                      className={`relative text-xs font-medium tracking-wide transition-all duration-300 group nav-item nav-link web3-element glow-element
                        ${category.isHighlight 
                          ? 'text-yellow-300' 
                          : 'text-white hover:text-yellow-300'
                        }`}
                      data-magnetic="true"
                    >
                      {category.name[locale as keyof typeof category.name]}
                      
                      {/* Hover underline animation */}
                      <motion.div
                        className={`absolute bottom-0 left-0 h-0.5 origin-left transition-all duration-300
                          ${category.isHighlight 
                            ? 'w-full bg-yellow-300' 
                            : 'w-0 bg-white group-hover:w-full group-hover:bg-yellow-300'
                          }`}
                      />
                      
                      {/* Subtle glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Compact Search - Desktop */}
              <div className="hidden lg:block">
                <button 
                  className="p-2 text-white hover:text-white/80 transition-colors"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Account */}
              <button className="hidden lg:flex p-2 text-white hover:text-white/80 transition-colors">
                <User className="h-4 w-4" />
              </button>

              {/* Wishlist */}
              <button
                className="p-2 text-white hover:text-white/80 transition-colors hidden lg:flex"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative p-2 text-white hover:text-white/80 transition-colors nav-link web3-element glow-element"
                aria-label={`Cart (${cartItemsCount} items)`}
                data-magnetic="true"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Language Toggle */}
              <LanguageToggle currentLocale={locale} />

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-white ml-2 web3-element glow-element"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                data-magnetic="true"
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
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const isCurrent = isCurrentPage(category.href)
                
                if (isCurrent) {
                  // Current page - mobile active state with better styling
                  return (
                    <motion.div
                      key={category.href}
                      className="block py-3 px-2 cursor-default relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-bold text-yellow-300 flex items-center justify-between">
                        {category.name[locale as keyof typeof category.name]}
                        <span className="text-yellow-300 text-lg">★</span>
                      </span>
                      
                      {/* Active indicator background */}
                      <motion.div
                        className="absolute inset-0 bg-yellow-300/20 rounded-md -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )
                }
                
                return (
                  <Link
                    key={category.href}
                    href={`/${locale}${category.href}`}
                    className={`block py-2 text-sm font-medium transition-colors
                      ${category.isHighlight 
                        ? 'text-yellow-300' 
                        : 'text-white hover:text-yellow-300'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name[locale as keyof typeof category.name]}
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile Account Actions */}
            <div className="mt-4 pt-4 border-t border-white/20 flex gap-4">
              <button className="text-sm text-white hover:text-white/80">
                Sign In
              </button>
              <Link 
                href={`/${locale}/wishlist`}
                className="flex items-center text-sm text-white hover:text-white/80"
              >
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      
      {/* Desktop Search Modal */}
      {isSearchModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchModalOpen(false)
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {locale === 'he' ? 'חיפוש מוצרים' :
                   locale === 'ar' ? 'البحث في المنتجات' :
                   'Search Products'}
                </h2>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <EnhancedSearch 
                locale={locale}
                placeholder={
                  locale === 'he' ? 'חפש בכל המוצרים...' :
                  locale === 'ar' ? 'ابحث في جميع المنتجات...' :
                  'Search all products...'
                }
                onSearch={(query) => {
                  setIsSearchModalOpen(false)
                  // Navigation is handled by the EnhancedSearch component
                }}
                showFilters={true}
                compact={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
