'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/lib/hooks/use-media-query'

interface MorphingTextProps {
  words: string[]
  className?: string
  interval?: number
  locale?: string
}

export function MorphingText({ 
  words, 
  className = '', 
  interval = 3000,
  locale = 'en' 
}: MorphingTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      // Typing animation
      const currentWord = words[currentWordIndex]
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1))
        }, 100)
      } else {
        // Word complete, wait then start erasing
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, interval)
      }
    } else {
      // Erasing animation
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 50)
      } else {
        // Move to next word
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isTyping, currentWordIndex, words, interval])

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        className="inline-block"
        style={{
          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                     locale === 'he' ? 'var(--font-rubik)' : 
                     'inherit',
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {displayedText}
        <motion.span
          className="inline-block w-0.5 h-6 bg-current ml-1"
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.span>

      {/* Holographic glow effect */}
      <motion.div
        className="absolute inset-0 blur-lg opacity-30"
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          scale: [1, 1.05, 1]
        }}
        transition={{
          backgroundPosition: {
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    </div>
  )
}

// Enhanced version with split text animation
interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  locale?: string
}

export function SplitText({ text, className = '', delay = 0, locale = 'en' }: SplitTextProps) {
  const reducedMotion = useReducedMotion()
  const letters = text.split('')
  
  // Simplified version for reduced motion
  if (reducedMotion) {
    return (
      <div className={`inline-block ${className}`}>
        <span
          style={{
            fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                       locale === 'he' ? 'var(--font-rubik)' : 
                       'inherit'
          }}
        >
          {text}
        </span>
      </div>
    )
  }

  return (
    <div className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={{
            fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                       locale === 'he' ? 'var(--font-rubik)' : 
                       'inherit'
          }}
          initial={{ 
            opacity: 0, 
            y: 20,
            rotateX: 90
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0
          }}
          transition={{
            duration: 0.5,
            delay: delay + (index * 0.05),
            type: "spring",
            stiffness: 100
          }}
          whileHover={{
            scale: 1.2,
            color: '#8b5cf6',
            textShadow: '0 0 8px rgba(139, 92, 246, 0.5)'
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  )
}

// Glitch text effect for Web3 aesthetic
interface GlitchTextProps {
  text: string
  className?: string
  locale?: string
}

export function GlitchText({ text, className = '', locale = 'en' }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main text */}
      <motion.span
        className="relative z-10 inline-block"
        style={{
          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                     locale === 'he' ? 'var(--font-rubik)' : 
                     'inherit'
        }}
      >
        {text}
      </motion.span>

      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 text-red-500 opacity-70"
        style={{
          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                     locale === 'he' ? 'var(--font-rubik)' : 
                     'inherit'
        }}
        animate={{
          x: [-2, 2, -1, 1, 0],
          y: [0, -1, 1, 0, -1]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute top-0 left-0 text-blue-500 opacity-70"
        style={{
          fontFamily: locale === 'ar' ? 'var(--font-tajawal)' : 
                     locale === 'he' ? 'var(--font-rubik)' : 
                     'inherit'
        }}
        animate={{
          x: [2, -2, 1, -1, 0],
          y: [1, 0, -1, 1, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.1
        }}
      >
        {text}
      </motion.span>
    </div>
  )
}
