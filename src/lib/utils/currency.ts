// Israeli New Shekel (ILS) currency utilities

export interface CurrencyConfig {
  code: 'ILS'
  symbol: '₪'
  name: {
    he: 'שקל חדש'
    ar: 'الشيكل الجديد'
    en: 'Israeli New Shekel'
  }
  decimals: 2
  symbolPosition: 'after' // ₪50.00
  thousandsSeparator: ','
  decimalSeparator: '.'
}

export const CURRENCY_CONFIG: CurrencyConfig = {
  code: 'ILS',
  symbol: '₪',
  name: {
    he: 'שקל חדש',
    ar: 'الشيكل الجديد',
    en: 'Israeli New Shekel'
  },
  decimals: 2,
  symbolPosition: 'after',
  thousandsSeparator: ',',
  decimalSeparator: '.'
}

/**
 * Format a number as ILS currency
 * @param amount - The amount to format
 * @param locale - The locale for formatting (he, ar, en)
 * @param options - Formatting options
 */
export function formatCurrency(
  amount: number,
  locale: 'he' | 'ar' | 'en' = 'he',
  options: {
    showSymbol?: boolean
    showDecimals?: boolean
    abbreviated?: boolean
  } = {}
): string {
  const {
    showSymbol = true,
    showDecimals = true,
    abbreviated = false
  } = options

  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? `${CURRENCY_CONFIG.symbol}0` : '0'
  }

  // For abbreviated format (e.g., 1.5K, 2.3M)
  if (abbreviated && amount >= 1000) {
    const formatAbbreviated = (num: number, suffix: string): string => {
      const formatted = (num / (suffix === 'K' ? 1000 : 1000000)).toFixed(1)
      return `${formatted}${suffix}`
    }

    if (amount >= 1000000) {
      const abbreviated = formatAbbreviated(amount, 'M')
      return showSymbol ? `${abbreviated}${CURRENCY_CONFIG.symbol}` : abbreviated
    } else if (amount >= 1000) {
      const abbreviated = formatAbbreviated(amount, 'K')
      return showSymbol ? `${abbreviated}${CURRENCY_CONFIG.symbol}` : abbreviated
    }
  }

  // Format number with thousands separators
  const formatNumber = (num: number): string => {
    const fixed = showDecimals ? num.toFixed(CURRENCY_CONFIG.decimals) : Math.floor(num).toString()
    const parts = fixed.split('.')
    
    // Add thousands separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, CURRENCY_CONFIG.thousandsSeparator)
    
    return parts.join(CURRENCY_CONFIG.decimalSeparator)
  }

  const formattedAmount = formatNumber(amount)

  if (!showSymbol) {
    return formattedAmount
  }

  // Position symbol based on locale and configuration
  if (locale === 'he' || locale === 'ar') {
    // For Hebrew and Arabic, put symbol after the number
    return `${formattedAmount}${CURRENCY_CONFIG.symbol}`
  } else {
    // For English, we still use the Israeli standard (symbol after)
    return `${formattedAmount}${CURRENCY_CONFIG.symbol}`
  }
}

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0
  
  // Remove currency symbol and separators
  const cleaned = currencyString
    .replace(CURRENCY_CONFIG.symbol, '')
    .replace(/[,\s]/g, '')
    .replace(CURRENCY_CONFIG.decimalSeparator, '.')
    .trim()
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Calculate price with VAT (Israeli VAT is 17%)
 * @param price - Base price without VAT
 * @param includeVat - Whether to include VAT in calculation
 */
export function calculatePriceWithVAT(price: number, includeVat: boolean = true): number {
  if (!includeVat) return price
  
  const VAT_RATE = 0.17 // 17% VAT in Israel
  return price * (1 + VAT_RATE)
}

/**
 * Calculate price without VAT
 * @param priceWithVat - Price including VAT
 */
export function calculatePriceWithoutVAT(priceWithVat: number): number {
  const VAT_RATE = 0.17 // 17% VAT in Israel
  return priceWithVat / (1 + VAT_RATE)
}

