'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { BaseProps } from '@/lib/types'

type EmailSignupMinimalProps = BaseProps

export function EmailSignupMinimal({ locale, dictionary }: EmailSignupMinimalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsLoading(false)
    setEmail('')
  }

  return (
    <section 
      ref={ref}
      className="py-20 bg-neutral-50"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto text-center"
        >
          {!isSubmitted ? (
            <>
              {/* Heading */}
              <motion.h2 
                className="text-2xl font-heading font-light text-charcoal-800 mb-4"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join Our World
              </motion.h2>
              
              {/* Subtext */}
              <motion.p 
                className="text-base font-body text-neutral-500 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Be the first to shop new collections and exclusive offers.
              </motion.p>

              {/* Email Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 font-body text-sm bg-white border border-neutral-200 focus:outline-none focus:border-sage-500 transition-colors duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="px-6 py-3 bg-white text-charcoal-800 font-nav text-xs border border-charcoal-800 hover:bg-charcoal-800 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'JOINING...' : 'JOIN'}
                </button>
              </motion.form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-8 h-8 text-sage-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              </div>
              <h3 className="text-xl font-heading font-light text-charcoal-800 mb-2">
                Welcome to Our World
              </h3>
              <p className="text-neutral-500 font-body">
                Thank you for joining. You&apos;ll hear from us soon.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
