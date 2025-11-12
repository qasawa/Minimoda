'use client'

import { Product } from '@/lib/types'
import { MobileProductCard } from '@/components/ui/mobile-product-card'
import { OptimizedProductCard } from '@/components/ui/optimized-product-card'
import { useIsMobile } from '@/lib/hooks/use-media-query'

interface MobileProductsGridProps {
  products: Product[]
  locale: string
  className?: string
}

export function MobileProductsGrid({ 
  products, 
  locale, 
  className = '' 
}: MobileProductsGridProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 ${className}`}>
      {products.map((product, index) => 
        isMobile ? (
          <MobileProductCard
            key={product.id}
            product={product}
            locale={locale}
            priority={index < 4}
          />
        ) : (
          <OptimizedProductCard
            key={product.id}
            product={product}
            locale={locale}
            priority={index < 4}
          />
        )
      )}
    </div>
  )
}
