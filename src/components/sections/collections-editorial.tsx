'use client'


import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { BaseProps } from '@/lib/types'

type CollectionsEditorialProps = BaseProps

interface Collection {
  id: string
  name: {
    he: string
    ar: string
    en: string
  }
  image: string
  href: string
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

const collections: Collection[] = [
  {
    id: 'girls-collection',
    name: { he: 'בנות', ar: 'بنات', en: 'Girl' },
    image: 'https://images.unsplash.com/photo-1544717822-b888dbb56d9d?w=800&auto=format&fit=crop&q=80',
    href: '/girls',
    aspectRatio: 'portrait'
  },
  {
    id: 'boys-collection', 
    name: { he: 'בנים', ar: 'أولاد', en: 'Boy' },
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80',
    href: '/boys',
    aspectRatio: 'portrait'
  },
  {
    id: 'baby-collection',
    name: { he: 'תינוקות', ar: 'أطفال', en: 'Baby' },
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    href: '/baby',
    aspectRatio: 'portrait'
  },
  {
    id: 'new-arrivals',
    name: { he: 'חדש', ar: 'جديد', en: 'New Arrivals' },
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80',
    href: '/new',
    aspectRatio: 'landscape'
  }
]

export function CollectionsEditorial({ locale, dictionary }: CollectionsEditorialProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square'
      case 'portrait': return 'aspect-[3/4]'
      case 'landscape': return 'aspect-[4/3]'
      default: return 'aspect-[3/4]'
    }
  }

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
            Shop by Category
          </h2>
          <p className="text-neutral-500 font-body max-w-md mx-auto">
            Curated collections for every stage of childhood
          </p>
        </motion.div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`group relative overflow-hidden ${
                collection.aspectRatio === 'landscape' ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <Link href={`/${locale}${collection.href}`}>
                
                {/* Image Container */}
                <div className={`relative ${getAspectRatioClass(collection.aspectRatio)} overflow-hidden bg-neutral-100`}>
                  <Image
                    src={collection.image}
                    alt={collection.name[locale as keyof typeof collection.name]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                {/* Category Name - Below image */}
                <div className="pt-4 text-center">
                  <h3 className="font-nav text-charcoal-700 group-hover:text-charcoal-800 transition-colors duration-200">
                    {collection.name[locale as keyof typeof collection.name]}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
