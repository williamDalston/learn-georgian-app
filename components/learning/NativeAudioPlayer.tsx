'use client'

import { useState, useRef, useEffect } from 'react'
import { playVocabularyAudio, playPhraseAudio } from '@/lib/utils/audioLoader'
import { speakGeorgian, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'
import { motion, AnimatePresence } from 'framer-motion'

interface NativeAudioPlayerProps {
  text: string
  type?: 'word' | 'phrase'
  lessonId?: string
  fallbackToTTS?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Native Audio Player Component
 * 
 * Plays native Georgian audio files with automatic fallback to TTS
 * if the audio file doesn't exist.
 */
export default function NativeAudioPlayer({
  text,
  type = 'word',
  lessonId,
  fallbackToTTS = true,
  size = 'md',
  className = '',
}: NativeAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
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
      let audio: HTMLAudioElement | null = null
      
      if (type === 'word') {
        audio = await playVocabularyAudio(text, lessonId, {
          fallbackToTTS,
          onError: (error) => {
            console.error('Audio playback error:', error)
            setHasError(true)
            setIsPlaying(false)
            setIsLoading(false)
          },
          onLoad: () => {
            setIsLoading(false)
          },
        })
      } else {
        audio = await playPhraseAudio(text, lessonId, {
          fallbackToTTS,
          onError: (error) => {
            console.error('Audio playback error:', error)
            setHasError(true)
            setIsPlaying(false)
            setIsLoading(false)
          },
          onLoad: () => {
            setIsLoading(false)
          },
        })
      }

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
        }, 2000)
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
    <button
      onClick={isPlaying ? handleStop : handlePlay}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-accent/10 hover:bg-accent/20
        border border-accent/30
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        ${className}
        ${isPlaying ? 'bg-accent/20 animate-pulse' : ''}
      `}
      aria-label={`Play audio for ${text}`}
      title={`Play pronunciation: ${text}`}
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
              className="w-full h-full text-accent"
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
            className={`${iconSizes[size]} text-accent`}
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
            className={`${iconSizes[size]} text-accent`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