/**
 * Calculate discount amount and percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): {
  amount: number
  percentage: number
  formattedAmount: string
  formattedPercentage: string
} {
  const amount = originalPrice - discountedPrice
  const percentage = originalPrice > 0 ? (amount / originalPrice) * 100 : 0
  
  return {
    amount,
    percentage,
    formattedAmount: formatCurrency(amount),
    formattedPercentage: `${Math.round(percentage)}%`
  }
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param locale - Locale for formatting
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  locale: 'he' | 'ar' | 'en' = 'he'
): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, locale)
  }
  
  const min = formatCurrency(minPrice, locale)
  const max = formatCurrency(maxPrice, locale)
  
  const separator = locale === 'ar' ? ' - ' : ' - '
  return `${min}${separator}${max}`
}

/**
 * Check if amount qualifies for free shipping
 * @param amount - Order amount
 * @param freeShippingThreshold - Minimum amount for free shipping (default: 300 ILS)
 */
export function checkFreeShipping(amount: number, freeShippingThreshold: number = 300): {
  qualifies: boolean
  remaining: number
  formattedRemaining: string
} {
  const qualifies = amount >= freeShippingThreshold
  const remaining = qualifies ? 0 : freeShippingThreshold - amount
  
  return {
    qualifies,
    remaining,
    formattedRemaining: formatCurrency(remaining)
  }
}

/**
 * Calculate shipping cost based on order amount and location
 * @param orderAmount - Total order amount
 * @param location - Shipping location ('local' | 'nationwide' | 'international')
 * @param freeShippingThreshold - Minimum for free shipping
 */
export function calculateShippingCost(
  orderAmount: number,
  location: 'local' | 'nationwide' | 'international' = 'nationwide',
  freeShippingThreshold: number = 300
): number {
  // Free shipping over threshold
  if (orderAmount >= freeShippingThreshold) {
    return 0
  }
  
  // Shipping rates in ILS
  const shippingRates = {
    local: 20,      // Local delivery within major cities
    nationwide: 30,  // Nationwide shipping
    international: 80 // International shipping
  }
  
  return shippingRates[location]
}

/**
 * Format currency for display in different contexts
 */
export const CurrencyDisplay = {
  // For product cards
  product: (price: number, locale: 'he' | 'ar' | 'en' = 'he') => 
    formatCurrency(price, locale, { showDecimals: price % 1 !== 0 }),
  
  // For cart totals
  total: (price: number, locale: 'he' | 'ar' | 'en' = 'he') => 
    formatCurrency(price, locale, { showDecimals: true }),
  
  // For compact display
  compact: (price: number, locale: 'he' | 'ar' | 'en' = 'he') => 
    formatCurrency(price, locale, { showDecimals: false, abbreviated: true }),
  
  // For input fields (no symbol)
  input: (price: number) => 
    formatCurrency(price, 'he', { showSymbol: false, showDecimals: true }),
  
  // For sale badges
  savings: (originalPrice: number, salePrice: number, locale: 'he' | 'ar' | 'en' = 'he') => {
    const discount = calculateDiscount(originalPrice, salePrice)
    return {
      amount: formatCurrency(discount.amount, locale),
      percentage: discount.formattedPercentage
    }
  }
}

/**
 * Currency validation utilities
 */
export const CurrencyValidation = {
  // Validate if a string is a valid currency format
  isValidCurrency: (value: string): boolean => {
    const cleanValue = value.replace(/[₪,\s]/g, '')
    return /^\d+(\.\d{0,2})?$/.test(cleanValue)
  },
  
  // Validate if amount is within reasonable range
  isValidAmount: (amount: number): boolean => {
    return !isNaN(amount) && amount >= 0 && amount <= 100000 // Max 100K ILS
  },
  
  // Format user input to valid currency
  formatInput: (input: string): string => {
    // Remove non-numeric characters except decimal point
    const cleaned = input.replace(/[^\d.]/g, '')
    
    // Ensure only one decimal point
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2)
    }
    
    return cleaned
  }
}
