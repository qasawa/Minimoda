'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/lib/utils/getDictionary'

interface MainCategoriesProps {
  locale: string
  dict: Awaited<ReturnType<typeof getDictionary>>
}

// SMART CATEGORIES - MEANINGFUL AND NON-OVERLAPPING
const categories = [
  {
    id: 'tiny-treasures',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/category/tiny-treasures',
    title: { en: 'Tiny Treasures', he: 'אוצרות קטנים', ar: 'كنوز صغيرة' },
    description: { en: 'Safe & gentle for babies 0-24mo', he: 'בטוח ועדין לתינוקות 0-24 חודשים', ar: 'آمن ولطيف للأطفال 0-24 شهر' }
  },
  {
    id: 'boys-zone',
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    href: '/category/boys-zone',
    title: { en: 'Boys Zone', he: 'אזור הבנים', ar: 'منطقة الأولاد' },
    description: { en: 'Tough clothes for active boys', he: 'בגדים חזקים לבנים פעילים', ar: 'ملابس قوية للأولاد النشطين' }
  },
  {
    id: 'girls-world',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/category/girls-world',
    title: { en: 'Girls World', he: 'עולם הבנות', ar: 'عالم البنات' },
    description: { en: 'Beautiful fashion for stylish girls', he: 'אופנה יפה לבנות סטייליש', ar: 'أزياء جميلة للبنات الأنيقات' }
  },
  {
    id: 'smart-deals',
    image: '/Pictures/full-shot-kids-posing-together.jpg',
    href: '/category/smart-deals',
    title: { en: 'Smart Deals', he: 'הצעות חכמות', ar: 'عروض ذكية' },
    description: { en: 'Real savings 30%+ off quality items', he: 'חיסכון אמיתי 30%+ הנחה על פריטי איכות', ar: 'توفير حقيقي خصم 30%+ على قطع عالية الجودة' }
  },
  {
    id: 'special-moments',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/category/special-moments',
    title: { en: 'Special Moments', he: 'רגעים מיוחדים', ar: 'لحظات خاصة' },
    description: { en: 'Formal wear for holidays & events', he: 'בגדי חג לחגים ואירועים', ar: 'ملابس رسمية للعطل والمناسبات' }
  },
  {
    id: 'kids',
    image: '/Pictures/full-shot-kids-posing-together.jpg',
    href: '/category/kids',
    title: { en: 'Kids', he: 'ילדים', ar: 'أطفال' },
    description: { en: 'Stylish fashion for active kids', he: 'אופנה מגניבה לילדים פעילים', ar: 'أزياء أنيقة للأطفال النشطين' }
  },
  {
    id: 'cozy-corner',
    image: '/Pictures/full-length-portrait-cute-little-girl-hat.jpg',
    href: '/category/cozy-corner',
    title: { en: 'Cozy Corner', he: 'פינת נוחות', ar: 'ركن الراحة' },
    description: { en: 'Comfort clothes for home & sleep', he: 'בגדי נוחות לבית ושינה', ar: 'ملابس راحة للبيت والنوم' }
  },
  {
    id: 'new-drops',
    image: '/Pictures/low-angle-little-boy-posing.jpg',
    href: '/category/new-drops',
    title: { en: 'New Drops', he: 'הכי חדש', ar: 'الأحدث' },
    description: { en: 'Latest arrivals & fresh trends', he: 'הגעות אחרונות וטרנדים טריים', ar: 'آخر الوصولات والترندات الجديدة' }
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
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

const hoverVariants = {
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
}

export default function MainCategories({ locale, dict }: MainCategoriesProps) {
  const isRTL = locale === 'ar' || locale === 'he'
  // Updated: 2025-08-13 13:27 - Fixed 8 categories display with better UI/UX

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-kiddora-cream relative overflow-hidden">
      {/* Kiddora Brand Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-kiddora-pink/30 to-kiddora-teal/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-kiddora-blue/30 to-kiddora-teal/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-kiddora-pink/20 to-kiddora-blue/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-kiddora-dark mb-4 font-heading">
            {locale === 'he' ? 'קטגוריות שיישמחו אתכם ⭐' : 
             locale === 'ar' ? 'فئات تجلب لكم الفرح ⭐' : 
             'Categories that spark joy ⭐'}
          </h2>
          <p className="text-lg text-kiddora-gray max-w-2xl mx-auto font-body">
            {locale === 'he' ? 'בגדים נוחים ואיכותיים שיעשו את הילדים שלכם מאושרים' :
             locale === 'ar' ? 'ملابس مريحة وعالية الجودة تجعل أطفالكم سعداء' :
             'Comfy, quality clothes that make your little ones happy 🌈'}
          </p>
        </motion.div>

        {/* Categories Grid - 8 items: balanced layout */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <Link 
                href={`/${locale}${category.href}`}
                className="block"
              >
                <motion.div
                  variants={hoverVariants}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden group-hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Category Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image}
                      alt={dict?.categories?.[category.id as keyof typeof dict.categories] || category.id}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {/* Category Badge */}
                    {category.id === 'smart-deals' && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {locale === 'he' ? 'מבצע' : locale === 'ar' ? 'تخفيض' : 'SALE'}
                      </div>
                    )}
                    
                    {category.id === 'new-drops' && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {locale === 'he' ? 'חדש' : locale === 'ar' ? 'جديد' : 'NEW'}
                      </div>
                    )}
                  </div>

                  {/* Category Content - Clean separation from image */}
                  <div className="p-6">
                    <div className="text-center">
                      <h3 className={`text-gray-900 font-bold text-lg lg:text-xl mb-2
                        ${isRTL ? 'font-arabic' : ''}`}
                        style={{ 
                          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                     locale === 'he' ? 'var(--font-rubik)' : 
                                     'inherit' 
                        }}
                      >
                        {category.title[locale as keyof typeof category.title] || category.title.en}
                      </h3>
                      
                      {/* Category Description */}
                      <p className={`text-gray-600 text-sm mb-4
                        ${isRTL ? 'font-arabic' : ''}`}
                        style={{ 
                          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                                     locale === 'he' ? 'var(--font-rubik)' : 
                                     'inherit' 
                        }}
                      >
                        {category.description[locale as keyof typeof category.description] || category.description.en}
                      </p>
                      
                      {/* SHOP NOW Button */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm uppercase tracking-wider rounded-full transition-all duration-300">
                          {locale === 'he' ? 'קנו עכשיו' : locale === 'ar' ? 'تسوق الآن' : 'SHOP NOW'}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Categories Section */}
        <motion.div 
          className="mt-16 grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Special Offers */}
          <Link href={`/${locale}/category/outlet`}>
            <motion.div 
              className="relative group bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl overflow-hidden h-48 lg:h-56"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative p-8 h-full flex flex-col justify-center text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                  {locale === 'he' ? '🔥 מבצעים חמים' :
                   locale === 'ar' ? '🔥 عروض ساخنة' :
                   '🔥 Hot Deals'}
                </h3>
                <p className="text-lg opacity-90 mb-4">
                  {locale === 'he' ? 'הנחות עד 50% על פריטים נבחרים' :
                   locale === 'ar' ? 'خصومات تصل إلى 50% على منتجات مختارة' :
                   'Up to 50% off on selected items'}
                </p>
                <div className="text-sm font-semibold">
                  {locale === 'he' ? 'לחצו לפרטים →' :
                   locale === 'ar' ? 'اضغط للتفاصيل ←' :
                   'Click for details →'}
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Smart Featured Category - New Drops */}
          <Link href={`/${locale}/category/new-drops`}>
            <motion.div 
              className="relative group bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl overflow-hidden h-48 lg:h-56"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative p-8 h-full flex flex-col justify-center text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                  {locale === 'he' ? '✨ הכי חדש' :
                   locale === 'ar' ? '✨ الأحدث' :
                   '✨ New Drops'}
                </h3>
                <p className="text-lg opacity-90 mb-4">
                  {locale === 'he' ? 'הגעות אחרונות וטרנדים טריים' :
                   locale === 'ar' ? 'آخر الوصولات والترندات الجديدة' :
                   'Latest arrivals & fresh trends'}
                </p>
                <div className="text-sm font-semibold">
                  {locale === 'he' ? 'גלו עכשיו →' :
                   locale === 'ar' ? 'اكتشف الآن ←' :
                   'Discover now →'}
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
