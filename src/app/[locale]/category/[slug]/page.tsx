import { Metadata } from 'next'
import { getDictionary } from '@/lib/utils/getDictionary'
import { productService } from '@/lib/supabase/products-service'
import { SEOService } from '@/lib/utils/seo'
import { CategorySystem } from '@/lib/utils/category-system'
import type { Locale } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import CategoryClient from './category-client'

// Define the valid smart category slugs
const validCategories = [
  'new-drops', 'boys-zone', 'girls-world', 'tiny-treasures', 
  'smart-deals', 'special-moments', 'cozy-corner',
  // Legacy categories for backward compatibility
  'baby', 'girls', 'boys', 'kids', 'womens', 'home', 'toys', 'gear', 'dress', 'outlet'
]

// Smart category metadata
const smartCategoryMeta = {
  'new-drops': {
    title: { he: 'הכי חדש', ar: 'الأحدث', en: 'New Drops' },
    description: { 
      he: 'הפריטים החדשים ביותר שהגיעו אלינו השבוע',
      ar: 'أحدث القطع التي وصلت إلينا هذا الأسبوع',
      en: 'The freshest pieces that just landed this week'
    },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['חדש', 'הגעה חדשה', 'טרנדים', 'אופנה'],
      ar: ['جديد', 'وصل حديثاً', 'ترندات', 'موضة'],
      en: ['new', 'latest', 'fresh', 'trending', 'arrivals']
    }
  },
  'boys-zone': {
    title: { he: 'אזור הבנים', ar: 'منطقة الأولاد', en: 'Boys Zone' },
    description: { 
      he: 'בגדים חזקים ונוחים לבנים פעילים שאוהבים להתגעש',
      ar: 'ملابس قوية ومريحة للأولاد النشطين الذين يحبون اللعب',
      en: 'Tough and comfy clothes for active boys who love to play hard'
    },
    image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['בנים', 'פעיל', 'חזק', 'ספורט', 'משחק'],
      ar: ['أولاد', 'نشيط', 'قوي', 'رياضة', 'لعب'],
      en: ['boys', 'active', 'durable', 'sports', 'play', 'adventure']
    }
  },
  'girls-world': {
    title: { he: 'עולם הבנות', ar: 'عالم البنات', en: 'Girls World' },
    description: { 
      he: 'אופנה יפה ומיוחדת לבנות שאוהבות להיראות מדהים',
      ar: 'أزياء جميلة ومميزة للبنات اللواتي يحببن أن يبدين رائعات',
      en: 'Beautiful and unique fashion for girls who love to look amazing'
    },
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['בנות', 'אופנה', 'יפה', 'סטייל', 'עיצוב'],
      ar: ['بنات', 'موضة', 'جميل', 'ستايل', 'تصميم'],
      en: ['girls', 'fashion', 'style', 'beautiful', 'trendy', 'chic']
    }
  },
  'tiny-treasures': {
    title: { he: 'אוצרות קטנים', ar: 'كنوز صغيرة', en: 'Tiny Treasures' },
    description: { 
      he: 'כל מה שתינוקות צריכים - בטוח, נוח ומתוק במיוחד',
      ar: 'كل ما يحتاجه الأطفال الرضع - آمن ومريح ولطيف جداً',
      en: 'Everything babies need - safe, comfy, and extra adorable'
    },
    image: '/Pictures/MainCategories/sm_baby_52e21abc0f.webp',
    keywords: {
      he: ['תינוקות', 'בטוח', 'נוח', 'חמוד', 'איכות'],
      ar: ['أطفال رضع', 'آمن', 'مريح', 'لطيف', 'جودة'],
      en: ['baby', 'infant', 'safe', 'organic', 'gentle', 'newborn']
    }
  },
  'smart-deals': {
    title: { he: 'הצעות חכמות', ar: 'عروض ذكية', en: 'Smart Deals' },
    description: { 
      he: 'הנחות אמיתיות על מוצרים איכותיים - לא סתם מבצעים',
      ar: 'خصومات حقيقية على منتجات عالية الجودة - ليس مجرد عروض',
      en: 'Real savings on quality products - not just any sale'
    },
    image: '/Pictures/MainCategories/lg_Outlet_Icon_Site_662ae14f66.webp',
    keywords: {
      he: ['הנחות', 'מבצעים', 'חיסכון', 'איכות', 'חכם'],
      ar: ['خصومات', 'عروض', 'توفير', 'جودة', 'ذكي'],
      en: ['deals', 'savings', 'discounts', 'value', 'quality', 'smart']
    }
  },
  'special-moments': {
    title: { he: 'רגעים מיוחדים', ar: 'لحظات خاصة', en: 'Special Moments' },
    description: { 
      he: 'בגדים מיוחדים לחגים, אירועים וזכרונות בלתי נשכחים',
      ar: 'ملابس خاصة للعطل والمناسبات والذكريات التي لا تُنسى',
      en: 'Special outfits for holidays, events, and unforgettable memories'
    },
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['חגים', 'אירועים', 'מיוחד', 'זכרונות', 'חגיגה'],
      ar: ['عطل', 'مناسبات', 'خاص', 'ذكريات', 'احتفال'],
      en: ['holidays', 'special', 'events', 'formal', 'celebration', 'memories']
    }
  },
  'cozy-corner': {
    title: { he: 'פינת נוחות', ar: 'ركن الراحة', en: 'Cozy Corner' },
    description: { 
      he: 'בגדי בית נוחים לזמן איכות בבית ושינה מתוקה',
      ar: 'ملابس منزلية مريحة لقضاء وقت ممتع في البيت ونوم هادئ',
      en: 'Comfy home clothes for quality time at home and sweet dreams'
    },
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['פיג\'מות', 'בית', 'נוח', 'שינה', 'רך'],
      ar: ['بيجامات', 'منزل', 'مريح', 'نوم', 'ناعم'],
      en: ['pajamas', 'home', 'cozy', 'comfort', 'sleep', 'soft']
    }
  }
}

