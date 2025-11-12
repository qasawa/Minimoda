import { useState, useEffect, useRef, useCallback } from 'react'

export interface TouchPosition {
  x: number
  y: number
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

export interface PinchGesture {
  scale: number
  center: TouchPosition
}

export interface GestureHandlers {
  onSwipe?: (direction: SwipeDirection) => void
  onTap?: (position: TouchPosition) => void
  onDoubleTap?: (position: TouchPosition) => void
  onLongPress?: (position: TouchPosition) => void
  onPinch?: (gesture: PinchGesture) => void
  onPan?: (delta: TouchPosition, position: TouchPosition) => void
}

export interface GestureOptions {
  swipeThreshold?: number
  velocityThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  pinchThreshold?: number
  preventDefault?: boolean
}

export function useMobileGestures(
  handlers: GestureHandlers = {},
  options: GestureOptions = {}
) {
  const {
    swipeThreshold = 50,
    velocityThreshold = 0.3,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pinchThreshold = 0.1,
    preventDefault = true
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isGestureActive, setIsGestureActive] = useState(false)
  
  // Touch tracking state
  const touchState = useRef({
    startTime: 0,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    touchCount: 0,
    lastTapTime: 0,
    longPressTimer: null as NodeJS.Timeout | null,
    initialDistance: 0,
    initialScale: 1
  })

  // Calculate distance between two touch points
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0
    
    const touch1 = touches[0]
    const touch2 = touches[1]
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  // Get center point between two touches
  const getTouchCenter = (touches: TouchList): TouchPosition => {
    if (touches.length < 2) {
      return { x: touches[0].clientX, y: touches[0].clientY }
    }
    
    const touch1 = touches[0]
    const touch2 = touches[1]
    
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }

  // Calculate swipe direction and velocity
  const calculateSwipe = (
    startPos: TouchPosition,
    endPos: TouchPosition,
    duration: number
  ): SwipeDirection => {
    const deltaX = endPos.x - startPos.x
    const deltaY = endPos.y - startPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / duration

    if (distance < swipeThreshold || velocity < velocityThreshold) {
      return { direction: null, distance: 0, velocity: 0 }
    }

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    let direction: 'left' | 'right' | 'up' | 'down'
    
    if (absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    return { direction, distance, velocity }
  }

  // Touch start handler
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    const currentTime = Date.now()
    
    touchState.current = {
      ...touchState.current,
      startTime: currentTime,
      startPosition: { x: touch.clientX, y: touch.clientY },
      currentPosition: { x: touch.clientX, y: touch.clientY },
      lastPosition: { x: touch.clientX, y: touch.clientY },
      touchCount: event.touches.length
    }

    setIsGestureActive(true)

    // Handle multi-touch for pinch
    if (event.touches.length === 2) {
      touchState.current.initialDistance = getTouchDistance(event.touches)
      touchState.current.initialScale = 1
    }

    // Start long press timer
    if (event.touches.length === 1) {
      touchState.current.longPressTimer = setTimeout(() => {
        handlers.onLongPress?.(touchState.current.startPosition)
      }, longPressDelay)
    }
  }, [handlers, longPressDelay, preventDefault])

  // Touch move handler
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    const currentPos = { x: touch.clientX, y: touch.clientY }
    const lastPos = touchState.current.currentPosition

    // Update position
    touchState.current.lastPosition = touchState.current.currentPosition
    touchState.current.currentPosition = currentPos

