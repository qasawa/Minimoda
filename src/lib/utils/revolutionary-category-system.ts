/**
 * REVOLUTIONARY CATEGORY SYSTEM FOR MODERN PARENTS
 * Based on research into parent shopping psychology and modern retail trends
 * Age-first approach with activity-based secondary categorization
 */

export interface AgeGroup {
  id: string
  name: {
    en: string
    he: string
    ar: string
  }
  ageRange: string
  description: {
    en: string
    he: string
    ar: string
  }
  icon: string
  color: string
  bgGradient: string
  textColor: string
  sortOrder: number
  sizeGuide: string[]
}

export interface ActivityCategory {
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
  icon: string
  color: string
  bgGradient: string
  keywords: string[]
  parentNeed: {
    en: string
    he: string
    ar: string
  }
  sortOrder: number
}

export interface SmartFilter {
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
  icon: string
  filterLogic: (product: any) => boolean
  badge?: {
    text: {
      en: string
      he: string
      ar: string
    }
    color: string
  }
}

// PRIMARY NAVIGATION: Age-First Approach
export const AGE_GROUPS: Record<string, AgeGroup> = {
  'newborn': {
    id: 'newborn',
    name: {
      en: 'NEWBORN',
      he: 'יילודים',
      ar: 'حديثي الولادة'
    },
    ageRange: '0-3M',
    description: {
      en: 'Perfect for your tiny miracle - gentle, safe, and snuggle-ready',
      he: 'מושלם לנס הקטן שלכם - עדין, בטוח ומוכן לחיבוקים',
      ar: 'مثالي لمعجزتكم الصغيرة - لطيف وآمن وجاهز للعناق'
    },
    icon: '👶',
    color: 'pink',
    bgGradient: 'from-pink-100 via-rose-50 to-pink-100',
    textColor: 'text-pink-800',
    sortOrder: 1,
    sizeGuide: ['Newborn', '0-3M', '3M']
  },
  
  'baby': {
    id: 'baby',
    name: {
      en: 'BABY',
      he: 'תינוקות',
      ar: 'أطفال رضع'
    },
    ageRange: '3-24M',
    description: {
      en: 'Growing fast! Clothes that move, play, and explore with them',
      he: 'גדלים מהר! בגדים שזים, משחקים וחוקרים איתם',
      ar: 'يكبرون بسرعة! ملابس تتحرك وتلعب وتستكشف معهم'
    },
    icon: '🍼',
    color: 'blue',
    bgGradient: 'from-blue-100 via-sky-50 to-blue-100',
    textColor: 'text-blue-800',
    sortOrder: 2,
    sizeGuide: ['3M', '6M', '9M', '12M', '18M', '24M']
  },

  'toddler': {
    id: 'toddler',
    name: {
      en: 'TODDLER',
      he: 'פעוטות',
      ar: 'أطفال صغار'
    },
    ageRange: '2-4Y',
    description: {
      en: 'Adventure mode activated! Mess-proof clothes for little explorers',
      he: 'מצב הרפתקה מופעל! בגדים עמידים לחוקרים קטנים',
      ar: 'تم تفعيل وضع المغامرة! ملابس مقاومة للفوضى للمستكشفين الصغار'
    },
    icon: '🚀',
    color: 'green',
    bgGradient: 'from-green-100 via-emerald-50 to-green-100',
    textColor: 'text-green-800',
    sortOrder: 3,
    sizeGuide: ['2T', '3T', '4T']
  },

  'little-kids': {
    id: 'little-kids',
    name: {
      en: 'LITTLE KIDS',
      he: 'ילדים קטנים',
      ar: 'أطفال صغار'
    },
    ageRange: '4-8Y',
    description: {
      en: 'Big kid energy! Style meets function for school and play',
      he: 'אנרגיית ילדים גדולים! סטייל פוגש פונקציה לבית ספר ומשחק',
      ar: 'طاقة الأطفال الكبار! الأناقة تلتقي بالوظيفة للمدرسة واللعب'
    },
    icon: '🎨',
    color: 'purple',
    bgGradient: 'from-purple-100 via-violet-50 to-purple-100',
    textColor: 'text-purple-800',
    sortOrder: 4,
    sizeGuide: ['4', '5', '6', '7', '8']
  },

  'big-kids': {
    id: 'big-kids',
    name: {
      en: 'BIG KIDS',
      he: 'ילדים גדולים',
      ar: 'أطفال كبار'
    },
    ageRange: '8-14Y',
    description: {
      en: 'Growing independence! Trendy clothes for confident kids',
      he: 'עצמאות גוברת! בגדים טרנדיים לילדים בטוחים בעצמם',
      ar: 'استقلالية متنامية! ملابس عصرية للأطفال الواثقين من أنفسهم'
    },
    icon: '⚡',
    color: 'orange',
    bgGradient: 'from-orange-100 via-amber-50 to-orange-100',
    textColor: 'text-orange-800',
    sortOrder: 5,
    sizeGuide: ['8', '10', '12', '14', 'XS', 'S', 'M']
  }
}

