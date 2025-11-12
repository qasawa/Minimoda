import type { Metadata } from 'next'
import { Nunito, Rubik, Tajawal } from 'next/font/google'
import { languages } from '@/lib/i18n'
import dynamic from 'next/dynamic'
import { CartProvider } from '@/lib/contexts/cart-context'

// Dynamic imports for heavy components to reduce initial bundle size
const CartDrawer = dynamic(() => import('@/components/ui/cart-drawer').then(mod => ({ default: mod.CartDrawer })), {
  ssr: false,
  loading: () => null
})

const MobileBottomNav = dynamic(() => import('@/components/ui/mobile-bottom-nav').then(mod => ({ default: mod.MobileBottomNav })), {
  ssr: false,
  loading: () => null
})

const PerformanceOptimizedLayout = dynamic(() => import('@/components/performance-optimized-layout').then(mod => ({ default: mod.PerformanceOptimizedLayout })), {
  ssr: false,
  loading: () => null
})
import { getDictionary } from '@/lib/utils/getDictionary'
import { Locale } from '@/lib/types'
import '../globals.css'

// Note: Canela and Apercu fonts would typically be loaded via @font-face in CSS or local files
// For now, we'll use fallbacks while maintaining the CSS variable structure

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '600', '700'], // Reduced weight variants for better performance
  preload: true,
  fallback: ['system-ui', 'sans-serif']
})

const rubik = Rubik({ 
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
  display: 'swap',
  weight: ['400', '500', '700'], // Reduced weight variants
  preload: false, // Only preload primary font
  fallback: ['system-ui', 'sans-serif']
})

const tajawal = Tajawal({ 
  weight: ['400', '500', '700'], // Reduced weight variants for better performance
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  display: 'swap',
  preload: false, // Only preload primary font
  fallback: ['system-ui', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'Kiddora - Premium Children\'s Fashion',
  description: 'Playful, warm, and trustworthy children\'s clothing focused on comfort, quality, and joy',
}

export async function generateStaticParams() {
  return Object.keys(languages).map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const dir = languages[locale as keyof typeof languages]?.dir || 'ltr'
  const dictionary = await getDictionary(locale as Locale)
  
  return (
    <html 
      lang={locale} 
      dir={dir}
      className={`${nunito.variable} ${rubik.variable} ${tajawal.variable} ${dir === 'rtl' ? 'rtl' : 'ltr'}`}
    >
      <body suppressHydrationWarning className="page-transition">
        <CartProvider>
          <PerformanceOptimizedLayout />
          {children}
          <CartDrawer locale={locale as Locale} dictionary={dictionary} />
          <MobileBottomNav locale={locale as Locale} dictionary={dictionary} />
        </CartProvider>
      </body>
    </html>
  )
}
