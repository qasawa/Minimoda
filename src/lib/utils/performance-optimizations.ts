'use client'

import { useEffect, useState } from 'react'

// Performance monitoring and optimization utilities
export class PerformanceOptimizer {
  private static metrics: {
    renderCount: number
    animationCount: number
    lastRenderTime: number
  } = {
    renderCount: 0,
    animationCount: 0,
    lastRenderTime: performance.now()
  }

  // Track component renders for performance monitoring
  static trackRender(componentName: string) {
    this.metrics.renderCount++
    const now = performance.now()
    const timeSinceLastRender = now - this.metrics.lastRenderTime
    
    if (timeSinceLastRender < 16) { // Less than 60fps
      console.warn(`Performance: ${componentName} rendered too frequently (${timeSinceLastRender.toFixed(2)}ms since last render)`)
    }
    
    this.metrics.lastRenderTime = now
  }

  // Get performance recommendations
  static getRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (this.metrics.animationCount > 10) {
      recommendations.push('Consider reducing the number of simultaneous animations')
    }
    
    if (this.metrics.renderCount > 1000) {
      recommendations.push('High render count detected - check for unnecessary re-renders')
    }
    
    return recommendations
  }

  // Reset metrics
  static reset() {
    this.metrics = {
      renderCount: 0,
      animationCount: 0,
      lastRenderTime: performance.now()
    }
  }
}

// Hook to check if device supports smooth animations
export function useAnimationCapability() {
  const [hasGoodPerformance, setHasGoodPerformance] = useState(true)
  
  useEffect(() => {
    // Check frame rate over time
    let frameCount = 0
    let lastTime = performance.now()
    let animationFrame: number
    
    const checkFrameRate = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        // Consider performance poor if consistently under 30fps
        if (fps < 30) {
          setHasGoodPerformance(false)
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationFrame = requestAnimationFrame(checkFrameRate)
    }
    
    animationFrame = requestAnimationFrame(checkFrameRate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])
  
  return hasGoodPerformance
}

// Hook for intersection observer with performance optimization
export function useOptimizedIntersectionObserver(
  threshold = 0.1,
  rootMargin = '50px'
) {
  const [isVisible, setIsVisible] = useState(false)
  const [element, setElement] = useState<Element | null>(null)
  
  useEffect(() => {
    if (!element) return
    
    // Use a single intersection observer instance when possible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin
      }
    )
    
    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
    }
  }, [element, threshold, rootMargin])
  
  return [setElement, isVisible] as const
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number
    total: number
    percentage: number
  } | null>(null)
  
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const used = memory.usedJSHeapSize / 1024 / 1024 // MB
        const total = memory.totalJSHeapSize / 1024 / 1024 // MB
        const percentage = (used / total) * 100
        
        setMemoryUsage({
          used: Math.round(used),
          total: Math.round(total),
          percentage: Math.round(percentage)
        })
        
        // Warn if memory usage is high
        if (percentage > 80) {
          console.warn(`High memory usage: ${percentage.toFixed(1)}% (${used.toFixed(1)}MB / ${total.toFixed(1)}MB)`)
        }
      }
    }
    
    // Check memory usage every 5 seconds
    const interval = setInterval(checkMemory, 5000)
    checkMemory() // Initial check
    
    return () => clearInterval(interval)
  }, [])
  
  return memoryUsage
}

// Debounced resize observer for performance
export function useOptimizedResize(callback: () => void, delay = 100) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [callback, delay])
}
