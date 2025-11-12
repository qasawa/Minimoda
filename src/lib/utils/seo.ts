import { Metadata } from 'next'

export interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultImage: string
  twitterHandle?: string
  facebookAppId?: string
  locale: string
  locales: string[]
}

export interface ProductSEO {
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  category: string
  brand?: string
  sku: string
  availability: 'in_stock' | 'out_of_stock' | 'pre_order'
  condition: 'new' | 'used' | 'refurbished'
}

export interface PageSEO {
  title: string
  description: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  type?: 'website' | 'article' | 'product'
}

const DEFAULT_CONFIG: SEOConfig = {
  siteName: 'Minimoda',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://minimoda.com',
  defaultTitle: 'Minimoda - Premium Kids Fashion',
  defaultDescription: 'Discover premium kids fashion at Minimoda. Quality clothing, toys, and accessories for children of all ages.',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@minimoda',
  locale: 'he-IL',
  locales: ['he', 'ar', 'en']
}

export class SEOService {
  private static config: SEOConfig = DEFAULT_CONFIG

  // Update SEO configuration
  static updateConfig(config: Partial<SEOConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // Generate base metadata
  static generateMetadata(
    pageData: PageSEO,
    locale: string = 'he'
  ): Metadata {
    const { config } = this
    const title = pageData.title || config.defaultTitle
    const description = pageData.description || config.defaultDescription
    const image = pageData.image || config.defaultImage
    const url = pageData.canonical || config.siteUrl

    const metadata: Metadata = {
      title,
      description,
      keywords: pageData.keywords?.join(', '),
      robots: pageData.noIndex ? 'noindex,nofollow' : 'index,follow',
      alternates: {
        canonical: pageData.canonical || config.siteUrl,
        languages: config.locales.reduce((acc, loc) => {
          acc[loc] = `${config.siteUrl}/${loc}`
          return acc
        }, {} as Record<string, string>)
      },
      
      // Open Graph
      openGraph: {
        type: (pageData.type === 'product' ? 'website' : pageData.type) || 'website',
        siteName: config.siteName,
        title,
        description,
        url,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title
          }
        ],
        locale: this.getOpenGraphLocale(locale),
        alternateLocale: config.locales
          .filter(l => l !== locale)
          .map(l => this.getOpenGraphLocale(l))
      },

      // Twitter
      twitter: {
        card: 'summary_large_image',
        site: config.twitterHandle,
        creator: config.twitterHandle,
        title,
        description,
        images: [image]
      }
    }

