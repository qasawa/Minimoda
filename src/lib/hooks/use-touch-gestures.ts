'use client'

import { useRef, useCallback, useEffect } from 'react'

interface TouchGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: (x: number, y: number) => void
  onDoubleTap?: (x: number, y: number) => void
  onTap?: (x: number, y: number) => void
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  pinchThreshold?: number
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  lastTapTime: number
  tapCount: number
  isLongPress: boolean
  initialDistance: number
  scale: number
}

export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight, 
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onLongPress,
    onDoubleTap,
    onTap,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pinchThreshold = 0.1
  } = options

  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    isLongPress: false,
    initialDistance: 0,
    scale: 1
  })

  const longPressTimer = useRef<NodeJS.Timeout>()
  const doubleTapTimer = useRef<NodeJS.Timeout>()

  // Helper function to calculate distance between two touches
  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }, [])

  // Haptic feedback helper
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      }
      navigator.vibrate(patterns[type])
    }
  }, [])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    const now = Date.now()
    
    touchState.current = {
      ...touchState.current,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      isLongPress: false
    }

    // Handle multi-touch (pinch)
    if (e.touches.length === 2) {
      touchState.current.initialDistance = getTouchDistance(e.touches)
      touchState.current.scale = 1
    }

    // Set up long press timer
    if (onLongPress && e.touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        touchState.current.isLongPress = true
        triggerHaptic('medium')
        onLongPress(touch.clientX, touch.clientY)
      }, longPressDelay)
    }

    // Handle double tap detection
    if (onDoubleTap && e.touches.length === 1) {
      const timeSinceLastTap = now - touchState.current.lastTapTime
      
      if (timeSinceLastTap < doubleTapDelay) {
        touchState.current.tapCount++
        if (touchState.current.tapCount === 2) {
          triggerHaptic('light')
          onDoubleTap(touch.clientX, touch.clientY)
          touchState.current.tapCount = 0
        }
      } else {
        touchState.current.tapCount = 1
      }
      
      touchState.current.lastTapTime = now
    }
  }, [onLongPress, onDoubleTap, longPressDelay, doubleTapDelay, getTouchDistance, triggerHaptic])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Clear long press if finger moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch) {
      const currentDistance = getTouchDistance(e.touches)
      if (touchState.current.initialDistance > 0) {
        const scale = currentDistance / touchState.current.initialDistance
        
        // Only trigger if scale change is significant
        if (Math.abs(scale - touchState.current.scale) > pinchThreshold) {
          touchState.current.scale = scale
          onPinch(scale)
        }
      }
    }
  }, [onPinch, getTouchDistance, pinchThreshold])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Clear timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Only process swipes and taps for single touch
    if (e.changedTouches.length === 1 && !touchState.current.isLongPress) {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // Check for swipe gestures
      if (distance > swipeThreshold) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            triggerHaptic('light')
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            triggerHaptic('light')
            onSwipeLeft()
          }
        } else {
          // Vertical swipe  
          if (deltaY > 0 && onSwipeDown) {
            triggerHaptic('light')
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            triggerHaptic('light')
            onSwipeUp()
          }
        }
      } else {
        // Simple tap (if not part of double tap)
        if (onTap && touchState.current.tapCount === 1) {
          // Wait for potential double tap
          doubleTapTimer.current = setTimeout(() => {
            if (touchState.current.tapCount === 1) {
              onTap(touch.clientX, touch.clientY)
              touchState.current.tapCount = 0
            }
          }, doubleTapDelay)
        }
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, swipeThreshold, doubleTapDelay, triggerHaptic])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current)
      }
    }
  }, [])

  // Return touch event handlers
  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }

  return {
    touchHandlers,
    triggerHaptic
  }
}
