'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ProductCardMinimal } from '@/components/ui/product-card-minimal'
import type { Product } from '@/lib/types'
import type { BaseProps } from '@/lib/types'

interface NewArrivalsMinimalProps extends BaseProps {
  products: Product[]
}

export function NewArrivalsMinimal({ products, locale, dictionary }: NewArrivalsMinimalProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  // Get 6-8 products for the grid
  const displayProducts = products.slice(0, 8)

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-heading font-light text-charcoal-800 mb-4">
            New Arrivals
          </h2>
          <p className="text-neutral-500 font-body max-w-md mx-auto">
            Fresh styles for the season&apos;s most treasured moments
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCardMinimal
                product={product}
                locale={locale}
                dictionary={dictionary}
                priority={index < 4}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href={`/${locale}/new`}
            className="inline-flex items-center font-nav text-charcoal-700 hover:text-charcoal-800 transition-colors duration-200 border-b border-neutral-300 hover:border-charcoal-600 pb-1"
          >
            <span>VIEW ALL NEW ARRIVALS</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