// Legacy category metadata (for backward compatibility)
const categoryMeta = {
  baby: {
    title: { he: 'תינוקות', ar: 'طفل رضيع', en: 'Baby' },
    description: { 
      he: 'בגדים ואקססוריז איכותיים לתינוקות',
      ar: 'ملابس وإكسسوارات عالية الجودة للأطفال الرضع',
      en: 'Premium clothing and accessories designed for your little ones'
    },
    image: '/Pictures/MainCategories/sm_baby_52e21abc0f.webp',
    keywords: {
      he: ['תינוקות', 'בגדי תינוקות', 'אקססוריז תינוקות', 'בגדים לתינוק'],
      ar: ['طفل رضيع', 'ملابس أطفال رضع', 'إكسسوارات أطفال', 'ملابس طفل'],
      en: ['baby', 'baby clothes', 'baby accessories', 'infant clothing', 'newborn']
    }
  },
  girls: {
    title: { he: 'בנות', ar: 'بنات', en: 'Girls' },
    description: { 
      he: 'אופנה יפה ומיוחדת לבנות חכמות',
      ar: 'أزياء جميلة ومميزة للبنات الذكيات',
      en: 'Beautiful and unique fashion for smart girls'
    },
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['בנות', 'בגדי בנות', 'אופנת בנות', 'בגדים לבנות'],
      ar: ['بنات', 'ملابس بنات', 'أزياء بنات', 'ملابس للبنات'],
      en: ['girls', 'girls clothing', 'girls fashion', 'kids fashion', 'children wear']
    }
  },
  boys: {
    title: { he: 'בנים', ar: 'أولاد', en: 'Boys' },
    description: { 
      he: 'אופנה מגניבה ונוחה לבנים פעילים',
      ar: 'أزياء رائعة ومريحة للأولاد النشطين',
      en: 'Cool and comfortable fashion for active boys'
    },
    image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1600&auto=format&fit=crop&q=90',
    keywords: {
      he: ['בנים', 'בגדי בנים', 'אופנת בנים', 'בגדים לבנים'],
      ar: ['أولاد', 'ملابس أولاد', 'أزياء أولاد', 'ملابس للأولاد'],
      en: ['boys', 'boys clothing', 'boys fashion', 'kids fashion', 'children wear']
    }
  },
  kids: {
    title: { he: 'ילדים', ar: 'أطفال', en: 'Kids' },
    description: { 
      he: 'אופנה מגניבה לילדים בכל הגילאים',
      ar: 'أزياء رائعة للأطفال من جميع الأعمار',
      en: 'Stylish and comfortable fashion for active kids'
    },
    image: '/Pictures/MainCategories/sm_kids_9ecce542be.webp',
    keywords: {
      he: ['ילדים', 'בגדי ילדים', 'אופנת ילדים', 'בגדים לילדים'],
      ar: ['أطفال', 'ملابس أطفال', 'أزياء أطفال', 'ملابس للأطفال'],
      en: ['kids', 'children clothing', 'kids fashion', 'children wear']
    }
  },
  womens: {
    title: { he: 'נשים', ar: 'نساء', en: "Women's" },
    description: { 
      he: 'אופנה נשית מעוצבת ונוחה',
      ar: 'أزياء نسائية أنيقة ومريحة',
      en: 'Elegant and comfortable women\'s fashion collection'
    },
    image: '/Pictures/MainCategories/sm_womens_557b0eccc2.webp',
    keywords: {
      he: ['נשים', 'אופנת נשים', 'בגדי נשים', 'לבוש נשי'],
      ar: ['نساء', 'أزياء نسائية', 'ملابس نساء', 'لباس نسائي'],
      en: ['women', 'womens fashion', 'ladies clothing', 'women wear']
    }
  },
  home: {
    title: { he: 'בית', ar: 'منزل', en: 'Home' },
    description: { 
      he: 'פריטי בית ועיצוב לילדים',
      ar: 'عناصر المنزل والديكور للأطفال',
      en: 'Beautiful home decor and essentials for kids'
    },
    image: '/Pictures/MainCategories/sm_home_2b2eb659e0.webp',
    keywords: {
      he: ['בית', 'עיצוב בית', 'פריטי בית', 'דקורציה'],
      ar: ['منزل', 'ديكور منزل', 'عناصر منزل', 'تصميم منزل'],
      en: ['home', 'home decor', 'interior', 'home accessories']
    }
  },
  toys: {
    title: { he: 'צעצועים', ar: 'ألعاب', en: 'Toys & Play' },
    description: { 
      he: 'צעצועים חינוכיים ומשחקים מהנים',
      ar: 'ألعاب تعليمية وترفيهية ممتعة',
      en: 'Educational toys and fun games for endless entertainment'
    },
    image: '/Pictures/MainCategories/sm_toys_a5bfda61b4.webp',
    keywords: {
      he: ['צעצועים', 'משחקים', 'צעצועים חינוכיים', 'צעצועי ילדים'],
      ar: ['ألعاب', 'العاب أطفال', 'ألعاب تعليمية', 'العاب ترفيهية'],
      en: ['toys', 'games', 'educational toys', 'kids toys', 'play']
    }
  },
  gear: {
    title: { he: 'ציוד', ar: 'معدات', en: 'Gear' },
    description: { 
      he: 'ציוד ואקססוריז לילדים',
      ar: 'معدات وإكسسوارات للأطفال',
      en: 'Essential gear and accessories for active lifestyles'
    },
    image: '/Pictures/MainCategories/sm_gear_fb442ef2b2.webp',
    keywords: {
      he: ['ציוד', 'ציוד ילדים', 'אקססוריז', 'ציוד ספורט'],
      ar: ['معدات', 'معدات أطفال', 'إكسسوارات', 'معدات رياضة'],
      en: ['gear', 'accessories', 'sports gear', 'equipment']
    }
  },
  dress: {
    title: { he: 'שמלות', ar: 'فساتين', en: 'Dresses' },
    description: { 
      he: 'שמלות מקסימות לכל אירוע',
      ar: 'فساتين جميلة لكل المناسبات',
      en: 'Beautiful dresses for every special occasion'
    },
    image: '/Pictures/MainCategories/md_Dress_c707a2e26b.webp',
    keywords: {
      he: ['שמלות', 'שמלות ילדות', 'שמלות לאירועים', 'שמלות חגיגיות'],
      ar: ['فساتين', 'فساتين أطفال', 'فساتين مناسبات', 'فساتين أنيقة'],
      en: ['dresses', 'girls dresses', 'party dresses', 'formal dresses']
    }
  },
  outlet: {
    title: { he: 'אאוטלט', ar: 'تخفيضات', en: 'Outlet' },
    description: { 
      he: 'מבצעים והנחות על מוצרים נבחרים',
      ar: 'عروض وخصومات على منتجات مختارة',
      en: 'Amazing deals and discounts on selected premium items'
    },
    image: '/Pictures/MainCategories/lg_Outlet_Icon_Site_662ae14f66.webp',
    keywords: {
      he: ['מבצעים', 'הנחות', 'אאוטלט', 'מחירים מוזלים'],
      ar: ['عروض', 'خصومات', 'تخفيضات', 'أسعار مخفضة'],
      en: ['sale', 'outlet', 'discounts', 'deals', 'clearance']
    }
  }
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string }
}): Promise<Metadata> {
  // Validate category
  if (!validCategories.includes(slug)) {
    return {
      title: 'Category Not Found | Minimoda',
      description: 'The requested category could not be found.'
    }
  }

  // Get category data from smart or legacy categories
  const categoryData = smartCategoryMeta[slug as keyof typeof smartCategoryMeta] || 
                      categoryMeta[slug as keyof typeof categoryMeta]
  
  if (!categoryData) {
    return {
      title: 'Category Not Found | Minimoda',
      description: 'The requested category could not be found.'
    }
  }

  const title = categoryData.title[locale]
  const description = categoryData.description[locale]
  const keywords = categoryData.keywords[locale]

  return SEOService.generateMetadata(
    {
      title: `${title} | Minimoda`,
      description,
      keywords,
      image: categoryData.image,
      type: 'website'
    },
    locale
  )
}

