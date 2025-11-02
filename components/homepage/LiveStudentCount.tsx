'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

interface LiveStudentCountProps {
  /** Base student count to start from */
  baseCount?: number
  /** Minimum variation to add to base count */
  minVariation?: number
  /** Maximum variation to add to base count */
  maxVariation?: number
  /** How often to update the count (in milliseconds) */
  updateInterval?: number
}

/**
 * Live Student Count Component
 * 
 * Displays an animated counter showing the number of active learners.
 * With real data, this would connect to an API; for now, it uses realistic
 * simulated data that updates periodically.
 */
export default function LiveStudentCount({
  baseCount = 1200,
  minVariation = 0,
  maxVariation = 50,
  updateInterval = 30000, // 30 seconds
}: LiveStudentCountProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(baseCount)
  const [displayCount, setDisplayCount] = useState(baseCount)

  // Update the target count periodically
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayCount(count)
      return
    }

    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * (maxVariation - minVariation + 1)) + minVariation
      const newCount = baseCount + variation
      setCount(newCount)
    }, updateInterval)

    return () => clearInterval(interval)
  }, [baseCount, minVariation, maxVariation, updateInterval, prefersReducedMotion])

  // Animate display count to target count
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayCount(count)
      return
    }

    const duration = 1000 // 1 second animation
    const steps = 60
    const stepDuration = duration / steps
    const increment = (count - displayCount) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayCount(count)
        clearInterval(timer)
      } else {
        setDisplayCount(prev => Math.floor(prev + increment))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [count, displayCount, prefersReducedMotion])

  return (
    <div className="flex items-center gap-2 text-primary-900">
      <motion.span
        className="font-serif text-lg sm:text-xl font-bold"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
        key={displayCount}
      >
        {displayCount.toLocaleString()}
      </motion.span>
      <span className="font-sans text-sm sm:text-base text-gray-600">
        active learners
      </span>
    </div>
  )
}



