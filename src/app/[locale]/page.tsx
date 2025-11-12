import { SEOService } from '@/lib/utils/seo'
import HomeClient from './home-client'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return SEOService.generateMetadata(
    {
      title: locale === 'he' ? 'מינימודה - אופנת ילדים איכותית' : 
             locale === 'ar' ? 'مينيمودا - أزياء أطفال عالية الجودة' : 
             'Minimoda - Premium Kids Fashion',
      description: locale === 'he' ? 'גלו אופנת ילדים איכותית במינימודה. בגדים, צעצועים ואביזרים לילדים בכל הגילאים' :
                   locale === 'ar' ? 'اكتشف أزياء الأطفال المتميزة في مينيمودا. ملابس وألعاب واكسسوارات للأطفال من جميع الأعمار' :
                   'Discover premium kids fashion at Minimoda. Quality clothing, toys, and accessories for children of all ages',
      keywords: locale === 'he' ? ['בגדי ילדים', 'אופנת ילדים', 'צעצועים', 'מינימודה'] :
                locale === 'ar' ? ['ملابس أطفال', 'أزياء أطفال', 'ألعاب', 'مينيمودا'] :
                ['kids fashion', 'children clothing', 'toys', 'minimoda'],
      type: 'website'
    },
    locale
  )
}

export default function HomePage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  return <HomeClient locale={locale} />
}