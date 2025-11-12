'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Facebook, Instagram, Youtube, Apple, Smartphone } from 'lucide-react'
import { useMouseInteractive } from '@/lib/hooks/use-mouse-interactive'
import type { BaseProps } from '@/lib/types'

type FooterMaisonetteProps = BaseProps

export function FooterMaisonette({ locale }: FooterMaisonetteProps) {
  const currentYear = new Date().getFullYear()
  
  // Mouse interactions for footer elements
  const linkMouse = useMouseInteractive({ strength: 0.15, scale: 1.02 })
  const socialMouse = useMouseInteractive({ strength: 0.3, scale: 1.1 })

  const footerLinks = {
    shop: [
      { name: { en: 'New Arrivals', he: 'חדשים', ar: 'وصل حديثا' }, href: '/new-arrivals' },
      { name: { he: 'בנות', ar: 'بنات', en: 'Girls' }, href: '/girls' },
      { name: { he: 'בנים', ar: 'أولاد', en: 'Boys' }, href: '/boys' },
      { name: { he: 'תינוקות', ar: 'أطفال', en: 'Baby' }, href: '/baby' },
      { name: { he: 'נעליים', ar: 'أحذية', en: 'Shoes' }, href: '/shoes' },
      { name: { he: 'אקססוריז', ar: 'إكسسوارات', en: 'Accessories' }, href: '/accessories' },
    ],
    customer: [
      { name: { he: 'חשבון', ar: 'حساب', en: 'Account' }, href: '/account' },
      { name: { he: 'הזמנות', ar: 'طلبات', en: 'Orders' }, href: '/orders' },
      { name: { he: 'מעקב משלוח', ar: 'تتبع الشحن', en: 'Track Order' }, href: '/track' },
      { name: { he: 'מדריך מידות', ar: 'دليل المقاسات', en: 'Size Guide' }, href: '/size-guide' },
      { name: { he: 'החזרות', ar: 'إرجاع', en: 'Returns' }, href: '/returns' },
      { name: { he: 'תמיכה', ar: 'دعم', en: 'Support' }, href: '/support' },
    ],
    company: [
      { name: { he: 'אודותינו', ar: 'معلومات عنا', en: 'About Us' }, href: '/about' },
      { name: { he: 'קריירה', ar: 'وظائف', en: 'Careers' }, href: '/careers' },
      { name: { he: 'עיתונות', ar: 'صحافة', en: 'Press' }, href: '/press' },
      { name: { he: 'חדשות', ar: 'أخبار', en: 'News' }, href: '/news' },
      { name: { he: 'שותפים', ar: 'شركاء', en: 'Trade Program' }, href: '/trade' },
      { name: { he: 'שיתוף פעולה', ar: 'تعاون', en: 'Collaborations' }, href: '/collaborations' },
    ]
  }

  return (
    <>
    <footer 
      className="text-white relative overflow-hidden footer-maisonette"
      style={{
        background: 'linear-gradient(180deg, #5B7C99 0%, #4A6FA5 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Signup */}
        <div className="border-b border-white/20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">
                {locale === 'he' ? 'הירשמו לניוזלטר' : locale === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe to our Newsletter'}
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                {locale === 'he' ? 'קבלו עדכונים על מוצרים חדשים, הנחות וטרנדים' : 
                 locale === 'ar' ? 'احصل على تحديثات حول المنتجات الجديدة والخصومات والاتجاهات' : 
                 'Get updates on new products, sales, and trends'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={locale === 'he' ? 'הכניסו את המייל' : locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  {locale === 'he' ? 'הירשמו' : locale === 'ar' ? 'اشتراك' : 'Subscribe'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div className="lg:col-span-1">
                <motion.div
                  {...linkMouse.handlers}
                  style={{
                    perspective: linkMouse.motionValues.perspective,
                    rotateX: linkMouse.motionValues.rotateX,
                    rotateY: linkMouse.motionValues.rotateY,
                  }}
                  whileHover={{ scale: linkMouse.motionValues.scale }}
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                  {/* Kiddora Logo in Footer */}
                  <img 
                    src="/Kiddora.jpeg"
                    alt="Kiddora Logo"
                    className="h-12 w-12 object-contain rounded-lg shadow-lg"
                  />
                  <h2 className="text-2xl font-bold mb-4">KIDDORA</h2>
                </motion.div>
                <p className="text-white/80 mb-6 text-sm leading-relaxed">
                  {locale === 'he' ? 'בגדים נוחים ואיכותיים שיעשו את הילדים שלכם מאושרים. חום, אמון ושמחה בכל פריט' :
                   locale === 'ar' ? 'ملابس مريحة وعالية الجودة تجعل أطفالكم سعداء. دفء وثقة وفرح في كل قطعة' :
                   'Comfy, quality clothes that make your little ones happy. Warmth, trust & joy in every piece'}
                </p>

                {/* Social Media */}
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {[
                    { icon: Facebook, href: '#', label: 'Facebook' },
                    { icon: Instagram, href: '#', label: 'Instagram' },
                    { icon: Youtube, href: '#', label: 'YouTube' }
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all duration-300 social-link nav-link web3-element glow-element"
                      {...socialMouse.handlers}
                      style={{
                        perspective: socialMouse.motionValues.perspective,
                        rotateX: socialMouse.motionValues.rotateX,
                        rotateY: socialMouse.motionValues.rotateY,
                      }}
                      whileHover={{ scale: socialMouse.motionValues.scale }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Shop Links */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  {locale === 'he' ? 'קטגוריות' : locale === 'ar' ? 'التسوق' : 'Shop'}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.shop.map((link) => (
                    <li key={link.href}>
                      <motion.div
                        {...linkMouse.handlers}
                        style={{
                          perspective: linkMouse.motionValues.perspective,
                          rotateX: linkMouse.motionValues.rotateX,
                          rotateY: linkMouse.motionValues.rotateY,
                        }}
                        whileHover={{ scale: linkMouse.motionValues.scale }}
                      >
                        <Link 
                          href={link.href}
                          className="text-white/80 hover:text-white transition-colors text-sm nav-link web3-element glow-element"
                        >
                          {link.name[locale as keyof typeof link.name]}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Care */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  {locale === 'he' ? 'שירות לקוחות' : locale === 'ar' ? 'خدمة العملاء' : 'Customer Care'}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.customer.map((link) => (
                    <li key={link.href}>
                      <motion.div
                        {...linkMouse.handlers}
                        style={{
                          perspective: linkMouse.motionValues.perspective,
                          rotateX: linkMouse.motionValues.rotateX,
                          rotateY: linkMouse.motionValues.rotateY,
                        }}
                        whileHover={{ scale: linkMouse.motionValues.scale }}
                      >
                        <Link 
                          href={link.href}
                          className="text-white/80 hover:text-white transition-colors text-sm nav-link web3-element glow-element"
                        >
                          {link.name[locale as keyof typeof link.name]}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  {locale === 'he' ? 'החברה' : locale === 'ar' ? 'الشركة' : 'Company'}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <motion.div
                        {...linkMouse.handlers}
                        style={{
                          perspective: linkMouse.motionValues.perspective,
                          rotateX: linkMouse.motionValues.rotateX,
                          rotateY: linkMouse.motionValues.rotateY,
                        }}
                        whileHover={{ scale: linkMouse.motionValues.scale }}
                      >
                        <Link 
                          href={link.href}
                          className="text-white/80 hover:text-white transition-colors text-sm nav-link web3-element glow-element"
                        >
                          {link.name[locale as keyof typeof link.name]}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="text-white/60 text-sm">
                © {currentYear} KIDDORA. {locale === 'he' ? 'כל הזכויות שמורות.' : locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
                {[
                  { name: { he: 'מדיניות פרטיות', ar: 'سياسة الخصوصية', en: 'Privacy Policy' }, href: '/privacy' },
                  { name: { he: 'תנאי שימוש', ar: 'شروط الاستخدام', en: 'Terms of Service' }, href: '/terms' },
                  { name: { he: 'נגישות', ar: 'إمكانية الوصول', en: 'Accessibility' }, href: '/accessibility' }
                ].map((link) => (
                  <motion.div
                    key={link.href}
                    {...linkMouse.handlers}
                    style={{
                      perspective: linkMouse.motionValues.perspective,
                      rotateX: linkMouse.motionValues.rotateX,
                      rotateY: linkMouse.motionValues.rotateY,
                    }}
                    whileHover={{ scale: linkMouse.motionValues.scale }}
                  >
                    <Link 
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors nav-link web3-element glow-element"
                    >
                      {link.name[locale as keyof typeof link.name]}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-white/60 text-sm mr-3 rtl:mr-0 rtl:ml-3">
                  {locale === 'he' ? 'אמצעי תשלום:' : locale === 'ar' ? 'طرق الدفع:' : 'Payment:'}
                </span>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center text-xs">V</div>
                  <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center text-xs">M</div>
                  <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center text-xs">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}