import { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: '1',
    name: {
      en: 'Liberty Print Personalised Pyjamas',
      he: 'פיג\'מות מותאמות אישית בדוגמת ליברטי',
      ar: 'بيجامات مطبوعة ليبرتي مخصصة'
    },
    description: {
      en: 'Beautiful Liberty of London print personalised with your child\'s name',
      he: 'דוגמת ליברטי של לונדון יפהפייה המותאמת עם שם הילד שלך',
      ar: 'طباعة ليبرتي أوف لندن جميلة مخصصة باسم طفلك'
    },
    price: 40.00,
    originalPrice: 52.00,
    brand: 'MY LITTLE SHOP UK',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519238536508-75f8da09d7a2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      {
        name: { en: 'Liberty Floral', he: 'פרחי ליברטי', ar: 'زهور ليبرتي' },
        hex: '#FF6B6B',
        images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Liberty Blue', he: 'ליברטי כחול', ar: 'ليبرتي أزرق' },
        hex: '#5B7C99',
        images: ['https://images.unsplash.com/photo-1519238536508-75f8da09d7a2?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    isNew: true,
    isSale: true,
    featured: true,
    isExclusive: true,
    discount: 23,
    stock: 25,
    tags: ['sleepwear', 'pajamas', 'cozy', 'liberty'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: {
      en: 'Organic Cotton Floral Dress',
      he: 'שמלת כותנה אורגנית פרחונית',
      ar: 'فستان قطني عضوي بنقشة زهور'
    },
    description: {
      en: 'Light and breezy dress perfect for sunny adventures',
      he: 'שמלה קלה ואוורירית מושלמת להרפתקאות שמשיות',
      ar: 'فستان خفيف ومنعش مثالي للمغامرات المشمسة'
    },
    brand: 'STELLA MCCARTNEY KIDS',
    price: 89.00,
    originalPrice: 115.00,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      {
        name: { en: 'Coral', he: 'אלמוג', ar: 'مرجاني' },
        hex: '#FF6B6B',
        images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Mint', he: 'מנטה', ar: 'نعناع' },
        hex: '#4ECDC4',
        images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'girls',
    age: '2-8 years',
    isSale: true,
    featured: true,
    discount: 22,
    stock: 18,
    tags: ['dress', 'floral', 'cotton', 'organic', 'special'],
    createdAt: '2024-01-20T14:00:00Z',
    isNew: false
  },
  {
    id: '3',
    name: {
      en: 'Adventure Shorts',
      he: 'מכנסי הרפתקה',
      ar: 'شورت المغامرة'
    },
    brand: 'PATAGONIA KIDS',
    description: {
      en: 'Durable shorts built for playground adventures',
      he: 'מכנסיים קצרים עמידים בנויים להרפתקאות בגן המשחקים',
      ar: 'شورت متين مصمم لمغامرات الملعب'
    },
    price: 22.99,
    images: [
      'https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Navy', he: 'כחול כהה', ar: 'كحلي' },
        hex: '#2C3E50',
        images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Khaki', he: 'חאקי', ar: 'كاكي' },
        hex: '#D4A574',
        images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '2-8 years',
    featured: true,
    stock: 22,
    tags: ['shorts', 'adventure', 'active', 'outdoor'],
    createdAt: '2024-02-01T09:00:00Z',
    isNew: false,
    isSale: false
  },
  {
    id: '4',
    name: {
      en: 'Cloud Soft Onesie',
      he: 'בגד גוף רך כענן',
      ar: 'بدلة ناعمة كالسحاب'
    },
    description: {
      en: 'Ultra-soft organic cotton onesie for happy babies',
      he: 'בגד גוף מכותנה אורגנית רכה במיוחד לתינוקות שמחים',
      ar: 'بدلة قطنية عضوية فائقة النعومة للأطفال السعداء'
    },
    price: 16.99,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Cloud White', he: 'לבן ענן', ar: 'أبيض سحابي' },
        hex: '#FFFFFF',
        images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Butter Yellow', he: 'צהוב חמאה', ar: 'أصفر زبدي' },
        hex: '#FFE66D',
        images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
    category: 'baby',
        age: '0-24 months',
    isNew: true,
    stock: 8,
    tags: ["soft","gentle","adorable"],
    createdAt: '2025-07-27T16:01:07.980Z',
    isSale: true
  },
  {
    id: '5',
    name: {
      en: 'Happy Stripes Jumpsuit',
      he: 'אוברול פסים שמחים',
      ar: 'بدلة مخططة سعيدة'
    },
    description: {
      en: 'Playful striped jumpsuit for all-day comfort',
      he: 'אוברול פסים שובב לנוחות כל היום',
      ar: 'بدلة مخططة مرحة لراحة طوال اليوم'
    },
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Multi Stripe', he: 'פסים צבעוניים', ar: 'خطوط متعددة' },
        hex: '#FF6B6B',
        images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6'],
    category: 'girls',
    age: '2-6 years',
    isNew: true,
    featured: true
,
    stock: 33,
    tags: ["dress","pretty","fashion"],
    createdAt: '2025-06-29T16:01:07.980Z',
    isSale: true},
  {
    id: '6',
    name: {
      en: 'Explorer Jacket',
      he: 'ג׳קט חוקר',
      ar: 'سترة المستكشف'
    },
    description: {
      en: 'Weather-ready jacket for little explorers',
      he: 'ג׳קט מוכן למזג אוויר לחוקרים קטנים',
      ar: 'سترة جاهزة للطقس للمستكشفين الصغار'
    },
    price: 49.99,
    originalPrice: 59.99,
    images: [
      'https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Forest Green', he: 'ירוק יער', ar: 'أخضر غابة' },
        hex: '#228B22',
        images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    isSale: true,
    discount: 17
,
    stock: 18,
    tags: ["comfortable","quality","versatile"],
    createdAt: '2025-07-20T16:01:07.980Z',
    isNew: false},
  {
    id: '7',
    name: {
      en: 'Twirl & Swirl Skirt',
      he: 'חצאית סיבוב וסחרור',
      ar: 'تنورة الدوران'
    },
    description: {
      en: 'Perfect twirling skirt for dance parties and play dates',
      he: 'חצאית מסתובבת מושלמת למסיבות ריקודים ומפגשי משחק',
      ar: 'تنورة دوارة مثالية لحفلات الرقص ومواعيد اللعب'
    },
    price: 27.99,
    images: [
      'https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Pink Tulle', he: 'טול ורוד', ar: 'تول وردي' },
        hex: '#FFB6C1',
        images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Lavender', he: 'לבנדר', ar: 'لافندر' },
        hex: '#E6E6FA',
        images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'girls',
    age: '2-8 years'
,
    stock: 21,
    tags: ["dress","pretty","fashion"],
    createdAt: '2025-06-14T16:01:07.980Z',
    isNew: false,
    isSale: false},
  {
    id: '8',
    name: {
      en: 'Cozy Bear Hoodie',
      he: 'קפוצ׳ון דוב נעים',
      ar: 'هودي الدب المريح'
    },
    description: {
      en: 'Snuggly hoodie with adorable bear ears',
      he: 'קפוצ׳ון מחבק עם אוזני דוב מקסימות',
      ar: 'هودي دافئ مع آذان دب رائعة'
    },
    price: 32.99,
    images: [
      'https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop'
    ],
    colors: [
      {
        name: { en: 'Brown Bear', he: 'דוב חום', ar: 'دب بني' },
        hex: '#8B4513',
        images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop']
      },
      {
        name: { en: 'Grey Bear', he: 'דוב אפור', ar: 'دب رمادي' },
        hex: '#808080',
        images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop']
      },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    featured: true
  },
  // ===== BOYS ZONE EXPANSION (25 products) =====
  {
    id: '9',
    name: {
      en: 'Adventure Cargo Pants',
      he: 'מכנסי קרגו הרפתקה',
      ar: 'بنطال كارجو المغامرة'
    },
    description: {
      en: 'Durable cargo pants with multiple pockets for active boys',
      he: 'מכנסי קרגו עמידים עם כיסים רבים לבנים פעילים',
      ar: 'بنطال كارجو متين مع جيوب متعددة للأولاد النشطين'
    },
    price: 34.99,
    brand: 'PATAGONIA KIDS',
    images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Olive', he: 'זית', ar: 'زيتوني' }, hex: '#6B8E23', images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Navy', he: 'כחול כהה', ar: 'كحلي' }, hex: '#2C3E50', images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'] },
    ],
    stock: 15,
    tags: ["comfortable","quality","versatile","active","outdoor","durable"],
    createdAt: '2025-07-19T16:01:07.980Z',
    isNew: false,
    isSale: false,
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '2-8 years',
    featured: true
  },
  {
    id: '10',
    name: {
      en: 'Cool Dude T-Shirt',
      he: 'חולצת קול דוד',
      ar: 'تي شيرت كول دود'
    },
    description: {
      en: 'Soft cotton t-shirt with fun graphics for everyday wear',
      he: 'חולצת כותנה רכה עם גרפיקה כיפית ללבישה יומיומית',
      ar: 'تي شيرت قطني ناعم مع رسوم ممتعة للاستخدام اليومي'
    },
    price: 18.99,
    brand: 'CARTER\'S',
    images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Blue', he: 'כחול', ar: 'أزرق' }, hex: '#3498DB', images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Red', he: 'אדום', ar: 'أحمر' }, hex: '#E74C3C', images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '2-8 years',
    isNew: true
,
    stock: 12,
    tags: ["active","adventure","cool"],
    createdAt: '2025-07-02T16:01:07.980Z',
    isSale: false},
  {
    id: '11',
    name: {
      en: 'Soccer Champion Jersey',
      he: 'חולצת אלוף כדורגל',
      ar: 'قميص بطل كرة القدم'
    },
    description: {
      en: 'Breathable sports jersey for future soccer stars',
      he: 'חולצת ספורט נושמת לכוכבי כדורגל עתידיים',
      ar: 'قميص رياضي قابل للتنفس لنجوم كرة القدم المستقبليين'
    },
    price: 24.99,
    originalPrice: 29.99,
    brand: 'NIKE KIDS',
    images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Blue/White', he: 'כחול/לבן', ar: 'أزرق/أبيض' }, hex: '#3498DB', images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Green/White', he: 'ירוק/לבן', ar: 'أخضر/أبيض' }, hex: '#27AE60', images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '3-8 years',
    isSale: true,
    discount: 17,
    tags: ['sports', 'soccer', 'active']
  },
  
  // ===== GIRLS WORLD EXPANSION (25 products) =====
  {
    id: '12',
    name: {
      en: 'Princess Sparkle Dress',
      he: 'שמלת נסיכה נוצצת',
      ar: 'فستان أميرة لامع'
    },
    description: {
      en: 'Sparkly tulle dress with elegant layers perfect for special occasions',
      he: 'שמלת טול נוצצת עם שכבות אלגנטיות מושלמת לאירועים מיוחדים',
      ar: 'فستان تول متלألئ مع طبقات أنيقة مثالي للمناسبات الخاصة'
    },
    price: 45.99,
    originalPrice: 55.99,
    brand: 'DISNEY PRINCESS',
    images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Rainbow', he: 'קשת בענן', ar: 'قوס قزح' }, hex: '#FF69B4', images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Pink Sparkle', he: 'ורוד נוצץ', ar: 'وردي لامع' }, hex: '#FFB6C1', images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'] },
    ],
    stock: 28,
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'girls',
    age: '2-8 years',
    isSale: true,
    discount: 18,
    featured: true,
    tags: ['formal', 'princess', 'special', 'dressy'],
    createdAt: '2025-06-30T16:01:07.980Z',
    isNew: false
  },
  {
    id: '13',
    name: {
      en: 'Unicorn Dreams Top',
      he: 'חולצת חלומות חד קרן',
      ar: 'بلوزة أحلام اليونيكورن'
    },
    description: {
      en: 'Magical unicorn print top with glittery details',
      he: 'חולצה עם הדפס חד קרן קסום ופרטי נצנוץ',
      ar: 'بلوزة بطبعة وحيد القرن السحرية مع تفاصيل لامعة'
    },
    price: 22.99,
    brand: 'H&M KIDS',
    images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Lavender', he: 'לבנדר', ar: 'لافندر' }, hex: '#E6E6FA', images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Mint', he: 'מנטה', ar: 'نعناع' }, hex: '#98FB98', images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'girls',
    age: '2-8 years',
    isNew: true,
    tags: ['unicorn', 'magical', 'glitter']
  },
  
  // ===== TINY TREASURES (BABY 0-24MO) EXPANSION (20 products) =====
  {
    id: '14',
    name: {
      en: 'Sweet Dreams Sleep Sack',
      he: 'שק שינה חלומות מתוקים',
      ar: 'كيس نوم الأحلام الحلوة'
    },
    description: {
      en: 'Safe sleep sack to keep baby cozy all night long',
      he: 'שק שינה בטוח לשמירה על התינוק חם כל הלילה',
      ar: 'كيس نوم آمن للحفاظ على دفء الطفل طوال الليل'
    },
    price: 29.99,
    brand: 'HALO',
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Soft Blue', he: 'כחול רך', ar: 'أزرق ناعم' }, hex: '#ADD8E6', images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Pink Cloud', he: 'ענן ורוד', ar: 'سحابة وردية' }, hex: '#FFB6C1', images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    category: 'baby',
    age: '0-18 months',
    featured: true,
    stock: 13,
    tags: ['safe', 'sleep', 'cozy'],
    createdAt: '2025-06-26T16:01:07.980Z',
    isNew: false,
    isSale: false
  },
  {
    id: '15',
    name: {
      en: 'Tiny Explorer Romper',
      he: 'אוברול חוקר קטן',
      ar: 'رومبر المستكشف الصغير'
    },
    description: {
      en: 'Adorable animal print romper for little adventurers',
      he: 'אוברול מקסים עם הדפס חיות לחוקרים קטנים',
      ar: 'رومبر لطيف بطبعة حيوانات للمستكشفين الصغار'
    },
    price: 19.99,
    brand: 'CARTERS',
    images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Safari', he: 'ספארי', ar: 'سفاري' }, hex: '#DEB887', images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Ocean', he: 'אוקיינוס', ar: 'محيط' }, hex: '#20B2AA', images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
    category: 'baby',
    age: '0-24 months',
    isNew: true,
    tags: ['explorer', 'animals', 'adventure']
  },
  
  // ===== SMART DEALS (SALE ITEMS 30%+ OFF) =====
  {
    id: '16',
    name: {
      en: 'Designer Denim Jacket',
      he: 'ג\'קט ג\'ינס מעצב',
      ar: 'جاكيت جينز مصمم'
    },
    description: {
      en: 'Premium denim jacket with embroidered details',
      he: 'ג\'קט ג\'ינס פרמיום עם פרטי רקמה',
      ar: 'جاكيت جينز فاخر مع تفاصيل مطرزة'
    },
    price: 39.99,
    originalPrice: 65.99,
    brand: 'POLO RALPH LAUREN KIDS',
    images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Classic Blue', he: 'כחול קלאסי', ar: 'أزرق كلاسيكي' }, hex: '#4682B4', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
    ],
    stock: 19,
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    isSale: true,
    discount: 39,
    featured: true,
    tags: ['designer', 'denim', 'premium']
  },
  
  // ===== COZY CORNER (HOME/SLEEP WEAR) =====
  {
    id: '17',
    name: {
      en: 'Fluffy Cloud Slippers',
      he: 'כפכפי ענן רכים',
      ar: 'شباشب السحابة الناعمة'
    },
    description: {
      en: 'Ultra-soft house slippers shaped like fluffy clouds',
      he: 'כפכפי בית רכים במיוחד בצורת עננים רכים',
      ar: 'شباشب منزلية فائقة النعومة على شكل سحب ناعمة'
    },
    price: 14.99,
    brand: 'COZY KIDS',
    images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'White Cloud', he: 'ענן לבן', ar: 'سحابة بيضاء' }, hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Pink Cloud', he: 'ענן ורוד', ar: 'سحابة وردية' }, hex: '#FFB6C1', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['12-18M', '18-24M', '2T', '3T', '4T', '5', '6'],
    category: 'unisex',
    age: '1-6 years',
    tags: ['slippers', 'home', 'cozy', 'comfort']
  },
  
  // ===== MORE BOYS ZONE PRODUCTS =====
  {
    id: '18',
    name: {
      en: 'Superhero Action Set',
      he: 'סט פעולה גיבור על',
      ar: 'طقم عمل البطل الخارق'
    },
    description: {
      en: 'Complete superhero outfit with cape and mask',
      he: 'תלבושת גיבור על שלמה עם גלימה ומסכה',
      ar: 'زي بطل خارق كامل مع عباءة وقناع'
    },
    price: 42.99,
    originalPrice: 55.99,
    brand: 'MARVEL KIDS',
    images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Captain Blue', he: 'כחול קפטן', ar: 'أزرق القبطان' }, hex: '#1E3A8A', images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Hero Red', he: 'אדום גיבור', ar: 'أحمر البطل' }, hex: '#DC2626', images: ['https://images.unsplash.com/photo-1519238441210-51ee96620e35?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '3-8 years',
    isSale: true,
    discount: 23,
    featured: true,
    stock: 13,
    tags: ['superhero', 'costume', 'play', 'active'],
    createdAt: '2025-07-18T16:01:07.980Z',
    isNew: true
  },
  {
    id: '19',
    name: {
      en: 'Adventure Hiking Boots',
      he: 'נעלי הליכה הרפתקה',
      ar: 'أحذية مشي المغامرة'
    },
    description: {
      en: 'Waterproof hiking boots for outdoor adventures',
      he: 'נעלי הליכה עמידות למים להרפתקאות בחוץ',
      ar: 'أحذية مشي مقاومة للماء للمغامرات الخارجية'
    },
    price: 55.99,
    brand: 'TIMBERLAND KIDS',
    images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Brown Leather', he: 'עור חום', ar: 'جلد بني' }, hex: '#8B4513', images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Black Outdoor', he: 'שחור חוץ', ar: 'أسود خارجي' }, hex: '#2C2C2C', images: ['https://images.unsplash.com/photo-1519238372446-f77f9da09d7a?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['10C', '11C', '12C', '13C', '1Y', '2Y', '3Y', '4Y'],
    category: 'boys',
    age: '4-10 years',
    isNew: true,
    featured: true,
    stock: 16,
    tags: ['outdoor', 'waterproof', 'durable', 'hiking'],
    createdAt: '2025-07-19T16:01:07.980Z',
    isSale: true
  },
  {
    id: '20',
    name: {
      en: 'Racing Car Pajama Set',
      he: 'סט פיג\'מה מכונית מירוץ',
      ar: 'طقم بيجامة سيارة السباق'
    },
    description: {
      en: 'Soft cotton pajama set with racing car prints',
      he: 'סט פיג\'מה כותנה רכה עם הדפסי מכוניות מירוץ',
      ar: 'طقم بيجامة قطني ناعم مع طبعات سيارات السباق'
    },
    price: 26.99,
    brand: 'CARTER\'S',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Racing Blue', he: 'כחול מירוץ', ar: 'أزرق السباق' }, hex: '#1E40AF', images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Speed Red', he: 'אדום מהירות', ar: 'أحمر السرعة' }, hex: '#EF4444', images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'boys',
    age: '2-8 years',
    tags: ['pajamas', 'sleepwear', 'cars', 'racing', 'cozy']
  },

  // ===== MORE GIRLS WORLD PRODUCTS =====
  {
    id: '21',
    name: {
      en: 'Ballerina Dreams Tutu',
      he: 'טוטו חלומות בלרינה',
      ar: 'توتو أحلام الباليه'
    },
    description: {
      en: 'Sparkly tulle tutu perfect for dance and dress-up',
      he: 'טוטו טול נוצץ מושלם לריקוד והתחפושת',
      ar: 'تنورة توتو متلألئة مثالية للرقص والتنكر'
    },
    price: 32.99,
    brand: 'CAPEZIO KIDS',
    images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Ballet Pink', he: 'ורוד בלט', ar: 'وردي الباليه' }, hex: '#F8BBD9', images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Swan White', he: 'לבן ברבור', ar: 'أبيض البجعة' }, hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Lavender Dream', he: 'חלום לבנדר', ar: 'حلم اللافندر' }, hex: '#E6E6FA', images: ['https://images.unsplash.com/photo-1519238441400-e5c4e8e5b153?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'girls',
    age: '2-8 years',
    featured: true,
    stock: 30,
    tags: ['dance', 'ballet', 'tutu', 'sparkly', 'dress-up'],
    createdAt: '2025-07-19T16:01:07.981Z',
    isNew: false,
    isSale: false
  },
  {
    id: '22',
    name: {
      en: 'Mermaid Tail Blanket',
      he: 'שמיכת זנב בת ים',
      ar: 'بطانية ذيل حورية البحر'
    },
    description: {
      en: 'Cozy mermaid tail blanket for magical snuggle time',
      he: 'שמיכת זנב בת ים נעימה לזמן חיבוק קסום',
      ar: 'بطانية ذيل حورية بحر مريحة لوقت عناق سحري'
    },
    price: 24.99,
    brand: 'POTTERY BARN KIDS',
    images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Ocean Teal', he: 'כחול ים', ar: 'تيل المحيط' }, hex: '#008B8B', images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Coral Pink', he: 'ורוד אלמוג', ar: 'وردي مرجاني' }, hex: '#FF7F7F', images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Purple Shimmer', he: 'סגול נוצץ', ar: 'بنفسجي لامع' }, hex: '#9370DB', images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['One Size'],
    category: 'girls',
    age: '3-10 years',
    isNew: true,
    stock: 27,
    tags: ['mermaid', 'blanket', 'cozy', 'magical', 'home'],
    createdAt: '2025-07-26T16:01:07.981Z',
    isSale: false
  },
  {
    id: '23',
    name: {
      en: 'Flower Crown Hair Set',
      he: 'סט שיער כתר פרחים',
      ar: 'طقم شعر تاج الزهور'
    },
    description: {
      en: 'Beautiful flower crown with matching hair accessories',
      he: 'כתר פרחים יפה עם אביזרי שיער תואמים',
      ar: 'تاج زهور جميل مع إكسسوارات شعر متطابقة'
    },
    price: 18.99,
    brand: 'CLAIRE\'S KIDS',
    images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Spring Meadow', he: 'אחו אביב', ar: 'مرج الربيع' }, hex: '#FFB6C1', images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Garden Bloom', he: 'פריחת גן', ar: 'ازدهار الحديقة' }, hex: '#FF69B4', images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['One Size'],
    category: 'girls',
    age: '3-10 years',
    tags: ['accessories', 'hair', 'flowers', 'crown', 'special']
  },

  // ===== MORE TINY TREASURES (BABY) PRODUCTS =====
  {
    id: '24',
    name: {
      en: 'Organic First Foods Bib Set',
      he: 'סט סינרים מזון ראשון אורגני',
      ar: 'طقم مراييل الطعام الأول العضوي'
    },
    description: {
      en: 'Set of 3 organic cotton bibs for messy meal times',
      he: 'סט של 3 סינרי כותנה אורגנית לזמני אכילה מבולגנים',
      ar: 'مجموعة من 3 مراييل قطنية عضوية لأوقات الوجبات الفوضوية'
    },
    price: 16.99,
    brand: 'BURT\'S BEES BABY',
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Natural Beige', he: 'בז\' טבעי', ar: 'بيج طبيعي' }, hex: '#F5F5DC', images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Soft Green', he: 'ירוק רך', ar: 'أخضر ناعم' }, hex: '#98FB98', images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['0-6M', '6-12M', '12-24M'],
    category: 'baby',
    age: '0-24 months',
    featured: true,
    stock: 28,
    tags: ['bibs', 'organic', 'feeding', 'safe', 'cotton'],
    createdAt: '2025-06-26T16:01:07.981Z',
    isNew: false,
    isSale: false
  },
  {
    id: '25',
    name: {
      en: 'Gentle Touch Swaddle Blankets',
      he: 'שמיכות עטיפה נגיעה עדינה',
      ar: 'بطانيات التقميط اللمسة اللطيفة'
    },
    description: {
      en: 'Ultra-soft bamboo swaddle blankets for peaceful sleep',
      he: 'שמיכות עטיפה במבוק רכות במיוחד לשינה שקטה',
      ar: 'بطانيات تقميط من الخيزران فائقة النعومة للنوم الهادئ'
    },
    price: 34.99,
    brand: 'ADEN + ANAIS',
    images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Cloud White', he: 'לבן ענן', ar: 'أبيض سحابي' }, hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Gentle Gray', he: 'אפור עדין', ar: 'رمادي لطيف' }, hex: '#D3D3D3', images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Soft Pink', he: 'ורוד רך', ar: 'وردي ناعم' }, hex: '#FFE4E1', images: ['https://images.unsplash.com/photo-1519238408550-e91a09d87767?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['47" x 47"'],
    category: 'baby',
    age: '0-6 months',
    isNew: true,
    tags: ['swaddle', 'bamboo', 'soft', 'sleep', 'safe']
  },

  // ===== MORE SMART DEALS (30%+ OFF) =====
  {
    id: '26',
    name: {
      en: 'Designer Winter Coat',
      he: 'מעיל חורף מעצב',
      ar: 'معطف شتوي مصمم'
    },
    description: {
      en: 'Premium down-filled winter coat with faux fur hood',
      he: 'מעיל חורף פרמיום עם מילוי פלומה וברדס דמוי פרווה',
      ar: 'معطف شتوي فاخר محشو بالريش مع قلنسوة فرو صناعي'
    },
    price: 49.99,
    originalPrice: 89.99,
    brand: 'NORTH FACE KIDS',
    images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Arctic Navy', he: 'כחול ארקטי', ar: 'كحلي قطبي' }, hex: '#1E3A8A', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Forest Green', he: 'ירוק יער', ar: 'أخضر غابة' }, hex: '#228B22', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    isSale: true,
    discount: 44,
    featured: true,
    stock: 30,
    tags: ['winter', 'coat', 'designer', 'warm', 'premium'],
    createdAt: '2025-07-08T16:01:07.981Z',
    isNew: false
  },
  {
    id: '27',
    name: {
      en: 'Celebrity Style Sunglasses',
      he: 'משקפי שמש בסגנון סלבריטי',
      ar: 'نظارات شمسية بأسلوب المشاهير'
    },
    description: {
      en: 'Trendy UV protection sunglasses for little fashionistas',
      he: 'משקפי שמש עם הגנת UV עבור fashionistas קטנות',
      ar: 'نظارات شمسية عصرية مع حماية UV لصغار الموضة'
    },
    price: 12.99,
    originalPrice: 19.99,
    brand: 'RAY-BAN JUNIOR',
    images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Cool Black', he: 'שחור מגניב', ar: 'أسود رائع' }, hex: '#000000', images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Hot Pink', he: 'ורוד לוהט', ar: 'وردي ساخن' }, hex: '#FF1493', images: ['https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['Ages 3-8'],
    category: 'unisex',
    age: '3-8 years',
    isSale: true,
    discount: 35,
    tags: ['sunglasses', 'UV protection', 'fashion', 'celebrity']
  },

  // ===== MORE COZY CORNER PRODUCTS =====
  {
    id: '28',
    name: {
      en: 'Teddy Bear Bathrobe',
      he: 'חלוק רחצה דובי',
      ar: 'رداء حمام الدب'
    },
    description: {
      en: 'Fluffy teddy bear bathrobe with ears and belt',
      he: 'חלוק רחצה דובי רך עם אוזניים וחגורה',
      ar: 'رداء حمام دب ناعم مع أذنين وحزام'
    },
    price: 29.99,
    brand: 'POTTERY BARN KIDS',
    images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Honey Bear', he: 'דוב דבש', ar: 'دب العسل' }, hex: '#DEB887', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Polar Bear', he: 'דוב קוטב', ar: 'دب قطبي' }, hex: '#FFFAFA', images: ['https://images.unsplash.com/photo-1519238319956-5c7844a441f1?w=800&auto=format&fit=crop&q=80'] },
    ],
    stock: 23,
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    featured: true,
    tags: ['bathrobe', 'teddy bear', 'cozy', 'home', 'bath']
  },

  // ===== MORE NEW DROPS PRODUCTS =====
  {
    id: '29',
    name: {
      en: 'Tech Smart Watch for Kids',
      he: 'שעון חכם טכנולוגי לילדים',
      ar: 'ساعة ذكية تقنية للأطفال'
    },
    description: {
      en: 'Educational smartwatch with games, camera, and parental controls',
      he: 'שעון חכם חינוכי עם משחקים, מצלמה ובקרת הורים',
      ar: 'ساعة ذكية تعليمية مع ألعاب وكاميرا ورقابة أبوية'
    },
    price: 79.99,
    brand: 'VTECH KIDIZOOM',
    images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Space Blue', he: 'כחול חלל', ar: 'أزرق فضائي' }, hex: '#4169E1', images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Galaxy Pink', he: 'ורוד גלקסיה', ar: 'وردي مجرة' }, hex: '#FF69B4', images: ['https://images.unsplash.com/photo-1558618047-0c3c630c7f10?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['Adjustable'],
    category: 'unisex',
    age: '4-12 years',
    isNew: true,
    featured: true,
    stock: 19,
    tags: ['smartwatch', 'technology', 'educational', 'games', 'camera'],
    createdAt: '2025-07-10T16:01:07.981Z',
    isSale: true
  },
  {
    id: '30',
    name: {
      en: 'Glow-in-Dark Space Pajamas',
      he: 'פיג\'מה זוהרת בחושך חלל',
      ar: 'بيجامة متوهجة في الظلام للفضاء'
    },
    description: {
      en: 'Cool space-themed pajamas that glow in the dark',
      he: 'פיג\'מה מגניבה בנושא חלל שזוהרת בחושך',
      ar: 'بيجامة رائعة بموضوع الفضاء تتوهج في الظلام'
    },
    price: 31.99,
    brand: 'CARTER\'S',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'],
    colors: [
      { name: { en: 'Cosmic Navy', he: 'כחול קוסמי', ar: 'كحلي كوني' }, hex: '#191970', images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'] },
      { name: { en: 'Galaxy Gray', he: 'אפור גלקסיה', ar: 'رمادي مجرة' }, hex: '#708090', images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'] },
    ],
    sizes: ['2T', '3T', '4T', '5', '6', '7', '8'],
    category: 'unisex',
    age: '2-8 years',
    isNew: true,
    stock: 24,
    tags: ['pajamas', 'glow-in-dark', 'space', 'sleepwear', 'cozy'],
    createdAt: '2025-07-04T16:01:07.981Z',
    isSale: true
  },
]
