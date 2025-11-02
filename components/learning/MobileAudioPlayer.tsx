'use client'

/**
 * Mobile-Optimized Audio Player Component
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Large touch-friendly buttons optimized for mobile devices
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createMobileAudioElement,
  isMobileDevice,
  loadAudioProgressively,
  getCachedAudio,
  type MobileAudioConfig,
  DEFAULT_MOBILE_CONFIG,
} from '@/lib/utils/mobileAudio'
// Using SVG icons for compatibility

interface MobileAudioPlayerProps {
  audioUrl: string
  label?: string
  config?: MobileAudioConfig
  onPlayStart?: () => void
  onPlayEnd?: () => void
  onError?: (error: Error) => void
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export default function MobileAudioPlayer({
  audioUrl,
  label,
  config = DEFAULT_MOBILE_CONFIG,
  onPlayStart,
  onPlayEnd,
  onError,
  className = '',
  size = 'large',
}: MobileAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isMobile = isMobileDevice()

  // Size classes for mobile-optimized touch targets (min 44px)
  const sizeClasses = {
    small: 'h-11 w-11 min-h-[44px] min-w-[44px] text-lg',
    medium: 'h-14 w-14 min-h-[56px] min-w-[56px] text-xl',
    large: 'h-20 w-20 min-h-[80px] min-w-[80px] text-2xl md:h-16 md:w-16',
  }

  // Load audio
  useEffect(() => {
    async function loadAudio() {
      if (!audioUrl) return

      setIsLoading(true)
      setHasError(false)

      try {
        // Try to get cached audio first
        const cached = await getCachedAudio(audioUrl)
        let audio: HTMLAudioElement

        if (cached) {
          // Use cached audio
          const blob = await cached.blob()
          const blobUrl = URL.createObjectURL(blob)
          audio = createMobileAudioElement(blobUrl, config)
        } else {
          // Load progressively
          audio = await loadAudioProgressively(audioUrl, (progressValue) => {
            setProgress(progressValue)
          })
        }

        audioRef.current = audio

        // Setup event listeners
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration)
          setIsLoading(false)
        })

        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setCurrentTime(audio.currentTime)
            setProgress((audio.currentTime / audio.duration) * 100)
          }
        })

        audio.addEventListener('ended', () => {
          setIsPlaying(false)
          setCurrentTime(0)
          setProgress(0)
          onPlayEnd?.()
        })

        audio.addEventListener('error', (e) => {
          const error = new Error(`Failed to load audio: ${audioUrl}`)
          setHasError(true)
          setIsLoading(false)
          setIsPlaying(false)
          onError?.(error)
        })

        // Set volume based on muted state
        audio.volume = isMuted ? 0 : 1
      } catch (error) {
        setHasError(true)
        setIsLoading(false)
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    }

    loadAudio()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [audioUrl, config, isMuted, onError, onPlayEnd])

  const handlePlayPause = useCallback(async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        onPlayStart?.()
      }
    } catch (error) {
      setHasError(true)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }, [isPlaying, onPlayStart, onError])

  const handleToggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 p-4 ${className}`}
      >
        <p className="text-sm text-red-600">Failed to load audio</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm min-h-[44px]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Main Play/Pause Button - Large and touch-friendly */}
      <motion.button
        onClick={handlePlayPause}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-primary-600 text-white
          hover:bg-primary-700 active:bg-primary-800
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl
          transition-all duration-200
          touch-manipulation
        `}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-spin"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
          ) : isPlaying ? (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-1"
            >
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-gray-700 text-center">
          {label}
        </p>
      )}

      {/* Progress Bar - Mobile optimized */}
      {duration > 0 && (
        <div className="w-full max-w-xs">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Mute Toggle - Touch-friendly */}
      <button
        onClick={handleToggleMute}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  )
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

