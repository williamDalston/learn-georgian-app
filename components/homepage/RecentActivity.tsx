'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

interface ActivityItem {
  name: string
  action: string
  lesson: string
  timestamp: string
}

interface RecentActivityProps {
  /** How often to rotate to the next activity (in milliseconds) */
  rotateInterval?: number
  /** Show activity count badge */
  showCount?: boolean
}

const defaultActivities: ActivityItem[] = [
  {
    name: 'Sarah',
    action: 'completed',
    lesson: 'Alphabet Introduction',
    timestamp: 'Just now',
  },
  {
    name: 'Michael',
    action: 'completed',
    lesson: 'A1-3: Ejective Consonants',
    timestamp: '2 minutes ago',
  },
  {
    name: 'Jessica',
    action: 'completed',
    lesson: 'A2-2: Pluralization and Cases',
    timestamp: '5 minutes ago',
  },
  {
    name: 'David',
    action: 'unlocked achievement',
    lesson: 'First Steps 🚀',
    timestamp: '8 minutes ago',
  },
  {
    name: 'Emma',
    action: 'completed',
    lesson: 'B1-1: Polypersonal Verbs',
    timestamp: '12 minutes ago',
  },
  {
    name: 'Robert',
    action: 'reached streak milestone',
    lesson: 'Week Warrior 🔥 (7 days)',
    timestamp: '15 minutes ago',
  },
]

/**
 * Recent Activity Feed Component
 * 
 * Shows a rotating feed of recent learner activities to build trust and
 * demonstrate active engagement. Rotates through different activities
 * automatically to keep the content fresh.
 */
export default function RecentActivity({
  rotateInterval = 5000, // 5 seconds
  showCount = true,
}: RecentActivityProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const activities = defaultActivities

  // Rotate through activities automatically
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [rotateInterval, isHovered, prefersReducedMotion, activities.length])

  const currentActivity = activities[currentIndex]

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {showCount && (
        <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
          {activities.length}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 min-h-[100px]">
        <div className="flex items-start gap-3">
          {/* Activity indicator */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {/* Pulse animation */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-25" />
              )}
            </div>
          </div>

          {/* Activity content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-sans text-gray-900 mb-1">
                  <span className="font-semibold text-primary-900">
                    {currentActivity.name}
                  </span>{' '}
                  <span className="text-gray-600">
                    {currentActivity.action}
                  </span>
                </p>
                <p className="text-xs font-sans text-gray-700 mb-2 line-clamp-2">
                  {currentActivity.lesson}
                </p>
                <p className="text-xs font-sans text-gray-500">
                  {currentActivity.timestamp}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="mt-3 flex gap-1">
              {activities.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-accent'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to activity ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

