'use client'

import { usePullToRefresh } from '@/lib/hooks/usePullToRefresh'
import { motion } from 'framer-motion'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  disabled?: boolean
  threshold?: number
  className?: string
}

export default function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  threshold = 80,
  className = '',
}: PullToRefreshProps) {
  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    progress,
    shouldTrigger,
  } = usePullToRefresh({
    onRefresh,
    threshold,
    disabled,
  })

  return (
    <div className={`relative ${className}`}>
      {/* Pull Indicator */}
      {isPulling && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: 1,
            y: Math.min(pullDistance / 3, 50),
          }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2 py-4">
            {shouldTrigger ? (
              <>
                {/* Release to refresh */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
                />
                <p className="font-sans text-sm font-medium text-primary-700">
                  Release to refresh
                </p>
              </>
            ) : (
              <>
                {/* Pull down indicator */}
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform: `rotate(${progress * 180}deg)`,
                    transition: 'transform 0.2s ease-out',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <p className="font-sans text-sm text-gray-600">
                  Pull to refresh
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading spinner when refreshing */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10 bg-white border-b border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-sans text-sm font-medium text-primary-700">
              Refreshing...
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        ref={containerRef}
        className="overflow-y-auto h-full"
      >
        {children}
      </div>
    </div>
  )
}


