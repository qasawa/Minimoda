'use client'

import { useIsMobile } from '@/lib/hooks/use-media-query'

export function MobileOptimizedLayout() {
  const isMobile = useIsMobile()
  
  // Only render on mobile devices
  if (!isMobile) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Clean white background for mobile */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Simple static decoration with solid colors */}
      <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-pink-50 opacity-40" />
      <div className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-blue-50 opacity-30" />
    </div>
  )
}
