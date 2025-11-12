/**
 * UNIFIED CATEGORY SYSTEM
 * Single source of truth for all category-related logic across the application
 */

export interface CategoryDefinition {
  id: string
  name: {
    en: string
    he: string
    ar: string
  }
  description: {
    en: string
    he: string
    ar: string
  }
  type: 'smart' | 'basic'
  primaryCategories: string[]  // Which basic categories this smart category includes
  requiredTags?: string[]      // Tags required for products to appear in this category
  filterLogic?: (product: any) => boolean  // Custom filtering logic
  slug: string
  isActive: boolean
  sortOrder: number
}

// SMART CATEGORIES - Purpose-driven categories for navigation and filtering
export const SMART_CATEGORIES: Record<string, CategoryDefinition> = {
  'new-drops': {
    id: 'new-drops',
    name: {
      en: 'New Drops',
      he: 'הכי חדש',
      ar: 'الأحدث'
    },
    description: {
      en: 'The freshest pieces that just landed this week',
      he: 'הפריטים החדשים ביותר שהגיעו אלינו השבוע',
      ar: 'أحدث القطع التي وصلت إلينا هذا الأسبوع'
    },
    type: 'smart',
    primaryCategories: ['boys', 'girls', 'baby', 'unisex'],
    filterLogic: (product) => {
      if (product.isNew) return true
      if (product.createdAt) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(product.createdAt) > thirtyDaysAgo
      }
      return false
    },
    slug: 'new-drops',
    isActive: true,
    sortOrder: 1
  },
  
  'boys-zone': {
    id: 'boys-zone',
    name: {
      en: 'Boys Zone',
      he: 'אזור הבנים',
      ar: 'منطقة الأولاد'
    },
    description: {
      en: 'Tough and comfy clothes for active boys who love to play hard',
      he: 'בגדים חזקים ונוחים לבנים פעילים שאוהבים להתגעש',
      ar: 'ملابس قوية ومريحة للأولاد النشطين الذين يحبون اللعب'
    },
    type: 'smart',
    primaryCategories: ['boys'],
    filterLogic: (product) => product.category === 'boys',
    slug: 'boys-zone',
    isActive: true,
    sortOrder: 2
  },
  
  'girls-world': {
    id: 'girls-world',
    name: {
      en: 'Girls World',
      he: 'עולם הבנות',
      ar: 'عالم البنات'
    },
    description: {
      en: 'Beautiful and unique fashion for girls who love to look amazing',
      he: 'אופנה יפה ומיוחדת לבנות שאוהבות להיראות מדהים',
      ar: 'أزياء جميلة ومميزة للبنات اللواتي يحببن أن يبدין رائعات'
    },
    type: 'smart',
    primaryCategories: ['girls'],
    filterLogic: (product) => product.category === 'girls',
    slug: 'girls-world',
    isActive: true,
    sortOrder: 3
  },
  
  'tiny-treasures': {
    id: 'tiny-treasures',
    name: {
      en: 'Tiny Treasures',
      he: 'אוצרות קטנים',
      ar: 'كنوز صغيرة'
    },
    description: {
      en: 'Everything babies need - safe, comfy, and extra adorable',
      he: 'כל מה שתינוקות צריכים - בטוח, נוח ומתוק במיוחד',
      ar: 'كل ما يحتاجه الأطفال الرضع - آمن ومريح ولطيف جداً'
    },
    type: 'smart',
    primaryCategories: ['baby', 'unisex'],
    filterLogic: (product) => {
      return product.category === 'baby' || 
             (product.category === 'unisex' && product.age && product.age.includes('0-'))
    },
    slug: 'tiny-treasures',
    isActive: true,
    sortOrder: 4
  },
  
  'smart-deals': {
    id: 'smart-deals',
    name: {
      en: 'Smart Deals',
      he: 'הצעות חכמות',
      ar: 'عروض ذكية'
    },
    description: {
      en: 'Real savings on quality products - not just any sale',
      he: 'הנחות אמיתיות על מוצרים איכותיים - לא סתם מבצעים',
      ar: 'خصومات حقيقية على منتجات عالية الجودة - ليس مجرد عروض'
    },
    type: 'smart',
    primaryCategories: ['boys', 'girls', 'baby', 'unisex'],
    filterLogic: (product) => {
      if (!product.isSale) return false
      if (typeof product.discount === 'number') {
        return product.discount >= 30
      }
      if (typeof product.discount === 'string') {
        const discountStr = product.discount as string
        return parseFloat(discountStr.replace('%', '')) >= 30
      }
      if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100
        return discountPercent >= 30
      }
      return false
    },
    slug: 'smart-deals',
    isActive: true,
    sortOrder: 5
  },
  
  'special-moments': {
    id: 'special-moments',
    name: {
      en: 'Special Moments',
      he: 'רגעים מיוחדים',
      ar: 'لحظات خاصة'
    },
    description: {
      en: 'Special outfits for holidays, events, and unforgettable memories',
      he: 'בגדים מיוחדים לחגים, אירועים וזכרונות בלתי נשכחים',
      ar: 'ملابس خاصة للعطل والمناسبات والذكريات التي لا تُنسى'
    },
    type: 'smart',
    primaryCategories: ['boys', 'girls', 'baby', 'unisex'],
    requiredTags: ['formal', 'holiday', 'special', 'dressy'],
    filterLogic: (product) => {
      return product.tags && Array.isArray(product.tags) && (
        product.tags.includes('formal') || 
        product.tags.includes('holiday') || 
        product.tags.includes('special') ||
        product.tags.includes('dressy')
      )
    },
    slug: 'special-moments',
    isActive: true,
    sortOrder: 6
  },
  
  'cozy-corner': {
    id: 'cozy-corner',
    name: {
      en: 'Cozy Corner',
      he: 'פינה נעימה',
      ar: 'ركن مريح'
    },
    description: {
      en: 'Comfort clothing for relaxing at home',
      he: 'בגדי נוחות להרגעה בבית',
      ar: 'ملابس مريحة للاسترخاء في المنزل'
    },
    type: 'smart',
    primaryCategories: ['boys', 'girls', 'baby', 'unisex'],
    requiredTags: ['pajamas', 'sleepwear', 'loungewear', 'home'],
    filterLogic: (product) => {
      return product.tags && Array.isArray(product.tags) && (
        product.tags.includes('pajamas') || 
        product.tags.includes('sleepwear') || 
        product.tags.includes('loungewear') ||
        product.tags.includes('home')
      )
    },
    slug: 'cozy-corner',
    isActive: true,
    sortOrder: 7
  }
}

