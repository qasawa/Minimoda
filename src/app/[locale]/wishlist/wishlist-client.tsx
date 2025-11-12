'use client'

import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

interface WishlistClientProps {
  locale: Locale
}

export function WishlistClient({ locale }: WishlistClientProps) {
  const router = useRouter()

  const handleStartShopping = () => {
    router.push(`/${locale}/products`)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {locale === 'he' ? 'רשימת המשאלות שלי' :
             locale === 'ar' ? 'قائمة أمنياتي' :
             'My Wishlist'}
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            {locale === 'he' ? 'כאן תוכלו לשמור את המוצרים שמעניינים אתכם' :
             locale === 'ar' ? 'هنا يمكنكم حفظ المنتجات التي تهمكم' :
             'Save your favorite items to purchase later'}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'he' ? 'רשימת המשאלות ריקה' :
                 locale === 'ar' ? 'قائمة الأمنيات فارغة' :
                 'Your wishlist is empty'}
              </h3>
              <p className="text-gray-600 mb-6">
                {locale === 'he' ? 'התחילו לחפש ולשמור מוצרים שאתם אוהבים' :
                 locale === 'ar' ? 'ابدأوا بالبحث وحفظ المنتجات التي تحبونها' :
                 'Start browsing and save items you love'}
              </p>
              <button 
                onClick={handleStartShopping}
                className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {locale === 'he' ? 'התחל לקנות' :
                 locale === 'ar' ? 'ابدأ التسوق' :
                 'Start Shopping'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