    return metadata
  }

  // Generate product metadata with structured data
  static generateProductMetadata(
    product: ProductSEO,
    locale: string = 'he'
  ): Metadata {
    const { config } = this
    const title = `${product.name} | ${config.siteName}`
    const description = product.description
    const image = product.images[0] || config.defaultImage

    return {
      title,
      description,
      
      openGraph: {
        type: 'website',
        siteName: config.siteName,
        title,
        description,
        images: product.images.map(img => ({
          url: img,
          width: 800,
          height: 800,
          alt: product.name
        })),
        locale: this.getOpenGraphLocale(locale)
      },

      twitter: {
        card: 'summary_large_image',
        site: config.twitterHandle,
        title,
        description,
        images: [image]
      },

      // Product structured data will be added via JSON-LD
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': product.currency,
        'product:availability': product.availability,
        'product:condition': product.condition,
        'product:brand': product.brand || config.siteName,
        'product:category': product.category
      }
    }
  }

  // Generate JSON-LD structured data for products
  static generateProductStructuredData(product: ProductSEO): object {
    const { config } = this

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: product.brand || config.siteName
      },
      sku: product.sku,
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: this.getSchemaAvailability(product.availability),
        itemCondition: this.getSchemaCondition(product.condition),
        seller: {
          '@type': 'Organization',
          name: config.siteName
        }
      }
    }
  }

  // Generate breadcrumb structured data
  static generateBreadcrumbStructuredData(breadcrumbs: Array<{
    name: string
    url: string
  }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    }
  }

  // Generate organization structured data
  static generateOrganizationStructuredData(): object {
    const { config } = this

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl,
      logo: `${config.siteUrl}/logo.png`,
      sameAs: [
        'https://www.facebook.com/minimoda',
        'https://www.instagram.com/minimoda',
        'https://twitter.com/minimoda'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+972-XX-XXX-XXXX',
        contactType: 'customer service',
        areaServed: 'IL',
        availableLanguage: ['Hebrew', 'Arabic', 'English']
      }
    }
  }

  // Generate website structured data
  static generateWebsiteStructuredData(): object {
    const { config } = this

    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.siteName,
      url: config.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${config.siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  // Generate FAQ structured data
  static generateFAQStructuredData(faqs: Array<{
    question: string
    answer: string
  }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Generate local business structured data
  static generateLocalBusinessStructuredData(): object {
    const { config } = this

    return {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: config.siteName,
      image: `${config.siteUrl}/images/store.jpg`,
      '@id': config.siteUrl,
      url: config.siteUrl,
      telephone: '+972-XX-XXX-XXXX',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tel Aviv Street 123',
        addressLocality: 'Tel Aviv',
        postalCode: '12345',
        addressCountry: 'IL'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 32.0853,
        longitude: 34.7818
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '09:00',
          closes: '14:00'
        }
      ],
      sameAs: [
        'https://www.facebook.com/minimoda',
        'https://www.instagram.com/minimoda'
      ]
    }
  }

  // Generate sitemap URLs
  static generateSitemapUrls(
    pages: Array<{
      url: string
      lastModified?: string
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
      priority?: number
    }>,
    locale: string = 'he'
  ): Array<{
    url: string
    lastModified?: string
    changeFrequency?: string
    priority?: number
    alternates?: Record<string, string>
  }> {
    const { config } = this

    return pages.map(page => ({
      ...page,
      url: `${config.siteUrl}/${locale}${page.url}`,
      alternates: config.locales.reduce((acc, loc) => {
        acc[loc] = `${config.siteUrl}/${loc}${page.url}`
        return acc
      }, {} as Record<string, string>)
    }))
  }

  // Generate robots.txt content
  static generateRobotsTxt(): string {
    const { config } = this

    return `
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${config.siteUrl}/sitemap.xml
${config.locales.map(locale => `Sitemap: ${config.siteUrl}/${locale}/sitemap.xml`).join('\n')}

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/

# Allow important pages
Allow: /products/
Allow: /categories/
Allow: /search/
`.trim()
  }

  // Optimize images for SEO
  static optimizeImageSEO(
    src: string,
    alt: string,
    width?: number,
    height?: number
  ): {
    src: string
    alt: string
    width?: number
    height?: number
    loading: 'lazy' | 'eager'
    sizes: string
  } {
    return {
      src,
      alt: alt || 'Image',
      width,
      height,
      loading: 'lazy',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }
  }

  // Generate canonical URL
  static generateCanonicalUrl(path: string, locale: string): string {
    const { config } = this
    return `${config.siteUrl}/${locale}${path}`
  }

  // Get hreflang attributes
  static getHreflangAttributes(path: string): Array<{
    hrefLang: string
    href: string
  }> {
    const { config } = this

    return config.locales.map(locale => ({
      hrefLang: this.getHreflangCode(locale),
      href: `${config.siteUrl}/${locale}${path}`
    }))
  }

  // Helper methods
  private static getOpenGraphLocale(locale: string): string {
    const localeMap: Record<string, string> = {
      'he': 'he_IL',
      'ar': 'ar_SA',
      'en': 'en_US'
    }
    return localeMap[locale] || 'he_IL'
  }

  private static getHreflangCode(locale: string): string {
    const hreflangMap: Record<string, string> = {
      'he': 'he-IL',
      'ar': 'ar-SA',
      'en': 'en-US'
    }
    return hreflangMap[locale] || 'he-IL'
  }

  private static getSchemaAvailability(availability: string): string {
    const availabilityMap: Record<string, string> = {
      'in_stock': 'https://schema.org/InStock',
      'out_of_stock': 'https://schema.org/OutOfStock',
      'pre_order': 'https://schema.org/PreOrder'
    }
    return availabilityMap[availability] || 'https://schema.org/InStock'
  }

  private static getSchemaCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'new': 'https://schema.org/NewCondition',
      'used': 'https://schema.org/UsedCondition',
      'refurbished': 'https://schema.org/RefurbishedCondition'
    }
    return conditionMap[condition] || 'https://schema.org/NewCondition'
  }
}

// SEO utilities for specific page types
export const PageSEO = {
  home: (locale: string): PageSEO => ({
    title: locale === 'he' ? 'מינימודה - אופנת ילדים איכותית' :
           locale === 'ar' ? 'مينيمودا - أزياء أطفال عالية الجودة' :
           'Minimoda - Premium Kids Fashion',
    description: locale === 'he' ? 'גלו את קולקציית הילדים הייחודית שלנו - בגדים איכותיים, צעצועים ואקססוריז לילדים בכל הגילאים' :
                 locale === 'ar' ? 'اكتشف مجموعة الأطفال الفريدة لدينا - ملابس عالية الجودة وألعاب وإكسسوارات للأطفال من جميع الأعمار' :
                 'Discover our unique kids collection - quality clothing, toys, and accessories for children of all ages',
    type: 'website'
  }),

  products: (locale: string): PageSEO => ({
    title: locale === 'he' ? 'מוצרים - מינימודה' :
           locale === 'ar' ? 'المنتجات - مينيمودا' :
           'Products - Minimoda',
    description: locale === 'he' ? 'עיינו במגוון הרחב של מוצרי הילדים שלנו - בגדים, צעצועים ואקססוריז איכותיים' :
                 locale === 'ar' ? 'تصفح مجموعتنا الواسعة من منتجات الأطفال - ملابس وألعاب وإكسسوارات عالية الجودة' :
                 'Browse our wide range of kids products - quality clothing, toys, and accessories',
    type: 'website'
  }),

  category: (categoryName: string, locale: string): PageSEO => ({
    title: `${categoryName} - ${locale === 'he' ? 'מינימודה' : locale === 'ar' ? 'مينيمودا' : 'Minimoda'}`,
    description: locale === 'he' ? `מוצרי ${categoryName} איכותיים לילדים במינימודה` :
                 locale === 'ar' ? `منتجات ${categoryName} عالية الجودة للأطفال في مينيمودا` :
                 `Quality ${categoryName} products for kids at Minimoda`,
    type: 'website'
  })
}
