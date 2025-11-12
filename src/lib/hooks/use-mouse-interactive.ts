'use client'

import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCallback } from 'react'

interface UseMouseInteractiveOptions {
  strength?: number // How strong the tilt effect should be (0-1)
  perspective?: number // Perspective for 3D effect
  scale?: number // Scale factor on hover
}

export function useMouseInteractive(options: UseMouseInteractiveOptions = {}) {
  const {
    strength = 0.5,
    perspective = 1000,
    scale = 1.05
  } = options

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations for smooth movement
  const mouseXSpring = useSpring(mouseX, { 
    damping: 25, 
    stiffness: 700,
    restDelta: 0.001
  })
  const mouseYSpring = useSpring(mouseY, { 
    damping: 25, 
    stiffness: 700,
    restDelta: 0.001
  })

  // Transform values for 3D effects
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [15 * strength, -15 * strength]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [-15 * strength, 15 * strength]
  )

  // Floating elements that follow mouse
  const floatX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [-20 * strength, 20 * strength]
  )
  const floatY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [-20 * strength, 20 * strength]
  )

  // Mouse event handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top
    
    // Normalize to -0.5 to 0.5
    const xPct = (mouseXPos / width) - 0.5
    const yPct = (mouseYPos / height) - 0.5
    
    mouseX.set(xPct)
    mouseY.set(yPct)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    // Can be used for additional enter effects
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Motion values for animations
  const motionValues = {
    rotateX,
    rotateY,
    scale,
    perspective,
    floatX,
    floatY,
    mouseXSpring,
    mouseYSpring
  }

  // Event handlers
  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }

  return {
    motionValues,
    handlers
  }
}
