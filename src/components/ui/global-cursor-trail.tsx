'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile, useReducedMotion } from '@/lib/hooks/use-media-query'

export function GlobalCursorTrail() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Don't set up event listeners on mobile devices or when reduced motion is preferred
    if (isMobile || reducedMotion) {
      return
    }
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('clickable')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('a') && !target.closest('button') && !target.classList.contains('clickable')) {
        setIsHovering(false)
      }
    }

    // Add global mouse tracking
    window.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [isMobile, reducedMotion])

  // Don't render cursor trail on mobile devices or when reduced motion is preferred
  if (isMobile || reducedMotion) {
    return null
  }

  return (
    <>
      {/* Main Cursor Trail - Beautiful Web3 Style */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: 0.8,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      >
        {/* Outer Glow Ring */}
        <motion.div
          className="absolute inset-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 blur-md"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: 360 
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400/60 to-pink-400/60 backdrop-blur-sm"
          animate={{ 
            scale: isHovering ? [1, 1.3, 1] : [1, 1.1, 1],
            rotate: -360 
          }}
          transition={{ 
            scale: { duration: 1.5, repeat: Infinity },
            rotate: { duration: 6, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Inner Core */}
        <motion.div
          className="absolute inset-3 w-4 h-4 rounded-full bg-gradient-to-r from-white/80 to-purple-200/80"
          animate={{ 
            scale: isHovering ? [1, 1.4, 1] : [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity
          }}
        />
      </motion.div>

      {/* Trailing Particles */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            animate={{
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </>
  )
}
