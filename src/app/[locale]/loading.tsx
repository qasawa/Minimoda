'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative">
        {/* Main circle loader */}
        <motion.div
          className="w-16 h-16 border-4 border-coral-200 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-coral-500 rounded-full" />
        </motion.div>

        {/* Bouncing dots */}
        <div className="flex gap-1 mt-6 justify-center">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-coral-400 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                delay: index * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
