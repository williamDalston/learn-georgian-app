'use client'

import { useState, useRef } from 'react'
import { playLetterAudio } from '@/lib/utils/audioLoader'
import { speakGeorgian, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'
import { motion, AnimatePresence } from 'framer-motion'

interface LetterAudioPlayerProps {
  letter: string
  fallbackToTTS?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

/**
 * Letter Audio Player Component
 * 
 * Plays native Georgian letter pronunciation with automatic fallback to TTS
 */
export default function LetterAudioPlayer({
  letter,
  fallbackToTTS = true,
  size = 'md',
  className = '',
  showLabel = false,
}: LetterAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const handlePlay = async () => {
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()

    setIsLoading(true)
    setIsPlaying(true)
    setHasError(false)

    try {
      const audio = await playLetterAudio(letter, {
        fallbackToTTS,
        onError: (error) => {
          console.error('Letter audio playback error:', error)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
        },
        onLoad: () => {
          setIsLoading(false)
        },
      })

      if (audio) {
        audioRef.current = audio
        audio.onended = () => {
          setIsPlaying(false)
          setIsLoading(false)
        }
        audio.onerror = () => {
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
        }
      } else {
        // TTS fallback - approximate duration
        setTimeout(() => {
          setIsPlaying(false)
          setIsLoading(false)
        }, 1500) // Letters are typically shorter
      }
    } catch (error) {
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()
    setIsPlaying(false)
    setIsLoading(false)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-primary-100 hover:bg-primary-200
          border border-primary-300
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isPlaying ? 'bg-primary-200 animate-pulse' : ''}
        `}
        aria-label={`Play pronunciation of letter ${letter}`}
        title={`Click to hear: ${letter}`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${iconSizes[size]} animate-spin`}
            >
              <svg
                className="w-full h-full text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </motion.div>
          ) : isPlaying ? (
            <motion.svg
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`${iconSizes[size]} text-primary-600`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </motion.svg>
          ) : hasError && !fallbackToTTS ? (
            <motion.svg
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${iconSizes[size]} text-red-500`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`${iconSizes[size]} text-primary-600`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
      
      {showLabel && (
        <span className="font-sans text-sm text-gray-700 font-medium">
          {letter}
        </span>
      )}
    </div>
  )
}

