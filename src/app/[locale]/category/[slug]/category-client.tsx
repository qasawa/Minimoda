'use client'

import { motion } from 'framer-motion'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductsPageContent } from '@/components/sections/products-page-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'

import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'

interface CategoryClientProps {
  locale: Locale
  slug: string
  categoryData: {
    title: { he: string; ar: string; en: string }
    description: { he: string; ar: string; en: string }
    image: string
  }
  products: Product[]
  dictionary: any
}

export default function CategoryClient({ 
  locale, 
  slug, 
  categoryData, 
  products, 
  dictionary 
}: CategoryClientProps) {
  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[300px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0">
            <img
              src={categoryData.image}
              alt={categoryData.title[locale]}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-lg animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-16 h-16 bg-blue-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {categoryData.title[locale]}
                </motion.h1>
                
                <motion.p 
                  className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  {categoryData.description[locale]}
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap items-center gap-6 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-semibold border border-white/30">
                    {products.length} {locale === 'he' ? 'מוצרים' : locale === 'ar' ? 'منتج' : 'Products'}
                  </span>
                  
                  {slug === 'outlet' && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse shadow-lg">
                      {locale === 'he' ? 'עד 70% הנחה' : locale === 'ar' ? 'خصم يصل إلى 70%' : 'Up to 70% Off'}
                    </span>
                  )}
                  
                  {slug === 'dress' && (
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                      {locale === 'he' ? 'קולקציה חדשה' : locale === 'ar' ? 'مجموعة جديدة' : 'New Collection'}
                    </span>
                  )}
                  
                  {slug === 'baby' && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                      {locale === 'he' ? 'חמוד במיוחד' : locale === 'ar' ? 'لطيف جداً' : 'Extra Adorable'}
                    </span>
                  )}
                  
                  {slug === 'kids' && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                      {locale === 'he' ? 'אופנה מגניבה' : locale === 'ar' ? 'موضة رائعة' : 'Cool Fashion'}
                    </span>
                  )}
                </motion.div>

                <motion.button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-3">
                    {locale === 'he' ? 'חקור את הקולקציה' : locale === 'ar' ? 'استكشف المجموعة' : 'Explore Collection'}
                  </span>
                  <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-8 h-12 border-2 border-white/70 rounded-full flex justify-center">
              <motion.div 
                className="w-2 h-4 bg-white/70 rounded-full mt-2"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Category Features */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'איכות פרימיום' : locale === 'ar' ? 'جودة ممتازة' : 'Premium Quality'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'חומרים מובחרים ובטוחים לילדים' : locale === 'ar' ? 'مواد مختارة وآمنة للأطفال' : 'Carefully selected materials safe for children'}
                </p>
              </div>
              
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'משלוח מהיר' : locale === 'ar' ? 'شحن سريع' : 'Lightning Fast'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'הגעה מהירה תוך 24-48 שעות' : locale === 'ar' ? 'وصول سريع خلال 24-48 ساعة' : 'Quick delivery within 24-48 hours'}
                </p>
              </div>
              
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'ביטחון מלא' : locale === 'ar' ? 'ضمان كامل' : 'Complete Confidence'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'החזרה קלה תוך 30 יום' : locale === 'ar' ? 'إرجاع سهل خلال 30 يوماً' : 'Easy 30-day return policy'}
                </p>
              </div>
              
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'מידות מושלמות' : locale === 'ar' ? 'مقاسات مثالية' : 'Perfect Fit'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'מדריך מידות מפורט ומדויק' : locale === 'ar' ? 'دليل مقاسات مفصل ودقيق' : 'Detailed and accurate size guide'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Products Section */}
        <div id="products-section" className="bg-gradient-to-br from-gray-50 to-white py-12">
          <div className="container mx-auto px-4">
            {products.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </motion.div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {locale === 'he' ? 'בקרוב נוספים...' : locale === 'ar' ? 'المزيد قريباً...' : 'More Coming Soon...'}
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {locale === 'he' ? 'אנחנו עובדים קשה להביא לכם את הפריטים הכי יפים בקטגוריה זו. בינתיים, תוכלו לחקור את המגוון המדהים שלנו בקטגוריות האחרות.' : 
                   locale === 'ar' ? 'نحن نعمل بجد لنقدم لكم أجمل القطع في هذه الفئة. في الوقت الحالي، يمكنكم استكشاف مجموعتنا المذهلة في الفئات الأخرى.' : 
                   'We\'re working hard to curate the most beautiful pieces for this category. Meanwhile, explore our amazing collection in other categories.'}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.button 
                    onClick={() => window.location.href = `/${locale}/products`}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {locale === 'he' ? 'צפה בכל המוצרים' : locale === 'ar' ? 'عرض جميع المنتجات' : 'Browse All Products'}
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => window.location.href = `/${locale}/sale`}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {locale === 'he' ? 'מבצעים חמים' : locale === 'ar' ? 'عروض ساخنة' : 'Hot Deals'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-16">
                  <motion.h2 
                    className="text-5xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    {locale === 'he' ? 'הקולקציה המובחרת שלנו' : locale === 'ar' ? 'مجموعتنا المختارة' : 'Our Curated Collection'}
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {locale === 'he' ? 'גלו את המבחר המדהים שלנו של פריטים איכותיים ומעוצבים במיוחד, שנבחרו בקפידה רבה עבור הילדים והמשפחה שלכם' : 
                     locale === 'ar' ? 'اكتشفوا مجموعتنا المذهلة من القطع عالية الجودة والمصممة خصيصاً، والمختارة بعناية فائقة لأطفالكم وعائلتكم' : 
                     'Discover our amazing selection of high-quality, beautifully designed pieces, carefully curated for your children and family'}
                  </motion.p>
                </div>
                
                <ProductsPageContent 
                  products={products}
                  locale={locale}
                  dictionary={dictionary}
                  categoryTitle={categoryData.title[locale]}
                />
              </motion.div>
            )}
          </div>
        </div>


      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}