// BASIC CATEGORIES - Database-level categorization
export const BASIC_CATEGORIES: Record<string, CategoryDefinition> = {
  'boys': {
    id: 'boys',
    name: {
      en: 'Boys',
      he: 'בנים',
      ar: 'أولاد'
    },
    description: {
      en: 'Boys clothing',
      he: 'בגדי בנים',
      ar: 'ملابس أولاد'
    },
    type: 'basic',
    primaryCategories: ['boys'],
    filterLogic: (product) => product.category === 'boys',
    slug: 'boys',
    isActive: true,
    sortOrder: 1
  },
  
  'girls': {
    id: 'girls',
    name: {
      en: 'Girls',
      he: 'בנות',
      ar: 'بنات'
    },
    description: {
      en: 'Girls clothing',
      he: 'בגדי בנות',
      ar: 'ملابس بنات'
    },
    type: 'basic',
    primaryCategories: ['girls'],
    filterLogic: (product) => product.category === 'girls',
    slug: 'girls',
    isActive: true,
    sortOrder: 2
  },
  
  'baby': {
    id: 'baby',
    name: {
      en: 'Baby',
      he: 'תינוקות',
      ar: 'أطفال رضع'
    },
    description: {
      en: 'Baby clothing',
      he: 'בגדי תינוקות',
      ar: 'ملابس أطفال رضع'
    },
    type: 'basic',
    primaryCategories: ['baby'],
    filterLogic: (product) => product.category === 'baby',
    slug: 'baby',
    isActive: true,
    sortOrder: 3
  },
  
  'unisex': {
    id: 'unisex',
    name: {
      en: 'Unisex',
      he: 'יוניסקס',
      ar: 'للجنسين'
    },
    description: {
      en: 'Unisex clothing',
      he: 'בגדים יוניסקס',
      ar: 'ملابس للجنسين'
    },
    type: 'basic',
    primaryCategories: ['unisex'],
    filterLogic: (product) => product.category === 'unisex',
    slug: 'unisex',
    isActive: true,
    sortOrder: 4
  }
}

