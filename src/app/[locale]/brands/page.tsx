import { getDictionary } from '@/lib/utils/getDictionary'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
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
      title: locale === 'he' ? 'מותגים - מינימודה' :
             locale === 'ar' ? 'العلامات التجارية - مينيمودا' :
             'Brands - Minimoda',
      description: locale === 'he' ? 'גלו את המותגים המובילים שלנו לילדים' :
                   locale === 'ar' ? 'اكتشف علاماتنا التجارية الرائدة للأطفال' :
                   'Discover our leading brands for children',
      type: 'website'
    },
    locale
  )
}

export default async function BrandsPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {locale === 'he' ? 'המותגים שלנו' :
               locale === 'ar' ? 'علاماتنا التجارية' :
               'Our Brands'}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {locale === 'he' ? 'אנחנו עובדים עם המותגים הטובים ביותר בעולם להביא לכם איכות מעולה' :
               locale === 'ar' ? 'نحن نعمل مع أفضل العلامات التجارية في العالم لنقدم لكم جودة ممتازة' :
               'We work with the world\'s best brands to bring you exceptional quality'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                'STELLA MCCARTNEY KIDS',
                'MY LITTLE SHOP UK',
                'PETIT BATEAU',
                'BONPOINT',
                'RALPH LAUREN KIDS',
                'BURBERRY CHILDREN',
                'MONCLER ENFANT',
                'BOSS KIDSWEAR'
              ].map((brand) => (
                <div key={brand} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="h-20 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{brand}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}