// SECONDARY CATEGORIES: Activity-Based Shopping
export const ACTIVITY_CATEGORIES: Record<string, ActivityCategory> = {
  'school-mode': {
    id: 'school-mode',
    name: {
      en: 'School Mode',
      he: 'מצב בית ספר',
      ar: 'وضع المدرسة'
    },
    description: {
      en: 'Morning-ready essentials that handle playground adventures',
      he: 'חיוניות מוכנות לבוקר שמתמודדות עם הרפתקאות במגרש',
      ar: 'الأساسيات الجاهزة للصباح التي تتعامل مع مغامرات الملعب'
    },
    icon: '🎒',
    color: 'blue',
    bgGradient: 'from-blue-500 to-cyan-500',
    keywords: ['uniform', 'school', 'everyday', 'durable', 'practical'],
    parentNeed: {
      en: 'Clothes that look good all day and survive recess',
      he: 'בגדים שנראים טוב כל היום ושורדים את ההפסקה',
      ar: 'ملابس تبدو جيدة طوال اليوم وتنجو من الاستراحة'
    },
    sortOrder: 1
  },

  'play-wild': {
    id: 'play-wild',
    name: {
      en: 'Play Wild',
      he: 'שחק בפראות',
      ar: 'العب ببراعة'
    },
    description: {
      en: 'Climb-anything clothes for outdoor adventures and active play',
      he: 'בגדים לטיפוס על כל דבר להרפתקאות חוץ ומשחק פעיל',
      ar: 'ملابس للتسلق على أي شيء للمغامرات الخارجية واللعب النشط'
    },
    icon: '🏃',
    color: 'green',
    bgGradient: 'from-green-500 to-emerald-500',
    keywords: ['activewear', 'sports', 'outdoor', 'athletic', 'adventure'],
    parentNeed: {
      en: 'Let them be kids without worrying about stains',
      he: 'תן להם להיות ילדים בלי לדאוג מכתמים',
      ar: 'دعهم يكونوا أطفالاً دون القلق بشأن البقع'
    },
    sortOrder: 2
  },

  'dream-time': {
    id: 'dream-time',
    name: {
      en: 'Dream Time',
      he: 'זמן חלומות',
      ar: 'وقت الأحلام'
    },
    description: {
      en: 'Snuggle-soft sleepwear and weekend comfort clothes',
      he: 'בגדי שינה רכים לחיבוקים ובגדי נוחות לסוף השבוע',
      ar: 'ملابس نوم ناعمة للاحتضان وملابس راحة لعطلة نهاية الأسبوع'
    },
    icon: '😴',
    color: 'purple',
    bgGradient: 'from-purple-500 to-violet-500',
    keywords: ['pajamas', 'sleepwear', 'loungewear', 'comfort', 'soft'],
    parentNeed: {
      en: 'Peaceful sleep and cozy moments together',
      he: 'שינה שקטה ורגעים נעימים יחד',
      ar: 'نوم هادئ ولحظات مريحة معاً'
    },
    sortOrder: 3
  },

  'celebration-ready': {
    id: 'celebration-ready',
    name: {
      en: 'Celebration Ready',
      he: 'מוכן לחגיגה',
      ar: 'جاهز للاحتفال'
    },
    description: {
      en: 'Picture-perfect outfits for special moments and memories',
      he: 'תלבושות מושלמות לתמונות לרגעים מיוחדים וזכרונות',
      ar: 'ملابس مثالية للصور للحظات الخاصة والذكريات'
    },
    icon: '✨',
    color: 'pink',
    bgGradient: 'from-pink-500 to-rose-500',
    keywords: ['formal', 'special', 'holiday', 'party', 'dressy'],
    parentNeed: {
      en: 'Looking their best for life\'s special moments',
      he: 'להיראות הכי טוב ברגעים המיוחדים של החיים',
      ar: 'تبدو في أفضل حالاتها للحظات الخاصة في الحياة'
    },
    sortOrder: 4
  },

  'weather-warriors': {
    id: 'weather-warriors',
    name: {
      en: 'Weather Warriors',
      he: 'לוחמי מזג האוויר',
      ar: 'محاربو الطقس'
    },
    description: {
      en: 'Layer-smart clothes that handle any weather adventure',
      he: 'בגדים חכמים בשכבות שמתמודדים עם כל הרפתקת מזג אוויר',
      ar: 'ملابس ذكية بطبقات تتعامل مع أي مغامرة طقس'
    },
    icon: '🌦️',
    color: 'teal',
    bgGradient: 'from-teal-500 to-cyan-500',
    keywords: ['outerwear', 'jacket', 'rain', 'winter', 'layering'],
    parentNeed: {
      en: 'Ready for whatever weather throws at you',
      he: 'מוכן לכל מה שמזג האוויר יזרוק עליכם',
      ar: 'مستعد لأي طقس يواجهكم'
    },
    sortOrder: 5
  },

  'eco-conscious': {
    id: 'eco-conscious',
    name: {
      en: 'Eco-Conscious',
      he: 'מודעים לסביבה',
      ar: 'واعون بيئياً'
    },
    description: {
      en: 'Planet-friendly picks that grow with your values',
      he: 'בחירות ידידותיות לכדור הארץ שגדלות עם הערכים שלכם',
      ar: 'اختيارات صديقة للكوكب تنمو مع قيمكم'
    },
    icon: '🌱',
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-green-500',
    keywords: ['organic', 'sustainable', 'eco', 'natural', 'recycled'],
    parentNeed: {
      en: 'Teaching kids to care for our planet',
      he: 'ללמד ילדים לדאוג לכדור הארץ שלנו',
      ar: 'تعليم الأطفال الاهتمام بكوكبنا'
    },
    sortOrder: 6
  }
}

