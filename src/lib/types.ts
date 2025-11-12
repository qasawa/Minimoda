export type Locale = 'en' | 'he' | 'ar'

export interface LocalizedText {
  en: string
  he: string
  ar: string
}

export interface Dictionary {
  [key: string]: string | Dictionary
}

export interface BaseProps {
  locale: Locale
  dictionary: Dictionary
}

export interface Product {
  id: string
  name: LocalizedText
  description: LocalizedText
  price: number
  originalPrice?: number
  images: string[]
  colors: {
    name: LocalizedText
    hex: string
    images: string[]
  }[]
  sizes: string[]
  category: 'boys' | 'girls' | 'baby' | 'unisex'
  age: string
  brand?: string
  isNew?: boolean
  isSale?: boolean
  featured?: boolean
  discount?: number
  stock?: number
  tags?: string[]
  createdAt?: string
  // Maisonette-specific status properties
  isExclusive?: boolean
  isMostWished?: boolean
  isSellingFast?: boolean
  isJustIn?: boolean
  
  // Kids-specific enhancements
  ageRange?: {
    min: number // months
    max: number // months
    developmentStage?: 'newborn' | 'infant' | 'toddler' | 'preschool' | 'school-age'
  }
  fitGuide?: {
    runsLarge?: boolean
    runsSmall?: boolean
    trueToSize?: boolean
    stretchable?: boolean
    growthFriendly?: boolean
    expectedWearMonths?: number
  }
  safetyFeatures?: {
    chokeHazardFree?: boolean
    hypoallergenic?: boolean
    organicMaterials?: boolean
    fireRetardant?: boolean
    softSeams?: boolean
    tearResistant?: boolean
  }
  careInstructions?: {
    washTemp?: 'cold' | 'warm' | 'hot'
    tumbleDry?: boolean
    ironSafe?: boolean
    delicateOnly?: boolean
    colorFast?: boolean
    shrinkResistant?: boolean
    stainResistant?: boolean
  }
  durabilityScore?: number // 1-10 scale
  comfortRating?: number // 1-10 scale
  parentReviews?: {
    fitAccuracy?: number // 1-5 stars
    durability?: number // 1-5 stars
    easeOfCare?: number // 1-5 stars
    valueForMoney?: number // 1-5 stars
    overallRating?: number // 1-5 stars
    totalReviews?: number
  }
  bundleOptions?: {
    completeOutfit?: string[] // Product IDs for outfit completion
    coordinating?: string[] // Matching/coordinating items
    sizeUp?: string // Same item in next size up
  }
  seasonality?: {
    spring?: boolean
    summer?: boolean
    fall?: boolean
    winter?: boolean
    indoor?: boolean
    outdoor?: boolean
  }
}

export interface CartItem {
  id: string
  name: LocalizedText
  price: number
  image: string
  color: {
    name: LocalizedText
    hex: string
  }
  size: string
  quantity: number
}

export interface FilterState {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  sortBy: string
}

// Order Management Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  size: string
  color_index: number
  image?: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: {
    street: string
    city: string
    postal_code?: string
    country: string
    apartment?: string
    floor?: string
    instructions?: string
  }
  billing_address?: any
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_method: string
  payment_status: PaymentStatus
  order_status: OrderStatus
  tracking_number?: string
  estimated_delivery?: string
  actual_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Inventory Types
export interface InventoryItem {
  id: string
  product_id: string
  size: string
  color_index: number
  stock_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  last_updated: string
  last_restocked?: string
  cost_per_unit: number
}

// Admin Types
export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'staff'
  permissions: string[]
  name: string
  avatar?: string
  lastLogin?: string
  isActive: boolean
  createdAt: string
}
