'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductsPageContent } from '@/components/sections/products-page-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function NewArrivalsPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dict = await getDictionary(locale)
        setDictionary(dict)

        // Load products from admin/database - filter for new arrivals
        const allProducts = await productService.getAll(locale)
        console.log(`Loaded ${allProducts.length} total products`)
        
        // Filter for new arrivals (products marked as new or just in)
        const newProducts = allProducts.filter(product => 
          product.isNew || product.isJustIn
        )
        
        // Sort by featured new items first, then by name
        newProducts.sort((a, b) => {
          // Prioritize isJustIn over isNew
          if (a.isJustIn && !b.isJustIn) return -1
          if (!a.isJustIn && b.isJustIn) return 1
          
          // Then sort alphabetically
          return a.name.en.localeCompare(b.name.en)
        })
        
        console.log(`Filtered to ${newProducts.length} new arrival products`)
        setProducts(newProducts)
      } catch (error) {
        console.error('Error loading new arrival products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [locale])

  if (isLoading || !dictionary) {
    return (
      <div className="min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="bg-maisonette-cream">
        {/* Hero Section */}
        <div className="relative h-[400px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop&q=90"
              alt="New Arrivals"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-teal-500/20 rounded-full blur-lg animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="inline-flex items-center bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-emerald-500/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  {locale === 'he' ? 'חדש!' : locale === 'ar' ? 'جديد!' : 'New!'}
                </motion.div>

                <motion.h1 
                  className="text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {locale === 'he' ? 'הגעות חדשות' : locale === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
                </motion.h1>
                
                <motion.p 
                  className="text-2xl lg:text-3xl text-white/90 mb-10 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  {locale === 'he' ? 'הקולקציה החדשה ביותר שלנו כבר כאן' : 
                   locale === 'ar' ? 'مجموعتنا الأحدث وصلت الآن' : 
                   'Our freshest collection just landed'}
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap items-center gap-6 mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-semibold border border-white/30">
                    {products.length} {locale === 'he' ? 'פריטים חדשים' : locale === 'ar' ? 'قطعة جديدة' : 'New Items'}
                  </span>
                  
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg animate-pulse">
                    {locale === 'he' ? 'טרי מהתצוגה' : locale === 'ar' ? 'طازج من العرض' : 'Fresh from Runway'}
                  </span>
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
                    {locale === 'he' ? 'חקור את החדש' : locale === 'ar' ? 'استكشف الجديد' : 'Explore What\'s New'}
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

        {/* New Arrivals Features */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'הגיע עכשיו' : locale === 'ar' ? 'وصل الآن' : 'Just Arrived'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'הפריטים החדשים ביותר מהקולקציה שלנו' : locale === 'ar' ? 'أحدث القطع من مجموعتنا' : 'The newest pieces from our collection'}
                </p>
              </div>
              
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'טרנדים חמים' : locale === 'ar' ? 'ترندات ساخنة' : 'Hot Trends'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'העיצובים הכי עדכניים בשוק' : locale === 'ar' ? 'أحدث التصاميم في السوق' : 'The latest designs trending now'}
                </p>
              </div>
              
              <div className="text-center group">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'he' ? 'אהבה ממבט ראשון' : locale === 'ar' ? 'حب من النظرة الأولى' : 'Love at First Sight'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'he' ? 'פריטים שמיד יהפכו למועדפים' : locale === 'ar' ? 'قطع ستصبح المفضلة فوراً' : 'Pieces that will instantly become favorites'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Products Section */}
        <div id="products-section" className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            {products.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {locale === 'he' ? 'הוסף מוצרים חדשים...' : 
                   locale === 'ar' ? 'أضف منتجات جديدة...' : 
                   'Add New Products...'}
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {locale === 'he' ? 'סמן מוצרים כ"הגעות חדשות" באמצעות פאנל הניהול כדי להציג אותם כאן. מוצרים שנוספו ב-30 הימים האחרונים יופיעו באופן אוטומטי.' : 
                   locale === 'ar' ? 'قم بوسم المنتجات كـ"وصل حديثاً" من خلال لوحة الإدارة لعرضها هنا. المنتجات المضافة في آخر 30 يوماً ستظهر تلقائياً.' : 
                   'Mark products as "New Arrivals" through the admin panel to display them here. Products added in the last 30 days will appear automatically.'}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.button 
                    onClick={() => window.location.href = '/admin/products'}
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {locale === 'he' ? 'הוסף מוצרים חדשים' : locale === 'ar' ? 'أضف منتجات جديدة' : 'Add New Products'}
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => window.location.href = `/${locale}/products`}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {locale === 'he' ? 'צפה בכל המוצרים' : locale === 'ar' ? 'عرض جميع المنتجات' : 'Browse All Products'}
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
                    {locale === 'he' ? 'ההגעות החדשות שלנו' : locale === 'ar' ? 'وصولاتنا الجديدة' : 'Our Latest Arrivals'}
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {locale === 'he' ? 'היו הראשונים לגלות את הקולקציה החדשה והטרנדית ביותר שלנו' : 
                     locale === 'ar' ? 'كونوا الأوائل في اكتشاف مجموعتنا الجديدة والعصرية' : 
                     'Be the first to discover our newest and most trendy collection'}
                  </motion.p>
                </div>
                
                <ProductsPageContent 
                  products={products}
                  locale={locale}
                  dictionary={dictionary}
                  categoryTitle={locale === 'he' ? 'הגעות חדשות' : locale === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
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
