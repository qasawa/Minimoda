'use client'

import { useEffect, useState } from 'react'
import { useMemoryMonitoring } from '@/lib/utils/performance-optimizations'

interface PerformanceMonitorProps {
  enabled?: boolean
}

export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60)
  const [renderTime, setRenderTime] = useState(0)
  const memoryUsage = useMemoryMonitoring()
  
  useEffect(() => {
    if (!enabled) return
    
    let frameCount = 0
    let lastTime = performance.now()
    let animationFrame: number
    
    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      const renderStartTime = performance.now()
      
      // Simulate a small render operation
      requestIdleCallback(() => {
        const renderEndTime = performance.now()
        setRenderTime(renderEndTime - renderStartTime)
      })
      
      if (currentTime - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        setFps(currentFps)
        frameCount = 0
        lastTime = currentTime
        
        // Log performance warnings
        if (currentFps < 30) {
          console.warn(`⚠️ Low FPS detected: ${currentFps}fps`)
        }
      }
      
      animationFrame = requestAnimationFrame(measurePerformance)
    }
    
    animationFrame = requestAnimationFrame(measurePerformance)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [enabled])
  
  if (!enabled) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-[10000] bg-black/80 text-white p-2 rounded text-xs font-mono">
      <div>FPS: {fps}</div>
      <div>Render: {renderTime.toFixed(2)}ms</div>
      {memoryUsage && (
        <div>
          Memory: {memoryUsage.used}MB / {memoryUsage.total}MB ({memoryUsage.percentage}%)
        </div>
      )}
    </div>
  )
}
