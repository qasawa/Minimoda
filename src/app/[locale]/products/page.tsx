import { SEOService } from '@/lib/utils/seo'
import ProductsClient from './products-client'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return SEOService.generateMetadata(
    {
      title: locale === 'he' ? 'כל המוצרים | מינימודה' : 
             locale === 'ar' ? 'جميع المنتجات | مينيمودا' : 
             'All Products | Minimoda',
      description: locale === 'he' ? 'עיינו בכל המוצרים שלנו - בגדי ילדים, צעצועים ואביזרים איכותיים' :
                   locale === 'ar' ? 'تصفح جميع منتجاتنا - ملابس أطفال وألعاب واكسسوارات عالية الجودة' :
                   'Browse all our products - quality kids clothing, toys, and accessories',
      keywords: locale === 'he' ? ['מוצרים', 'בגדי ילדים', 'צעצועים', 'קטלוג'] :
                locale === 'ar' ? ['منتجات', 'ملابس أطفال', 'ألعاب', 'كتالوج'] :
                ['products', 'kids clothing', 'toys', 'catalog'],
      type: 'website'
    },
    locale
  )
}

export default function ProductsPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return <ProductsClient locale={locale} />
}