    // Clear long press timer on movement
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer)
      touchState.current.longPressTimer = null
    }

    // Handle pinch gesture
    if (event.touches.length === 2 && handlers.onPinch) {
      const currentDistance = getTouchDistance(event.touches)
      const scale = currentDistance / touchState.current.initialDistance
      const center = getTouchCenter(event.touches)

      if (Math.abs(scale - touchState.current.initialScale) > pinchThreshold) {
        handlers.onPinch({ scale, center })
        touchState.current.initialScale = scale
      }
    }

    // Handle pan gesture
    if (event.touches.length === 1 && handlers.onPan) {
      const delta = {
        x: currentPos.x - lastPos.x,
        y: currentPos.y - lastPos.y
      }
      handlers.onPan(delta, currentPos)
    }
  }, [handlers, pinchThreshold, preventDefault])

  // Touch end handler
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (preventDefault) {
      event.preventDefault()
    }

    const currentTime = Date.now()
    const duration = currentTime - touchState.current.startTime
    const endPos = touchState.current.currentPosition

    setIsGestureActive(false)

    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer)
      touchState.current.longPressTimer = null
    }

    // Handle tap gestures (only for single touch)
    if (touchState.current.touchCount === 1) {
      const distance = Math.sqrt(
        Math.pow(endPos.x - touchState.current.startPosition.x, 2) +
        Math.pow(endPos.y - touchState.current.startPosition.y, 2)
      )

      // If it's a tap (minimal movement)
      if (distance < 10 && duration < 500) {
        const timeSinceLastTap = currentTime - touchState.current.lastTapTime

        if (timeSinceLastTap < doubleTapDelay) {
          // Double tap
          handlers.onDoubleTap?.(endPos)
        } else {
          // Single tap (delay to check for double tap)
          setTimeout(() => {
            const timeSinceThisTap = Date.now() - currentTime
            if (timeSinceThisTap >= doubleTapDelay) {
              handlers.onTap?.(endPos)
            }
          }, doubleTapDelay)
        }

        touchState.current.lastTapTime = currentTime
      } else {
        // Handle swipe
        const swipe = calculateSwipe(
          touchState.current.startPosition,
          endPos,
          duration
        )

        if (swipe.direction && handlers.onSwipe) {
          handlers.onSwipe(swipe)
        }
      }
    }
  }, [handlers, doubleTapDelay, preventDefault])

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    ref: elementRef,
    isGestureActive
  }
}

// Specialized hooks for common gestures

// Swipe hook
export function useSwipeGesture(
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
  options: GestureOptions = {}
) {
  return useMobileGestures(
    {
      onSwipe: (swipe) => {
        if (swipe.direction) {
          onSwipe(swipe.direction)
        }
      }
    },
    options
  )
}

// Pinch zoom hook
export function usePinchZoom(
  onZoom: (scale: number, center: TouchPosition) => void,
  options: GestureOptions = {}
) {
  return useMobileGestures(
    {
      onPinch: ({ scale, center }) => {
        onZoom(scale, center)
      }
    },
    options
  )
}

// Drag hook
export function useDragGesture(
  onDrag: (delta: TouchPosition, position: TouchPosition) => void,
  options: GestureOptions = {}
) {
  return useMobileGestures(
    {
      onPan: onDrag
    },
    options
  )
}

// Pull to refresh hook
export function usePullToRefresh(
  onRefresh: () => void,
  threshold: number = 100
) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const { ref } = useMobileGestures({
    onPan: (delta, position) => {
      // Only allow pull down from top
      if (position.y > 100) return

      const newDistance = Math.max(0, pullDistance + delta.y)
      setPullDistance(newDistance)
      setIsPulling(newDistance > 20)

      if (newDistance > threshold) {
        onRefresh()
        setPullDistance(0)
        setIsPulling(false)
      }
    }
  }, {
    preventDefault: false
  })

  return {
    ref,
    isPulling,
    pullDistance: Math.min(pullDistance, threshold),
    pullProgress: Math.min(pullDistance / threshold, 1)
  }
}

// Carousel/slider hook
export function useCarouselGesture(
  onNext: () => void,
  onPrevious: () => void,
  swipeThreshold: number = 50
) {
  return useMobileGestures({
    onSwipe: (swipe) => {
      if (swipe.direction === 'left') {
        onNext()
      } else if (swipe.direction === 'right') {
        onPrevious()
      }
    }
  }, {
    swipeThreshold
  })
}
