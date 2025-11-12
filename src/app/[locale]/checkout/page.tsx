import { getDictionary } from '@/lib/utils/getDictionary'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { CheckoutContent } from '@/components/sections/checkout-content'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { SEOService } from '@/lib/utils/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return SEOService.generateMetadata(
    {
      title: locale === 'he' ? 'תשלום | מינימודה' : 
             locale === 'ar' ? 'الدفع | مينيمودا' : 
             'Checkout | Minimoda',
      description: locale === 'he' ? 'השלם את הרכישה שלך בצורה מאובטחת במינימודה' :
                   locale === 'ar' ? 'أكمل عملية الشراء بأمان في مينيمودا' :
                   'Complete your secure purchase at Minimoda',
      noIndex: true, // Don't index checkout pages for SEO
      type: 'website'
    },
    locale
  )
}

export default async function CheckoutPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  
  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="min-h-screen bg-maisonette-cream">
        <CheckoutContent 
          locale={locale}
          dictionary={dictionary}
        />
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}
