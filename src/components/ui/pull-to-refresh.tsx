'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { usePullToRefresh } from '@/lib/hooks/use-pull-to-refresh'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { pullDistance, isRefreshing, isPulling } = usePullToRefresh({
    onRefresh,
    threshold: 80,
    resistance: 2.5
  })

  const progress = Math.min(pullDistance / 80, 1)
  const rotation = progress * 180

  return (
    <div className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
            style={{
              transform: `translateY(${Math.min(pullDistance, 100)}px)`
            }}
          >
            <motion.div
              className="mt-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{
                scale: progress,
                rotate: isRefreshing ? 360 : rotation
              }}
              transition={{
                rotate: {
                  duration: isRefreshing ? 1 : 0,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear"
                }
              }}
            >
              <RefreshCw 
                className={`h-6 w-6 ${
                  isRefreshing ? 'text-navy-600' : 
                  progress === 1 ? 'text-green-500' : 'text-gray-400'
                }`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Minimoda logo animation for refresh */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl font-playfair font-bold bg-gradient-to-r from-navy-500 to-soft-blue-500 bg-clip-text text-transparent"
              >
                M
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        style={{
          transform: isPulling && !isRefreshing ? `translateY(${pullDistance * 0.5}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}
