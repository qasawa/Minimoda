import { SEOService } from '@/lib/utils/seo'
import SaleClient from './sale-client'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return SEOService.generateMetadata(
    {
      title: locale === 'he' ? 'מבצעים | מינימודה' : 
             locale === 'ar' ? 'التخفيضات | مينيمودا' : 
             'Sale | Minimoda',
      description: locale === 'he' ? 'מוצרי אופנה לילדים במחירים מוזלים - עד 70% הנחה במינימודה' :
                   locale === 'ar' ? 'منتجات أزياء الأطفال بأسعار مخفضة - خصم يصل إلى 70% في مينيمودا' :
                   'Kids fashion on sale - up to 70% off at Minimoda',
      keywords: locale === 'he' ? ['מבצעים', 'הנחות', 'בגדי ילדים זולים', 'מחירים מוזלים'] :
                locale === 'ar' ? ['تخفيضات', 'خصومات', 'ملابس أطفال رخيصة', 'أسعار مخفضة'] :
                ['sale', 'discounts', 'kids clothes on sale', 'reduced prices'],
      type: 'website'
    },
    locale
  )
}

export default function SalePage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return <SaleClient locale={locale} />
}