// SMART FILTERS: Intelligence Layer
export const SMART_FILTERS: Record<string, SmartFilter> = {
  'budget-friendly': {
    id: 'budget-friendly',
    name: {
      en: 'Budget-Friendly',
      he: 'ידידותי לתקציב',
      ar: 'صديق للميزانية'
    },
    description: {
      en: 'Quality clothes that won\'t break the bank',
      he: 'בגדים איכותיים שלא יפרצו את הבנק',
      ar: 'ملابس عالية الجودة لن تكسر البنك'
    },
    icon: '💰',
    filterLogic: (product) => product.price <= 50 || product.isSale,
    badge: {
      text: { en: 'Great Value', he: 'ערך מעולה', ar: 'قيمة ممتازة' },
      color: 'green'
    }
  },

  'new-this-week': {
    id: 'new-this-week',
    name: {
      en: 'New This Week',
      he: 'חדש השבוע',
      ar: 'جديد هذا الأسبوع'
    },
    description: {
      en: 'Fresh arrivals - be the first to discover',
      he: 'הגעות טריות - תהיו הראשונים לגלות',
      ar: 'وصولات جديدة - كونوا أول من يكتشف'
    },
    icon: '🆕',
    filterLogic: (product) => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return new Date(product.createdAt) > sevenDaysAgo
    },
    badge: {
      text: { en: 'New', he: 'חדש', ar: 'جديد' },
      color: 'blue'
    }
  },

  'last-chance': {
    id: 'last-chance',
    name: {
      en: 'Last Chance',
      he: 'הזדמנות אחרונה',
      ar: 'فرصة أخيرة'
    },
    description: {
      en: 'Limited stock - grab them while you can',
      he: 'מלאי מוגבל - תפסו אותם כשאתם יכולים',
      ar: 'مخزون محدود - احصلوا عليها وأنتم تستطيعون'
    },
    icon: '⏰',
    filterLogic: (product) => product.stock <= 5 || product.isLimitedEdition,
    badge: {
      text: { en: 'Limited', he: 'מוגבל', ar: 'محدود' },
      color: 'red'
    }
  },

  'parent-favorites': {
    id: 'parent-favorites',
    name: {
      en: 'Parent Favorites',
      he: 'מועדפי ההורים',
      ar: 'مفضلات الوالدين'
    },
    description: {
      en: 'Loved by parents, tested by kids',
      he: 'אהובים על ההורים, נבדקו על ידי ילדים',
      ar: 'محبوب من الوالدين، مختبر من الأطفال'
    },
    icon: '⭐',
    filterLogic: (product) => product.rating >= 4.5 || product.reviewCount >= 20,
    badge: {
      text: { en: 'Loved', he: 'אהוב', ar: 'محبوב' },
      color: 'yellow'
    }
  },

  'easy-care': {
    id: 'easy-care',
    name: {
      en: 'Easy Care',
      he: 'טיפול קל',
      ar: 'عناية سهلة'
    },
    description: {
      en: 'Machine washable, stain-resistant heroes',
      he: 'גיבורים שניתנים לכביסה במכונה, עמידים לכתמים',
      ar: 'أبطال قابلة للغسل في الغسالة ومقاومة للبقع'
    },
    icon: '🧺',
    filterLogic: (product) => product.tags?.includes('machine-washable') || product.tags?.includes('stain-resistant'),
    badge: {
      text: { en: 'Easy Care', he: 'טיפול קל', ar: 'عناية سهلة' },
      color: 'teal'
    }
  }
}

