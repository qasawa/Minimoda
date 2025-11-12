'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { BaseProps } from '@/lib/types'

type FooterMinimalProps = BaseProps

export function FooterMinimal({ locale, dictionary }: FooterMinimalProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const footerSections = [
    {
      title: { he: 'חנות', ar: 'تسوق', en: 'Shop' },
      links: [
        { name: { he: 'בנות', ar: 'بنات', en: 'Girls' }, href: '/girls' },
        { name: { he: 'בנים', ar: 'أولاد', en: 'Boys' }, href: '/boys' },
        { name: { he: 'תינוקות', ar: 'أطفال', en: 'Baby' }, href: '/baby' },
        { name: { he: 'מבצעים', ar: 'تخفيضات', en: 'Sale' }, href: '/sale' }
      ]
    },
    {
      title: { he: 'עזרה', ar: 'مساعدة', en: 'Help' },
      links: [
        { name: { he: 'מדריך מידות', ar: 'دليل المقاسات', en: 'Size Guide' }, href: '/size-guide' },
        { name: { he: 'משלוחים', ar: 'الشحن', en: 'Shipping' }, href: '/shipping' },
        { name: { he: 'החזרות', ar: 'الإرجاع', en: 'Returns' }, href: '/returns' },
        { name: { he: 'צור קשר', ar: 'اتصل بنا', en: 'Contact' }, href: '/contact' }
      ]
    },
    {
      title: { he: 'חברה', ar: 'الشركة', en: 'Company' },
      links: [
        { name: { he: 'אודותינו', ar: 'من نحن', en: 'About Us' }, href: '/about' },
        { name: { he: 'קיימות', ar: 'الاستدامة', en: 'Sustainability' }, href: '/sustainability' },
        { name: { he: 'קריירה', ar: 'الوظائف', en: 'Careers' }, href: '/careers' },
        { name: { he: 'עיתונות', ar: 'الصحافة', en: 'Press' }, href: '/press' }
      ]
    },
    {
      title: { he: 'חשבון', ar: 'الحساب', en: 'Account' },
      links: [
        { name: { he: 'התחברות', ar: 'تسجيل الدخول', en: 'Sign In' }, href: '/login' },
        { name: { he: 'רשמה', ar: 'إنشاء حساب', en: 'Create Account' }, href: '/register' },
        { name: { he: 'רשימת משאלות', ar: 'قائمة الأمنيات', en: 'Wishlist' }, href: '/wishlist' },
        { name: { he: 'הזמנות', ar: 'الطلبات', en: 'Order History' }, href: '/orders' }
      ]
    }
  ]

  const paymentIcons = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PayPal', icon: '💳' },
    { name: 'Apple Pay', icon: '📱' }
  ]

  return (
    <footer ref={ref} className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title.en}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-nav text-charcoal-800 mb-4">
                  {section.title[locale as keyof typeof section.title]}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={`/${locale}${link.href}`}
                        className="text-sm font-body text-neutral-500 hover:text-charcoal-700 transition-colors duration-200"
                      >
                        {link.name[locale as keyof typeof link.name]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-8 border-t border-neutral-100"
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-heading text-lg font-light text-charcoal-800 mb-3">
              Stay Updated
            </h4>
            <p className="text-sm text-neutral-500 mb-4 font-body">
              Subscribe for new arrivals and exclusive offers
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm font-body bg-white border border-neutral-200 focus:outline-none focus:border-sage-500 transition-colors duration-200"
              />
              <button className="px-4 py-2 bg-charcoal-800 text-white font-nav text-xs hover:bg-charcoal-700 transition-colors duration-200">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-6 border-t border-neutral-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-xs text-neutral-400 font-body">
              © 2024 Kiddora. All rights reserved.
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400 font-body">We accept:</span>
              <div className="flex gap-2">
                {paymentIcons.map((payment) => (
                  <div
                    key={payment.name}
                    className="w-8 h-6 bg-neutral-100 rounded flex items-center justify-center text-xs"
                    title={payment.name}
                  >
                    {payment.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex gap-4 text-xs font-body">
              <Link href={`/${locale}/privacy`} className="text-neutral-400 hover:text-charcoal-600 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/terms`} className="text-neutral-400 hover:text-charcoal-600 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
