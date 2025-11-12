import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }
    
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [matches, query])

  return matches
}

// Performance-optimized device detection hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsLowPerformanceDevice(): boolean {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  
  useEffect(() => {
    // Check various performance indicators
    const checkPerformance = () => {
      const navigator = window.navigator as any
      
      // Check device memory (if available)
      const deviceMemory = navigator.deviceMemory || 4 // Default to 4GB if not available
      
      // Check hardware concurrency (CPU cores)
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      
      // Check connection speed (if available)
      const connection = navigator.connection
      const effectiveType = connection?.effectiveType || '4g'
      
      // Consider device low-performance if:
      // - Less than 4GB RAM
      // - Less than 4 CPU cores  
      // - Slow connection
      const isLowPerf = deviceMemory < 4 || 
                       hardwareConcurrency < 4 || 
                       effectiveType === 'slow-2g' || 
                       effectiveType === '2g' ||
                       effectiveType === '3g'
      
      setIsLowPerformance(isLowPerf)
    }
    
    checkPerformance()
  }, [])
  
  return isLowPerformance
}
