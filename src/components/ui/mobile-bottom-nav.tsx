'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimationCapability } from '@/lib/utils/performance'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  User
} from 'lucide-react'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.786"/>
  </svg>
)
import { useCart } from '@/lib/contexts/cart-context'
import { Badge } from '@/components/ui/badge'
import type { Locale } from '@/lib/types'

interface MobileBottomNavProps {
  locale: Locale
  dictionary: any
}

export function MobileBottomNav({ locale, dictionary }: MobileBottomNavProps) {
  const pathname = usePathname()
  const canAnimate = useAnimationCapability()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState('home')
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname.includes('/search')) {
      setActiveTab('search')
    } else if (pathname.includes('/wishlist')) {
      setActiveTab('wishlist')
    } else if (pathname.includes('/cart')) {
      setActiveTab('cart')
    } else if (pathname.includes('/account')) {
      setActiveTab('account')
    } else {
      setActiveTab('home')
    }
  }, [pathname])

  const tabs = [
    {
      id: 'home',
      label: locale === 'he' ? 'בית' : locale === 'ar' ? 'الرئيسية' : 'Home',
      icon: Home,
      href: `/${locale}`,
      count: 0
    },
    {
      id: 'search',
      label: locale === 'he' ? 'חיפוש' : locale === 'ar' ? 'البحث' : 'Search',
      icon: Search,
      href: `/${locale}/search`,
      count: 0
    },
    {
      id: 'wishlist',
      label: locale === 'he' ? 'רשימת משאלות' : locale === 'ar' ? 'المفضلة' : 'Wishlist',
      icon: Heart,
      href: `/${locale}/wishlist`,
      count: 0
    },
    {
      id: 'cart',
      label: locale === 'he' ? 'עגלה' : locale === 'ar' ? 'السلة' : 'Cart',
      icon: ShoppingBag,
      href: `/${locale}/cart`,
      count: cartCount
    },
    {
      id: 'account',
      label: locale === 'he' ? 'חשבון' : locale === 'ar' ? 'الحساب' : 'Account',
      icon: User,
      href: `/${locale}/account`,
      count: 0
    }
  ]

  const handleTabPress = (tabId: string) => {
    if (tabId === activeTab) {
      // Double tap to scroll to top or refresh
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setActiveTab(tabId)
  }

  return (
    <>
      {/* WhatsApp Floating Button */}
      {canAnimate ? (
        <motion.a
          href="https://wa.me/972501234567"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center md:hidden transition-all duration-200"
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
          
          {/* Pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-[#25D366] rounded-full"
          />
        </motion.a>
      ) : (
        <a
          href="https://wa.me/972501234567"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center md:hidden"
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
        </a>
      )}

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ 
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white to-cream-50/95 backdrop-blur-xl border-t border-cream-200 shadow-2xl md:hidden mobile-bottom-nav"
      >
        {/* Progress bar for free shipping */}
        <div className="h-1 bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((cartCount * 50) / 200 * 100, 100)}%` }}
            className="h-full bg-navy-500"
          />
        </div>
        
        {/* Free shipping indicator */}
        {cartCount > 0 && cartCount * 50 < 200 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-4 py-1 bg-soft-blue-50 text-center"
          >
            <span className="text-xs text-navy-700 font-medium">
              ₪{200 - (cartCount * 50)} more for free shipping!
            </span>
          </motion.div>
        )}

        <div className="flex items-center justify-around py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => handleTabPress(tab.id)}
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 nav-link web3-element glow-element"
                data-magnetic="true"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  {/* Active background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute -inset-2 bg-soft-blue-100 rounded-xl"
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <div className="relative z-10 p-1">
                    <Icon 
                      className={`h-6 w-6 transition-colors duration-200 ${
                        isActive ? 'text-navy-600' : 'text-gray-500'
                      }`} 
                    />
                    
                    {/* Badge for cart/wishlist count */}
                    {tab.count > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 p-0 text-xs bg-navy-500 text-white border-2 border-white flex items-center justify-center">
                          {tab.count > 99 ? '99+' : tab.count}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={{
                    color: isActive ? '#e11d48' : '#6b7280',
                    fontWeight: isActive ? 600 : 400
                  }}
                  className="text-xs mt-1 transition-all duration-200"
                >
                  {tab.label}
                </motion.span>

                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -bottom-1 w-1 h-1 bg-navy-500 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </div>

        {/* iPhone home indicator */}
        <div className="h-1 flex justify-center pb-1">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </motion.nav>

      {/* Safe area spacer */}
      <div className="h-20 md:hidden" />
    </>
  )
}