import React, { useCallback, useEffect, useRef, useState } from 'react'

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Animation capability hook - returns false on mobile for performance
export function useAnimationCapability() {
  const isMobile = useIsMobile()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Disable all animations on mobile or when reduced motion is preferred
  return !isMobile && !reducedMotion
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState<Element | null>(null)

  const ref = useCallback((node: Element | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, options])

  return [ref, isIntersecting]
}

// Virtual scroll hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index
  }))

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

// Image lazy loading with blur placeholder
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [ref, isIntersecting] = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting && src && !isLoaded && !isError) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      
      img.onerror = () => {
        setIsError(true)
      }
      
      img.src = src
    }
  }, [isIntersecting, src, isLoaded, isError])

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    isIntersecting
  }
}

// Memoization utilities
export class MemoCache {
  private static cache = new Map<string, { value: any; timestamp: number; ttl: number }>()

  static set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.value
  }

  static clear(): void {
    this.cache.clear()
  }

  static delete(key: string): void {
    this.cache.delete(key)
  }

  static has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key)
  }

  private static isExpired(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return true
    return Date.now() - cached.timestamp > cached.ttl
  }
}

// Async data fetching with cache
export function useCachedAsyncData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    refreshInterval?: number
    enabled?: boolean
  } = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    refreshInterval,
    enabled = true
  } = options

  const [data, setData] = useState<T | null>(MemoCache.get<T>(key))
  const [isLoading, setIsLoading] = useState(!data && enabled)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setIsLoading(true)
      setError(null)
      
      const result = await fetcher()
      
      MemoCache.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher, ttl, enabled])

  useEffect(() => {
    if (!data && enabled) {
      fetchData()
    }
  }, [data, enabled, fetchData])

  useEffect(() => {
    if (refreshInterval && enabled) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, enabled, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}

// Bundle size optimization utilities
export const LazyComponents = {
  // Lazy load heavy components
  loadComponent: <T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ) => {
    return React.lazy(factory)
  },

  // Preload component for better UX
  preloadComponent: <T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ) => {
    const componentPromise = factory()
    return React.lazy(() => componentPromise)
  }
}

// Critical CSS detection
export function useCriticalCSS() {
  const [criticalStyles, setCriticalStyles] = useState<string>('')

  useEffect(() => {
    // Extract critical styles from above-the-fold content
    const extractCriticalCSS = () => {
      const styleSheets = Array.from(document.styleSheets)
      const usedStyles: string[] = []

      // Get all elements in viewport
      const viewportElements = document.querySelectorAll('*')
      
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || [])
          
          rules.forEach(rule => {
            if (rule instanceof CSSStyleRule) {
              // Check if rule applies to any viewport element
              const hasMatchingElement = Array.from(viewportElements).some(
                el => el.matches(rule.selectorText)
              )
              
              if (hasMatchingElement) {
                usedStyles.push(rule.cssText)
              }
            }
          })
        } catch (e) {
          // Cross-origin stylesheet access might fail
          console.warn('Cannot access stylesheet:', e)
        }
      })

      return usedStyles.join('\n')
    }

    setCriticalStyles(extractCriticalCSS())
  }, [])

  return criticalStyles
}

// Resource preloading
export class ResourcePreloader {
  private static preloadedResources = new Set<string>()

  static preloadImage(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  static preloadImages(sources: string[]): Promise<void[]> {
    return Promise.all(sources.map(src => this.preloadImage(src)))
  }

  static preloadFont(fontUrl: string, fontFamily: string): Promise<void> {
    if (this.preloadedResources.has(fontUrl)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, `url(${fontUrl})`)
      
      font.load().then(() => {
        document.fonts.add(font)
        this.preloadedResources.add(fontUrl)
        resolve()
      }).catch(reject)
    })
  }

  static preloadRoute(href: string): void {
    if (this.preloadedResources.has(href)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
    
    this.preloadedResources.add(href)
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {}

  static startTiming(label: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics[label]) {
        this.metrics[label] = []
      }
      
      this.metrics[label].push(duration)
    }
  }

  static markTiming(label: string): void {
    performance.mark(label)
  }

  static measureTiming(name: string, startMark: string, endMark: string): void {
    performance.measure(name, startMark, endMark)
  }

  static getMetrics(): Record<string, {
    avg: number
    min: number
    max: number
    count: number
  }> {
    const result: Record<string, any> = {}
    
    Object.entries(this.metrics).forEach(([label, times]) => {
      result[label] = {
        avg: times.reduce((a, b) => a + b, 0) / times.length,
        min: Math.min(...times),
        max: Math.max(...times),
        count: times.length
      }
    })
    
    return result
  }

  static getWebVitals(): Promise<{
    FCP?: number
    LCP?: number
    FID?: number
    CLS?: number
    TTFB?: number
  }> {
    return new Promise(resolve => {
      const vitals: any = {}
      
      // First Contentful Paint
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            vitals.FCP = entry.startTime
          }
        })
      }).observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        vitals.LCP = entries[entries.length - 1].startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          const fidEntry = entry as any
          if (fidEntry.processingStart && fidEntry.startTime) {
            vitals.FID = fidEntry.processingStart - fidEntry.startTime
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver(list => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach(entry => {
          const clsEntry = entry as any
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        })
        vitals.CLS = clsValue
      }).observe({ entryTypes: ['layout-shift'] })

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart
      }

      setTimeout(() => resolve(vitals), 3000) // Wait 3 seconds to collect metrics
    })
  }
}

// Bundle analysis utilities
export class BundleAnalyzer {
  static analyzeBundleSize(): Promise<{
    totalSize: number
    chunks: Array<{ name: string; size: number }>
  }> {
    return new Promise(resolve => {
      // This would integrate with webpack-bundle-analyzer or similar
      // For now, return mock data
      resolve({
        totalSize: 1024 * 1024, // 1MB
        chunks: [
          { name: 'main', size: 512 * 1024 },
          { name: 'vendor', size: 256 * 1024 },
          { name: 'commons', size: 256 * 1024 }
        ]
      })
    })
  }

  static getUnusedCSS(): Promise<string[]> {
    return new Promise(resolve => {
      // Analyze unused CSS
      const usedSelectors = new Set<string>()
      const allElements = document.querySelectorAll('*')
      
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule instanceof CSSStyleRule) {
              const hasMatch = Array.from(allElements).some(el => 
                el.matches(rule.selectorText)
              )
              if (hasMatch) {
                usedSelectors.add(rule.selectorText)
              }
            }
          })
        } catch (e) {
          // Handle cross-origin stylesheets
        }
      })

      resolve(Array.from(usedSelectors))
    })
  }
}

// Service Worker utilities
export class ServiceWorkerManager {
  static async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath)
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }

  static async unregister(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false

    try {
      const registration = await navigator.serviceWorker.ready
      return await registration.unregister()
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  static async updateSW(): Promise<void> {
    if (!('serviceWorker' in navigator)) return

    const registration = await navigator.serviceWorker.ready
    registration.update()
  }
}
