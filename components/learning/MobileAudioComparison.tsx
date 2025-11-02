'use client'

/**
 * Mobile-Optimized Audio Comparison Component
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Supports swipe gestures for audio comparison (native vs user)
 */

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue } from 'framer-motion'
import MobileAudioPlayer from './MobileAudioPlayer'
import GlassCard from '@/components/shared/GlassCard'

interface MobileAudioComparisonProps {
  nativeAudioUrl: string
  userAudioUrl?: string
  nativeLabel?: string
  userLabel?: string
  onSwipe?: (direction: 'left' | 'right') => void
  className?: string
}

export default function MobileAudioComparison({
  nativeAudioUrl,
  userAudioUrl,
  nativeLabel = 'Native Speaker',
  userLabel = 'Your Recording',
  onSwipe,
  className = '',
}: MobileAudioComparisonProps) {
  const [activeTab, setActiveTab] = useState<'native' | 'user'>('native')
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  )
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePanEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipeThreshold = 100
      const velocityThreshold = 500

      // Check swipe distance
      if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
        if (info.offset.x > 0 || info.velocity.x > 0) {
          // Swipe right - show user audio
          if (userAudioUrl && activeTab === 'native') {
            setActiveTab('user')
            setSwipeDirection('right')
            onSwipe?.('right')
          }
        } else {
          // Swipe left - show native audio
          if (activeTab === 'user') {
            setActiveTab('native')
            setSwipeDirection('left')
            onSwipe?.('left')
          }
        }
      }

      // Reset swipe animation
      setTimeout(() => setSwipeDirection(null), 300)
      x.set(0)
    },
    [activeTab, userAudioUrl, onSwipe, x]
  )

  const handleTabClick = useCallback((tab: 'native' | 'user') => {
    setActiveTab(tab)
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Navigation - Touch-friendly */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabClick('native')}
          className={`
            flex-1 px-4 py-3 rounded-lg font-medium text-sm
            min-h-[48px] touch-manipulation
            transition-all duration-200
            ${
              activeTab === 'native'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          aria-label="Listen to native speaker"
        >
          {nativeLabel}
        </button>
        {userAudioUrl && (
          <button
            onClick={() => handleTabClick('user')}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium text-sm
              min-h-[48px] touch-manipulation
              transition-all duration-200
              ${
                activeTab === 'user'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-label="Listen to your recording"
          >
            {userLabel}
          </button>
        )}
      </div>

      {/* Audio Comparison Area - Swipeable */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handlePanEnd}
        className="relative"
        animate={{
          x: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0,
        }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        <GlassCard className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'native' ? (
              <motion.div
                key="native"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">{nativeLabel}</h3>
                  <p className="text-sm text-gray-600">
                    Swipe right to compare with your recording
                  </p>
                </div>
                <MobileAudioPlayer audioUrl={nativeAudioUrl} size="large" />
              </motion.div>
            ) : userAudioUrl ? (
              <motion.div
                key="user"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">{userLabel}</h3>
                  <p className="text-sm text-gray-600">
                    Swipe left to listen to native speaker
                  </p>
                </div>
                <MobileAudioPlayer audioUrl={userAudioUrl} size="large" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Swipe Indicator */}
      {userAudioUrl && (
        <div className="text-center text-xs text-gray-500">
          <p>
            💡 Swipe left/right to switch between recordings
          </p>
        </div>
      )}
    </div>
  )
}


