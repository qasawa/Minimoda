import { getDictionary } from '@/lib/utils/getDictionary'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { WishlistClient } from './wishlist-client'
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
      title: locale === 'he' ? 'רשימת משאלות - מינימודה' :
             locale === 'ar' ? 'قائمة الأمنيات - مينيمودا' :
             'Wishlist - Minimoda',
      description: locale === 'he' ? 'רשימת המוצרים שתרצו לרכוש בעתיד' :
                   locale === 'ar' ? 'قائمة المنتجات التي تود شراؤها في المستقبل' :
                   'Your saved products for future purchases',
      type: 'website'
    },
    locale
  )
}

export default async function WishlistPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      <WishlistClient locale={locale} />
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}