'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { BaseProps } from '@/lib/types'

type HeroEditorialProps = BaseProps

interface HeroSlide {
  id: string
  image: string
  alt: string
  link: string
  theme: 'light' | 'dark'
}

const heroSlides: HeroSlide[] = [
  {
    id: 'spring-editorial',
    image: 'https://images.unsplash.com/photo-1544717822-b888dbb56d9d?w=1920&auto=format&fit=crop&q=80',
    alt: 'Spring Collection Editorial',
    link: '/spring-collection',
    theme: 'light'
  },
  {
    id: 'comfort-editorial',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1920&auto=format&fit=crop&q=80',
    alt: 'Comfort Essentials',
    link: '/comfort-collection',
    theme: 'light'
  },
  {
    id: 'winter-editorial',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&auto=format&fit=crop&q=80',
    alt: 'Winter Collection',
    link: '/winter-collection',
    theme: 'light'
  }
]

export function HeroEditorial({ locale, dictionary }: HeroEditorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.3 })
  
  const currentSlideData = heroSlides[currentSlide]

  // Auto-cycle through slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-white">
      {/* Full-width editorial image without text overlay */}
      <div className="absolute inset-0">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns effect - subtle zoom and pan */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.05],
              x: [0, -10],
              y: [0, -5]
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Image
              src={currentSlideData.image}
              alt={currentSlideData.alt}
              fill
              className="object-cover"
              priority
              quality={95}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Minimal gradient overlay for depth (very subtle) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {/* Bottom section with minimal link */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="container mx-auto px-6 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link 
                href={`/${locale}${currentSlideData.link}`}
                className="inline-flex items-center text-sm font-nav text-charcoal-800 hover:text-sage-600 transition-colors duration-300 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-neutral-200 hover:border-sage-300"
              >
                <span>SHOP THE EDIT</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Minimal slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-charcoal-800 w-6' 
                  : 'bg-charcoal-400 hover:bg-charcoal-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}