export default async function CategoryPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string }
}) {
  // Validate category
  if (!validCategories.includes(slug)) {
    notFound()
  }

  // Get category data (smart or legacy)
  const categoryData = smartCategoryMeta[slug as keyof typeof smartCategoryMeta] || 
                      categoryMeta[slug as keyof typeof categoryMeta]

  // Load data on server side
  const dictionary = await getDictionary(locale)
  const allProducts = await productService.getAll(locale)

  // Use unified category system for filtering
  const categoryProducts = CategorySystem.filterProductsByCategory(allProducts, slug)
  
  // LEGACY: Keep old filtering as fallback for categories not in unified system
  const legacyFilteredProducts = allProducts.filter(product => {
    // Smart categories with purpose-driven filtering
    if (slug === 'new-drops') {
      // Latest arrivals (prefer isNew flag, fallback to recent createdAt)
      if (product.isNew) return true
      if (product.createdAt) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(product.createdAt) > thirtyDaysAgo
      }
      return false
    }
    
    if (slug === 'boys-zone') {
      // FIXED: ONLY actual boys clothing - no unisex mixing! (2025-08-12 18:22)
      return product.category === 'boys'
    }
    
    if (slug === 'girls-world') {
      // ONLY actual girls clothing - no mixing!
      return product.category === 'girls'
    }
    
    if (slug === 'tiny-treasures') {
      // Everything for babies 0-24 months (FIXED: 2025-08-12)
      return product.category === 'baby' || 
             (product.category === 'unisex' && product.age && product.age.includes('0-'))
    }
    
    if (slug === 'smart-deals') {
      // Curated deals with significant savings (30%+ off)
      if (!product.isSale) return false
      if (typeof product.discount === 'number') {
        return product.discount >= 30
      }
      // Handle string discount (legacy format)
      if (typeof product.discount === 'string') {
        const discountStr = product.discount as string
        return parseFloat(discountStr.replace('%', '')) >= 30
      }
      // If no discount info, check if originalPrice exists and calculate
      if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100
        return discountPercent >= 30
      }
      return false
    }
    
    if (slug === 'special-moments') {
      // Occasion wear (formal, holiday-themed)
      return product.tags && Array.isArray(product.tags) && (
        product.tags.includes('formal') || 
        product.tags.includes('holiday') || 
        product.tags.includes('special') ||
        product.tags.includes('dressy')
      )
    }
    
    if (slug === 'cozy-corner') {
      // Home comfort clothing (pajamas, loungewear)
      return product.tags && Array.isArray(product.tags) && (
        product.tags.includes('pajamas') || 
        product.tags.includes('sleepwear') || 
        product.tags.includes('loungewear') ||
        product.tags.includes('home')
      )
    }

    // Legacy category filtering (improved logic)
    if (slug === 'outlet') {
      return product.isSale
    }
    if (slug === 'dress') {
      // Only dresses or dress-like products
      return product.category === 'girls' && 
             (product.tags?.includes('dress') || 
              product.name?.en?.toLowerCase().includes('dress') ||
              product.name?.he?.includes('שמלה') ||
              product.name?.ar?.includes('فستان'))
    }
    if (slug === 'girls') {
      return product.category === 'girls'
    }
    if (slug === 'boys') {
      return product.category === 'boys'
    }
    if (slug === 'kids') {
      return product.category === 'boys' || product.category === 'girls'
    }
    if (slug === 'womens') {
      // Products for mothers/women (check tags since 'womens' isn't a valid category)
      return product.tags?.includes('mother') || product.tags?.includes('women') || false
    }
    if (slug === 'toys') {
      return product.tags?.includes('toy') || false
    }
    if (slug === 'home') {
      return product.tags?.includes('home') || false
    }
    if (slug === 'gear') {
      return product.tags?.includes('gear') || product.tags?.includes('equipment') || false
    }
    if (slug === 'baby') {
      return product.category === 'baby'
    }
    
    // Default: exact category match only
    return product.category === slug
  })
  
  // Use unified system result, fallback to legacy if no products found
  const finalProducts = categoryProducts.length > 0 ? categoryProducts : legacyFilteredProducts

  return (
    <CategoryClient 
      locale={locale}
      slug={slug}
      categoryData={categoryData}
      products={finalProducts}
      dictionary={dictionary}
    />
  )
}

export async function generateStaticParams() {
  // Generate static params for all valid categories
  const locales: Locale[] = ['en', 'he', 'ar']
  
  return locales.flatMap(locale =>
    validCategories.map(slug => ({
      locale,
      slug,
    }))
  )
}