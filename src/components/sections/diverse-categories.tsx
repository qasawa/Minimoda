'use client'


import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

interface DiverseCategoriesProps {
  locale: Locale
}

export function DiverseCategories({ locale }: DiverseCategoriesProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Category - Full Width Banner */}
        <div className="mb-12">
          <Link href={`/${locale}/category/new-drops`}>
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    {locale === 'he' ? 'הכי חדש' : locale === 'ar' ? 'الأحدث' : 'NEW DROPS'}
                  </h2>
                  <p className="text-xl md:text-2xl opacity-90">
                    {locale === 'he' ? 'הקולקציה החדשה כאן' : locale === 'ar' ? 'المجموعة الجديدة هنا' : 'Fresh Collection Just Landed'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Mixed Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          
          {/* Large Category Card */}
          <div className="md:col-span-2">
            <Link href={`/${locale}/category/girls-world`}>
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 to-rose-500 group cursor-pointer">
                <Image
                  src="/Pictures/ShopByCategory/GirlsSale.webp"
                  alt="Girls World"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {locale === 'he' ? 'עולם הבנות' : locale === 'ar' ? 'عالم البنات' : 'Girls World'}
                  </h3>
                  <p className="text-lg opacity-90">
                    {locale === 'he' ? 'אופנה יפה' : locale === 'ar' ? 'أزياء جميلة' : 'Beautiful Fashion'}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Small Cards */}
          <div className="space-y-6">
            <Link href={`/${locale}/category/boys-zone`}>
              <div className="h-36 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white group cursor-pointer hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold mb-2">
                  {locale === 'he' ? 'אזור הבנים' : locale === 'ar' ? 'منطقة الأولاد' : 'Boys Zone'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'he' ? 'חזק ופעיל' : locale === 'ar' ? 'قوي ونشيط' : 'Tough & Active'}
                </p>
              </div>
            </Link>

            <Link href={`/${locale}/category/tiny-treasures`}>
              <div className="h-36 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white group cursor-pointer hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold mb-2">
                  {locale === 'he' ? 'אוצרות קטנים' : locale === 'ar' ? 'كنوز صغيرة' : 'Tiny Treasures'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'he' ? 'בטוח ועדין' : locale === 'ar' ? 'آمن ولطيف' : 'Safe & Gentle'}
                </p>
              </div>
            </Link>
          </div>

          {/* Vertical Card */}
          <div>
            <Link href={`/${locale}/category/smart-deals`}>
              <div className="h-80 rounded-2xl bg-gradient-to-b from-orange-500 to-red-500 p-6 text-white group cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-bold">30%+ OFF</span>
                </div>
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-xl font-bold mb-2">
                    {locale === 'he' ? 'הצעות חכמות' : locale === 'ar' ? 'عروض ذكية' : 'Smart Deals'}
                  </h4>
                  <p className="text-sm opacity-90">
                    {locale === 'he' ? 'חיסכון אמיתי' : locale === 'ar' ? 'توفير حقيقي' : 'Real Savings'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Horizontal Strip Categories */}
        <div className="space-y-4">
          <Link href={`/${locale}/category/special-moments`}>
            <div className="h-24 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 flex items-center justify-between text-white group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div>
                <h4 className="text-lg font-bold">
                  {locale === 'he' ? 'רגעים מיוחדים' : locale === 'ar' ? 'لحظات خاصة' : 'Special Moments'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'he' ? 'בגדי חג ואירועים' : locale === 'ar' ? 'ملابس العطل والمناسبات' : 'Holiday & Event Wear'}
                </p>
              </div>
              <div className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</div>
            </div>
          </Link>

          <Link href={`/${locale}/category/cozy-corner`}>
            <div className="h-24 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 flex items-center justify-between text-white group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div>
                <h4 className="text-lg font-bold">
                  {locale === 'he' ? 'פינת נוחות' : locale === 'ar' ? 'ركن الراحة' : 'Cozy Corner'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'he' ? 'בגדי בית נוחים' : locale === 'ar' ? 'ملابس منزلية مريحة' : 'Comfy Home Clothes'}
                </p>
              </div>
              <div className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
