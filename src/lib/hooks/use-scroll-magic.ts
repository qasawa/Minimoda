'use client'

import { useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function useScrollMagic() {
  const { scrollY, scrollYProgress } = useScroll()
  
  // Create smooth spring values for better performance
  const smoothScrollY = useSpring(scrollY, { damping: 50, stiffness: 300 })
  const smoothScrollProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 300 })
  
  // Parallax transforms
  const parallaxY = useTransform(smoothScrollY, [0, 1000], [0, -300])
  const parallaxYFast = useTransform(smoothScrollY, [0, 1000], [0, -500])
  const parallaxYSlow = useTransform(smoothScrollY, [0, 1000], [0, -100])
  
  // Scale transforms
  const scale = useTransform(smoothScrollProgress, [0, 0.5, 1], [1, 1.1, 1.2])
  const scaleDown = useTransform(smoothScrollProgress, [0, 1], [1, 0.8])
  
  // Opacity transforms
  const fadeIn = useTransform(smoothScrollProgress, [0, 0.3], [0, 1])
  const fadeOut = useTransform(smoothScrollProgress, [0.7, 1], [1, 0])
  
  // Rotation transforms for Web3 effects
  const rotate = useTransform(smoothScrollY, [0, 2000], [0, 360])
  const rotateReverse = useTransform(smoothScrollY, [0, 2000], [0, -360])
  
  // Color transforms for dynamic backgrounds
  const backgroundOpacity = useTransform(smoothScrollProgress, [0, 0.5, 1], [0.1, 0.3, 0.1])
  
  return {
    scrollY: smoothScrollY,
    scrollYProgress: smoothScrollProgress,
    parallaxY,
    parallaxYFast,
    parallaxYSlow,
    scale,
    scaleDown,
    fadeIn,
    fadeOut,
    rotate,
    rotateReverse,
    backgroundOpacity
  }
}

// Hook for element-specific scroll animations
export function useElementScrollMagic(threshold = 0.3) {
  const elementRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ['start end', 'end start']
  })
  
  const smoothProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 300 })
  
  // Transform values specific to this element
  const y = useTransform(smoothProgress, [0, 1], [100, -100])
  const opacity = useTransform(smoothProgress, [0, threshold, 1], [0, 1, 0])
  const scale = useTransform(smoothProgress, [0, threshold, 1], [0.8, 1, 1.2])
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360])
  
  return {
    ref: elementRef,
    progress: smoothProgress,
    y,
    opacity,
    scale,
    rotate
  }
}

// Hook for magnetic scroll effects (Web3 style)
export function useMagneticScroll() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { scrollY } = useScroll()
  
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 })
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 50
      const y = (e.clientY - window.innerHeight / 2) / 50
      mouseX.set(x)
      mouseY.set(y)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  // Combine mouse and scroll for complex interactions
  const magneticX = useTransform([smoothMouseX, scrollY], ([mx, sy]) => (mx as number) * (1 + (sy as number) / 1000))
  const magneticY = useTransform([smoothMouseY, scrollY], ([my, sy]) => (my as number) * (1 + (sy as number) / 1000))
  
  return {
    magneticX,
    magneticY,
    mouseX: smoothMouseX,
    mouseY: smoothMouseY
  }
}

// Hook for text reveal animations
export function useTextReveal() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.2']
  })
  
  const words = useMotionValue<string[]>([])
  
  const revealProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  
  return {
    ref: containerRef,
    revealProgress,
    words
  }
}

// Hook for 3D tilt effects based on scroll
export function useScrollTilt() {
  const { scrollYProgress } = useScroll()
  
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0])
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 0])
  
  return {
    style: {
      rotateX,
      rotateY,
      z,
      transformStyle: 'preserve-3d' as const
    }
  }
}

// Hook for morphing backgrounds based on scroll
export function useScrollMorph() {
  const { scrollYProgress } = useScroll()
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      'rgba(139, 92, 246, 0.1)',   // Purple
      'rgba(236, 72, 153, 0.1)',   // Pink  
      'rgba(59, 130, 246, 0.1)',   // Blue
      'rgba(16, 185, 129, 0.1)',   // Green
      'rgba(139, 92, 246, 0.1)'    // Back to purple
    ]
  )
  
  const borderRadius = useTransform(scrollYProgress, [0, 1], ['0px', '50px'])
  
  return {
    backgroundColor,
    borderRadius
  }
}