// REVOLUTIONARY NAVIGATION FEATURES

export interface StyleQuizQuestion {
  id: string
  question: {
    en: string
    he: string
    ar: string
  }
  options: Array<{
    id: string
    text: {
      en: string
      he: string
      ar: string
    }
    icon: string
    weights: Record<string, number>
  }>
}

export const STYLE_QUIZ_QUESTIONS: StyleQuizQuestion[] = [
  {
    id: 'activity-level',
    question: {
      en: 'How active is your child?',
      he: 'כמה פעיל הילד שלכם?',
      ar: 'كم هو نشيط طفلكم؟'
    },
    options: [
      {
        id: 'very-active',
        text: { en: 'Always on the move', he: 'תמיד בתנועה', ar: 'دائماً في حركة' },
        icon: '🏃‍♂️',
        weights: { 'play-wild': 3, 'school-mode': 2, 'easy-care': 3 }
      },
      {
        id: 'moderate',
        text: { en: 'Mix of play and quiet time', he: 'שילוב של משחק וזמן שקט', ar: 'مزيج من اللعب والوقت الهادئ' },
        icon: '🎨',
        weights: { 'school-mode': 3, 'celebration-ready': 2, 'eco-conscious': 1 }
      },
      {
        id: 'calm',
        text: { en: 'Prefers quiet activities', he: 'מעדיף פעילויות שקטות', ar: 'يفضل الأنشطة الهادئة' },
        icon: '📚',
        weights: { 'dream-time': 3, 'celebration-ready': 2, 'eco-conscious': 2 }
      }
    ]
  },
  {
    id: 'biggest-challenge',
    question: {
      en: 'What\'s your biggest clothing challenge?',
      he: 'מה האתגר הכי גדול שלכם עם בגדים?',
      ar: 'ما هو أكبر تحدٍ لديكم مع الملابس؟'
    },
    options: [
      {
        id: 'stains',
        text: { en: 'Constant stains and spills', he: 'כתמים ושפיכות קבועות', ar: 'بقع وانسكابات مستمرة' },
        icon: '🎨',
        weights: { 'easy-care': 3, 'play-wild': 2, 'budget-friendly': 2 }
      },
      {
        id: 'growth',
        text: { en: 'They outgrow everything fast', he: 'הם מתחרגים מהכל מהר', ar: 'يكبرون على كل شيء بسرعة' },
        icon: '📏',
        weights: { 'budget-friendly': 3, 'eco-conscious': 2 }
      },
      {
        id: 'comfort',
        text: { en: 'Finding comfortable fits', he: 'למצוא התאמה נוחה', ar: 'العثور على مقاسات مريحة' },
        icon: '🤗',
        weights: { 'dream-time': 3, 'eco-conscious': 2, 'easy-care': 1 }
      }
    ]
  },
  {
    id: 'style-priority',
    question: {
      en: 'What\'s most important to you?',
      he: 'מה הכי חשוב לכם?',
      ar: 'ما هو الأهم بالنسبة لكم؟'
    },
    options: [
      {
        id: 'durability',
        text: { en: 'Long-lasting quality', he: 'איכות עמידה', ar: 'جودة تدوم طويلاً' },
        icon: '💪',
        weights: { 'play-wild': 3, 'easy-care': 2, 'eco-conscious': 2 }
      },
      {
        id: 'style',
        text: { en: 'Looking fashionable', he: 'להיראות אופנתי', ar: 'المظهر العصري' },
        icon: '✨',
        weights: { 'celebration-ready': 3, 'school-mode': 2 }
      },
      {
        id: 'comfort',
        text: { en: 'Ultimate comfort', he: 'נוחות מקסימלית', ar: 'راحة قصوى' },
        icon: '☁️',
        weights: { 'dream-time': 3, 'eco-conscious': 2, 'easy-care': 1 }
      }
    ]
  }
]

