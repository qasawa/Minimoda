'use client'

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy-loaded motion components to reduce initial bundle size
export const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div className="opacity-0" /> // Invisible placeholder
  }
)

export const MotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  {
    ssr: false,
    loading: () => <section className="opacity-0" />
  }
)

export const MotionButton = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.button })),
  {
    ssr: false,
    loading: () => <button className="opacity-0" />
  }
)

export const MotionSpan = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.span })),
  {
    ssr: false,
    loading: () => <span className="opacity-0" />
  }
)

// Animation wrapper that falls back to regular div if motion is disabled
interface LazyAnimationWrapperProps {
  children: ReactNode
  className?: string
  variants?: any
  initial?: any
  animate?: any
  whileHover?: any
  whileTap?: any
  transition?: any
  layoutId?: string
  [key: string]: any
}

export function LazyAnimationWrapper({ 
  children, 
  className = '',
  variants,
  initial,
  animate,
  whileHover,
  whileTap,
  transition,
  layoutId,
  ...props 
}: LazyAnimationWrapperProps) {
  // Check for reduced motion preference
  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  // If reduced motion is preferred, render a regular div
  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  // Otherwise, render the lazy-loaded motion component
  return (
    <MotionDiv
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      layoutId={layoutId}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

// Higher-order component for lazy loading animations
export function withLazyMotion<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<P>
) {
  return function LazyMotionComponent(props: P) {
    const DynamicComponent = dynamic(
      () => Promise.resolve({ default: Component }),
      {
        ssr: false,
        loading: () => FallbackComponent ? <FallbackComponent {...props} /> : <Skeleton className="w-full h-20" />
      }
    )

    return <DynamicComponent {...props} />
  }
}
