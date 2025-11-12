import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { NavigationMaisonette } from '@/components/sections/navigation-maisonette'
import { ProductDetailPremium } from '@/components/sections/product-detail-premium'
import { FooterMaisonette } from '@/components/sections/footer-maisonette'
import { SEOService } from '@/lib/utils/seo'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string }
}): Promise<Metadata> {
  try {
    const product = await productService.getById(id, locale)
    
    if (!product) {
      return {
        title: 'Product Not Found | Minimoda',
        description: 'The requested product could not be found.'
      }
    }

    return SEOService.generateProductMetadata(
      {
        name: product.name[locale] || product.name.en,
        description: product.description?.[locale] || product.description?.en || '',
        price: product.price,
        currency: 'ILS',
        images: product.images,
        category: product.category,
        brand: product.brand || 'Minimoda',
        sku: product.id,
        availability: (product.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock',
        condition: 'new'
      },
      locale
    )
  } catch (error) {
    console.error('Error generating product metadata:', error)
    return {
      title: 'Product | Minimoda',
      description: 'Premium kids fashion at Minimoda'
    }
  }
}

export default async function ProductPage({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string }
}) {
  const dictionary = await getDictionary(locale)
  
  // Get product from Supabase
  const product = await productService.getById(id, locale)
  
  if (!product) {
    notFound()
  }
  
  // Get all products for related products
  const allProducts = await productService.getAll(locale)
  
  // Get related products (same category or featured)
  const relatedProducts = allProducts
    .filter(p => p.id !== id && (p.category === product.category || p.featured))
    .slice(0, 4)
  
  return (
    <>
      <NavigationMaisonette locale={locale} dictionary={dictionary} />
      
      <main className="bg-maisonette-cream">
        <ProductDetailPremium 
          product={product}
          relatedProducts={relatedProducts}
          locale={locale}
          dictionary={dictionary}
        />
      </main>
      
      <FooterMaisonette locale={locale} dictionary={dictionary} />
    </>
  )
}
