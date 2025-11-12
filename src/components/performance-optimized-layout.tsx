'use client'

import dynamic from 'next/dynamic'
import { useIsMobile, useReducedMotion, useIsLowPerformanceDevice } from '@/lib/hooks/use-media-query'
import { useAnimationCapability } from '@/lib/utils/performance-optimizations'
import { MobileOptimizedLayout } from '@/components/mobile-optimized-layout'

// Lazy load heavy animation components
const Web3Background = dynamic(() => import('@/components/ui/web3-background').then(mod => ({ default: mod.Web3Background })), {
  ssr: false,
  loading: () => null
})

const GlobalCursorTrail = dynamic(() => import('@/components/ui/global-cursor-trail').then(mod => ({ default: mod.GlobalCursorTrail })), {
  ssr: false,
  loading: () => null
})

export function PerformanceOptimizedLayout() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const isLowPerformance = useIsLowPerformanceDevice()
  const hasGoodPerformance = useAnimationCapability()
  
  // Only load heavy components when performance is good
  const shouldLoadHeavyAnimations = !isMobile && !reducedMotion && !isLowPerformance && hasGoodPerformance
  
  return (
    <>
      {/* Mobile gets ultra-lightweight layout */}
      {isMobile && <MobileOptimizedLayout />}
      
      {/* Desktop gets full animations only with good performance */}
      {!isMobile && !reducedMotion && hasGoodPerformance && <Web3Background variant="subtle" />}
      {shouldLoadHeavyAnimations && <GlobalCursorTrail />}
    </>
  )
}
