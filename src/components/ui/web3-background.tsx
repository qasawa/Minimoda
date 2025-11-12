'use client'

import { motion } from 'framer-motion'
import { useIsMobile, useReducedMotion, useIsLowPerformanceDevice } from '@/lib/hooks/use-media-query'

interface Web3BackgroundProps {
  variant?: 'subtle' | 'dynamic' | 'intense'
  className?: string
}

export function Web3Background({ variant = 'subtle', className = '' }: Web3BackgroundProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const isLowPerformance = useIsLowPerformanceDevice()
  
  // Disable heavy animations on mobile or low-performance devices
  const shouldReduceAnimations = isMobile || reducedMotion || isLowPerformance
  
  const intensity = {
    subtle: { 
      opacity: shouldReduceAnimations ? 0.05 : 0.15, 
      scale: shouldReduceAnimations ? 0.5 : 0.8, 
      duration: shouldReduceAnimations ? 20 : 12 
    },
    dynamic: { 
      opacity: shouldReduceAnimations ? 0.08 : 0.25, 
      scale: shouldReduceAnimations ? 0.7 : 1, 
      duration: shouldReduceAnimations ? 16 : 8 
    },
    intense: { 
      opacity: shouldReduceAnimations ? 0.1 : 0.35, 
      scale: shouldReduceAnimations ? 0.8 : 1.2, 
      duration: shouldReduceAnimations ? 12 : 6 
    }
  }

  const config = intensity[variant]
  
  // Completely disable on very low performance devices
  if (reducedMotion || (isMobile && isLowPerformance)) {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Static background for accessibility/low-performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/20" />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-full blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [config.scale, config.scale * 1.1, config.scale * 0.9, config.scale],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}

      />

      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/30 via-teal-500/30 to-emerald-500/30 rounded-full blur-3xl"
        style={{ top: '60%', right: '15%' }}
        animate={{
          x: [0, -80, 120, 0],
          y: [0, 90, -40, 0],
          scale: [config.scale, config.scale * 0.8, config.scale * 1.2, config.scale],
          rotate: [360, 240, 120, 0],
        }}
        transition={{
          duration: config.duration * 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}

      />

      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-full blur-3xl"
        style={{ top: '30%', right: '40%' }}
        animate={{
          x: [0, 60, -90, 0],
          y: [0, -60, 80, 0],
          scale: [config.scale * 0.7, config.scale, config.scale * 0.8, config.scale * 0.7],
          rotate: [0, 180, 270, 360],
        }}
        transition={{
          duration: config.duration * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}

      />

      {/* Enhanced Particle Grid with Noise - Reduced count for mobile */}
      <div className="absolute inset-0">
        {Array.from({ length: shouldReduceAnimations ? 8 : 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: shouldReduceAnimations ? 'blur(0.25px)' : 'blur(0.5px)',
              boxShadow: shouldReduceAnimations ? 'none' : '0 0 4px rgba(139, 92, 246, 0.6)'
            }}
            animate={{
              opacity: [0, config.opacity * 3, 0],
              scale: [0, shouldReduceAnimations ? 1 : 1.5, 0],
              y: [0, shouldReduceAnimations ? -15 : -30, 0],
              x: [0, shouldReduceAnimations ? Math.random() * 10 - 5 : Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: shouldReduceAnimations ? 6 + Math.random() * 4 : 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
          `,
          backgroundSize: '256px 256px'
        }}
      />

      {/* Holographic Scan Lines */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.1) 2px, rgba(139, 92, 246, 0.1) 4px)',
        }}
        animate={{
          y: [-20, 20, -20]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Mesh Gradients */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"
        animate={{
          backgroundPosition: ['50% 0%', '50% 100%', '50% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  )
}