// UTILITY FUNCTIONS
export class CategorySystem {
  // Get all categories (smart + basic)
  static getAllCategories(): CategoryDefinition[] {
    return [
      ...Object.values(SMART_CATEGORIES),
      ...Object.values(BASIC_CATEGORIES)
    ].sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  // Get only smart categories for navigation
  static getSmartCategories(): CategoryDefinition[] {
    return Object.values(SMART_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  // Get only basic categories for admin/filtering
  static getBasicCategories(): CategoryDefinition[] {
    return Object.values(BASIC_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  // Get category by slug
  static getCategoryBySlug(slug: string): CategoryDefinition | null {
    return SMART_CATEGORIES[slug] || BASIC_CATEGORIES[slug] || null
  }
  
  // Filter products by category
  static filterProductsByCategory(products: any[], categorySlug: string): any[] {
    const category = this.getCategoryBySlug(categorySlug)
    if (!category || !category.filterLogic) return []
    
    return products.filter(category.filterLogic)
  }
  
  // Check if product belongs to smart category
  static doesProductBelongToCategory(product: any, categorySlug: string): boolean {
    const category = this.getCategoryBySlug(categorySlug)
    if (!category || !category.filterLogic) return false
    
    return category.filterLogic(product)
  }
  
  // Get categories for product (both basic and smart)
  static getCategoriesForProduct(product: any): CategoryDefinition[] {
    const categories: CategoryDefinition[] = []
    
    // Add basic category
    const basicCategory = BASIC_CATEGORIES[product.category]
    if (basicCategory) {
      categories.push(basicCategory)
    }
    
    // Add applicable smart categories
    Object.values(SMART_CATEGORIES).forEach(smartCategory => {
      if (smartCategory.filterLogic && smartCategory.filterLogic(product)) {
        categories.push(smartCategory)
      }
    })
    
    return categories
  }
  
  // Validate category assignment for admin
  static validateCategoryAssignment(basicCategory: string, smartCategories: string[], tags: string[]): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check if basic category is valid
    if (!BASIC_CATEGORIES[basicCategory]) {
      errors.push(`Invalid basic category: ${basicCategory}`)
    }
    
    // Check smart categories
    smartCategories.forEach(smartCat => {
      const category = SMART_CATEGORIES[smartCat]
      if (!category) {
        errors.push(`Invalid smart category: ${smartCat}`)
        return
      }
      
      // Check if basic category is compatible
      if (!category.primaryCategories.includes(basicCategory)) {
        errors.push(`Smart category "${smartCat}" is not compatible with basic category "${basicCategory}"`)
      }
      
      // Check required tags
      if (category.requiredTags) {
        const hasRequiredTags = category.requiredTags.some(requiredTag => 
          tags.some(tag => tag.toLowerCase() === requiredTag.toLowerCase())
        )
        if (!hasRequiredTags) {
          warnings.push(`Smart category "${smartCat}" requires one of these tags: ${category.requiredTags.join(', ')}`)
        }
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}

// Export for easy access
export const getSmartCategories = CategorySystem.getSmartCategories
export const getBasicCategories = CategorySystem.getBasicCategories
export const getCategoryBySlug = CategorySystem.getCategoryBySlug
export const filterProductsByCategory = CategorySystem.filterProductsByCategory
