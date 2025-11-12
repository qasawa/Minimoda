'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getDictionary } from '@/lib/utils/getDictionary'
import type { Locale, Dictionary } from '@/lib/types'

export default function NotFound() {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDictionary)
  }, [locale])

  if (!dictionary) return null

  const balloonColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#38BDF8']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 to-white">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* 404 Text */}
            <motion.h1
              className="text-8xl sm:text-9xl font-bold text-gray-200"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              404
            </motion.h1>
            
            {/* Floating Balloons */}
            {balloonColors.map((color, index) => (
              <motion.div
                key={index}
                className="absolute w-8 h-10"
                style={{
                  left: `${20 + index * 20}%`,
                  bottom: '50%',
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [0, index % 2 === 0 ? 10 : -10, 0],
                  rotate: [0, index % 2 === 0 ? 10 : -10, 0],
                }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              >
                {/* Balloon */}
                <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="16" cy="16" rx="16" ry="20" fill={color} />
                  <path d="M16 36 L14 42 L18 42 Z" fill={color} />
                  <ellipse cx="12" cy="12" rx="4" ry="6" fill="white" fillOpacity="0.3" />
                </svg>
                
                {/* String */}
                <svg
                  className="absolute top-full left-1/2 -translate-x-1/2"
                  width="2"
                  height="60"
                  viewBox="0 0 2 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 0 Q1 30 1 60" stroke={color} strokeWidth="1" />
                </svg>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {(dictionary['404'] as any)?.title || 'Page Not Found'}
          </h2>
          <p className="text-gray-600">
            {(dictionary['404'] as any)?.subtitle || 'The page you are looking for does not exist.'}
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Link href={`/${locale}`}>
              <Button size="lg">
                {(dictionary['404'] as any)?.button || 'Go Home'}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-coral-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-10, 10, -10],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
