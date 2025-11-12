'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { MorphingText, SplitText } from '@/components/ui/morphing-text'
import { Web3Background } from '@/components/ui/web3-background'
import type { BaseProps } from '@/lib/types'

type HeroMaisonetteProps = BaseProps

export function HeroMaisonette({ locale }: HeroMaisonetteProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  // Web3-inspired mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('.hero-container')?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / 20
        const y = (e.clientY - rect.top - rect.height / 2) / 20
        mouseX.set(x)
        mouseY.set(y)
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={ref}
      className="hero-container relative h-[500px] lg:h-[600px] overflow-hidden"
    >
      {/* Revolutionary Web3 Background Layer System */}
      <Web3Background variant="dynamic" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/25 to-pink-900/30" />
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/15 via-transparent to-orange-500/15" />
      
      {/* Holographic Mesh Grid */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
        animate={{
          x: [-30, 30, -30],
          y: [-30, 30, -30],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Enhanced Noise Texture with Grain */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)
          `
        }}
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Liquid Gradient Morphing Background */}
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 600px 800px at 100% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 700px 500px at 0% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)
          `
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Hero Image */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <Image
          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&auto=format&fit=crop&q=90"
          alt="Beautiful children in stylish fashion"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </motion.div>

      {/* Hero Overlay Content */}
      <motion.div
        className="relative z-10 h-full flex items-center px-4"
        style={{ opacity }}
      >
        <div className="container mx-auto">
          <div className="max-w-2xl">
            {/* Main Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <motion.h1 
                className="font-serif text-4xl lg:text-6xl font-light text-white mb-2 leading-tight hero-heading magnetic web3-element"
                style={{ 
                  fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                             locale === 'he' ? 'var(--font-rubik)' : 
                             'inherit',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)'
                }}
                data-magnetic="true"
                whileHover={{
                  scale: 1.02,
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(139, 92, 246, 0.4)',
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: 'linear-gradient(45deg, #ffffff, #8b5cf6, #ec4899, #ffffff)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {locale === 'ar' ? 'حيث يلتقي الخيال بالراحة' :
                   locale === 'he' ? 'כאשר הדמיון פוגש נוחות' :
                   'Where Imagination Meets Comfort'}
                </motion.span>
              </motion.h1>
              <MorphingText
                words={
                  locale === 'ar' ? ['100% طبيعي', 'إرجاع مجاني', 'معتمد من الوالدين', 'جودة فائقة'] :
                  locale === 'he' ? ['100% טבעי', 'החזרה חינם', 'מאושר הורים', 'איכות מעולה'] :
                  ['100% Organic', 'Free Returns', 'Parent-Approved', 'Premium Quality']
                }
                className="text-2xl lg:text-3xl text-white font-light mb-4 block"
                interval={3000}
                locale={locale}
              />
              <p 
                className="text-lg text-white/90 font-light tracking-wide mb-8"
                style={{ 
                  fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                             locale === 'he' ? 'var(--font-rubik)' : 
                             'inherit' 
                }}
              >
                {locale === 'ar' ? 'ملابس تنمو مع أطفالكم وتحتضن أحلامهم 🌟' :
                 locale === 'he' ? 'בגדים שגדלים עם הילדים ומחבקים את החלומות שלהם 🌟' :
                 'Clothes that grow with your kids and embrace their dreams 🌟'}
              </p>
            </motion.div>

            {/* Web3-inspired CTA Button with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                {/* Magnetic button background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <Link
                  href={`/${locale}/sale`}
                  className="relative inline-block bg-white/95 backdrop-blur-sm text-maisonette-blue-800 px-10 py-4 text-sm font-medium tracking-wider
                    hover:bg-white transition-all duration-300 shadow-lg hover:shadow-2xl
                    border border-white/30 uppercase rounded-full overflow-hidden group hero-cta glow-element web3-element"
                  style={{ 
                    fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                               locale === 'he' ? 'var(--font-rubik)' : 
                               'inherit' 
                  }}
                  data-magnetic="true"
                >
                  {/* Button shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 0.8 }}
                  />
                  
                  {/* Button content */}
                  <span className="relative z-10 flex items-center gap-2">
                    {locale === 'ar' ? 'اكتشف السحر' :
                     locale === 'he' ? 'גלה את הקסם' :
                     'Discover Magic'}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Trust Badges - Revolutionary Parent Psychology */}
      <motion.div 
        className="absolute bottom-8 left-4 lg:left-8 flex flex-wrap gap-3 z-20"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {/* Organic Badge */}
        <motion.div
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/30"
          whileHover={{ scale: 1.05, y: -2 }}
          animate={{ 
            boxShadow: [
              '0 4px 20px rgba(34, 197, 94, 0.2)',
              '0 6px 30px rgba(34, 197, 94, 0.3)',
              '0 4px 20px rgba(34, 197, 94, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span 
            className="text-green-500 text-sm"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🌱
          </motion.span>
          <span className="text-xs font-medium text-green-700">
            {locale === 'ar' ? '100% طبيعي' :
             locale === 'he' ? '100% טבעי' : 
             '100% Organic'}
          </span>
        </motion.div>

        {/* Free Returns Badge */}
        <motion.div
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/30"
          whileHover={{ scale: 1.05, y: -2 }}
          animate={{ 
            boxShadow: [
              '0 4px 20px rgba(59, 130, 246, 0.2)',
              '0 6px 30px rgba(59, 130, 246, 0.3)',
              '0 4px 20px rgba(59, 130, 246, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <motion.span 
            className="text-blue-500 text-sm"
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🔄
          </motion.span>
          <span className="text-xs font-medium text-blue-700">
            {locale === 'ar' ? 'إرجاع مجاني' :
             locale === 'he' ? 'החזרה חינם' : 
             'Free Returns'}
          </span>
        </motion.div>

        {/* Parent Approved Badge */}
        <motion.div
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/30"
          whileHover={{ scale: 1.05, y: -2 }}
          animate={{ 
            boxShadow: [
              '0 4px 20px rgba(236, 72, 153, 0.2)',
              '0 6px 30px rgba(236, 72, 153, 0.3)',
              '0 4px 20px rgba(236, 72, 153, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <motion.span 
            className="text-pink-500 text-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            👨‍👩‍👧‍👦
          </motion.span>
          <span className="text-xs font-medium text-pink-700">
            {locale === 'ar' ? 'معتمد من الوالدين' :
             locale === 'he' ? 'מאושר הורים' : 
             'Parent-Approved'}
          </span>
        </motion.div>
      </motion.div>

      {/* Revolutionary Web3 Floating Elements - Enhanced Interactive */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 backdrop-blur-md border border-white/30 floating-element web3-element"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 15, 0],
          boxShadow: [
            '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
            '0 0 50px rgba(236, 72, 153, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.2)',
            '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        data-magnetic="true"
      >
        {/* Inner holographic core */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          animate={{
            rotate: [0, -360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-16 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400/30 to-teal-400/30 backdrop-blur-md border border-white/40 floating-element web3-element"
        style={{
          x: useTransform(mouseXSpring, [0, 1], [0, -0.5]),
          y: useTransform(mouseYSpring, [0, 1], [0, -0.8]),
          boxShadow: '0 0 25px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.1)'
        }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, -20, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        data-magnetic="true"
      >
        {/* Pulsing inner light */}
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-300/30"
          animate={{
            scale: [0.7, 1.1, 0.7],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-sm border border-white/20"
        style={{
          x: useTransform(mouseXSpring, [0, 1], [0, 0.8]),
          y: useTransform(mouseYSpring, [0, 1], [0, 0.6]),
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 20, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Additional Web3 elements */}
      <motion.div
        className="absolute top-32 right-32 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 backdrop-blur-sm"
        style={{
          x: useTransform(mouseXSpring, [0, 1], [0, 1.2]),
          y: useTransform(mouseYSpring, [0, 1], [0, -1]),
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-32 w-6 h-6 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30 backdrop-blur-sm"
        style={{
          x: useTransform(mouseXSpring, [0, 1], [0, -0.8]),
          y: useTransform(mouseYSpring, [0, 1], [0, 1.2]),
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </section>
  )
}