// UTILITY FUNCTIONS

export class RevolutionaryCategorySystem {
  static getAgeGroups(): AgeGroup[] {
    return Object.values(AGE_GROUPS).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  static getActivityCategories(): ActivityCategory[] {
    return Object.values(ACTIVITY_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  static getSmartFilters(): SmartFilter[] {
    return Object.values(SMART_FILTERS)
  }

  static getAgeGroupById(id: string): AgeGroup | null {
    return AGE_GROUPS[id] || null
  }

  static getActivityCategoryById(id: string): ActivityCategory | null {
    return ACTIVITY_CATEGORIES[id] || null
  }

  static filterProductsByAge(products: any[], ageGroupId: string): any[] {
    const ageGroup = this.getAgeGroupById(ageGroupId)
    if (!ageGroup) return []

    return products.filter(product => {
      // Match by size guide or age range
      return product.sizes?.some((size: string) => 
        ageGroup.sizeGuide.includes(size)
      ) || product.ageRange === ageGroup.ageRange
    })
  }

  static filterProductsByActivity(products: any[], activityId: string): any[] {
    const activity = this.getActivityCategoryById(activityId)
    if (!activity) return []

    return products.filter(product => {
      return activity.keywords.some(keyword => 
        product.tags?.includes(keyword) || 
        product.category?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword)
      )
    })
  }

  static getRecommendationsFromQuiz(answers: Record<string, string>): {
    ageGroups: string[]
    activities: string[]
    filters: string[]
  } {
    const weights: Record<string, number> = {}

    // Calculate weights from quiz answers
    Object.values(answers).forEach(answerId => {
      STYLE_QUIZ_QUESTIONS.forEach(question => {
        const option = question.options.find(opt => opt.id === answerId)
        if (option) {
          Object.entries(option.weights).forEach(([key, weight]) => {
            weights[key] = (weights[key] || 0) + weight
          })
        }
      })
    })

    // Get top recommendations
    const sorted = Object.entries(weights).sort(([,a], [,b]) => b - a)
    
    return {
      ageGroups: [], // Will be determined by parent input
      activities: sorted.slice(0, 3).map(([key]) => key).filter(key => ACTIVITY_CATEGORIES[key]),
      filters: sorted.slice(0, 2).map(([key]) => key).filter(key => SMART_FILTERS[key])
    }
  }
}
