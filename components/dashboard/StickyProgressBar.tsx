'use client'

import { useProgress } from '@/lib/hooks/useProgress'
import { motion } from 'framer-motion'

interface StickyProgressBarProps {
  onTap?: () => void // Scroll to full progress section
  className?: string
  showOnDesktop?: boolean // Show on desktop or only mobile (default: false)
}

export default function StickyProgressBar({
  onTap,
  className = '',
  showOnDesktop = false,
}: StickyProgressBarProps) {
  const { progress } = useProgress({
    daysPracticed: 0,
    totalTime: 0,
    currentStreak: 0,
    totalLessons: 0,
    completedLessons: 0,
  })

  // Calculate completion percentage
  const completionPercentage = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0

  const handleClick = () => {
    if (onTap) {
      onTap()
    }
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm
        cursor-pointer hover:bg-gray-50 transition-colors
        ${!showOnDesktop ? 'lg:hidden' : ''}
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label="Course progress"
    >
      <div className="container-custom py-2">
        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent"
            />
          </div>

          {/* Percentage */}
          <div className="flex items-center gap-2 min-w-[60px] justify-end">
            <span className="font-sans text-sm font-semibold text-primary-900">
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-1">
          <span className="font-sans text-xs text-gray-600">
            {progress.completedLessons} of {progress.totalLessons} lessons
          </span>
          <div className="flex items-center gap-2">
            {progress.currentStreak > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-orange-500">🔥</span>
                <span className="font-sans text-xs text-gray-600">
                  {progress.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}



