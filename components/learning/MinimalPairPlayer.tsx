'use client'

import { useState, useRef } from 'react'
import { getMinPairPath, audioFileExists } from '@/lib/utils/audioManifest'
import { speakGeorgian, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'

interface MinimalPairPlayerProps {
  pairId: string
  letters: string[]
  description?: string
  className?: string
}

/**
 * Minimal Pair Player Component
 * 
 * Plays minimal pair audio for sound discrimination practice.
 * Allows users to compare similar sounds (e.g., voiced vs aspirated vs ejective).
 */
export default function MinimalPairPlayer({
  pairId,
  letters,
  description,
  className = '',
}: MinimalPairPlayerProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioElementsRef = useRef<Map<number, HTMLAudioElement>>(new Map())

  const handlePlayLetter = async (letter: string, index: number) => {
    // Stop any current playback
    stopSpeaking()
    audioElementsRef.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })

    setIsLoading(true)
    setPlayingIndex(index)
    setHasError(false)

    try {
      // Try to play native minimal pair audio
      const audioPath = getMinPairPath(`${pairId}-${index}`)
      const exists = await audioFileExists(audioPath)

      if (exists) {
        const audio = new Audio(audioPath)
        audioElementsRef.current.set(index, audio)
        
        audio.onended = () => {
          setPlayingIndex(null)
          setIsLoading(false)
        }
        
        audio.onerror = () => {
          // Fallback to TTS
          stopSpeaking()
          speakGeorgian(letter, {
            onEnd: () => {
              setPlayingIndex(null)
              setIsLoading(false)
            },
          })
        }

        await audio.play()
      } else if (isSpeechSupported()) {
        // Fallback to TTS
        speakGeorgian(letter, {
          onEnd: () => {
            setPlayingIndex(null)
            setIsLoading(false)
          },
        })
      } else {
        throw new Error('Audio playback not available')
      }
    } catch (error) {
      console.error('Failed to play minimal pair audio:', error)
      setHasError(true)
      setPlayingIndex(null)
      setIsLoading(false)
    }
  }

  const handlePlayAll = async () => {
    // Play all letters in sequence
    for (let i = 0; i < letters.length; i++) {
      await handlePlayLetter(letters[i], i)
      // Wait for playback to complete before playing next
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-gray-600 font-sans">{description}</p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          {letters.map((letter, index) => (
            <button
              key={`${pairId}-${index}`}
              onClick={() => handlePlayLetter(letter, index)}
              disabled={isLoading}
              className={`
                flex items-center justify-center gap-2
                px-4 py-3
                rounded-lg
                border-2
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                ${
                  playingIndex === index
                    ? 'bg-accent/20 border-accent shadow-lg scale-105'
                    : 'bg-white/50 border-gray-200 hover:border-accent hover:bg-accent/10'
                }
              `}
              aria-label={`Play ${letter}`}
            >
              <span className="text-2xl font-serif font-bold text-primary-900">
                {letter}
              </span>
              
              <AnimatePresence mode="wait">
                {playingIndex === index && isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4 animate-spin"
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
                ) : playingIndex === index ? (
                  <motion.svg
                    key="playing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-4 h-4 text-accent"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="play"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <button
          onClick={handlePlayAll}
          disabled={isLoading}
          className={`
            w-full
            px-4 py-2
            rounded-lg
            bg-accent/10 hover:bg-accent/20
            border border-accent/30
            text-sm font-sans font-medium text-accent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          `}
        >
          Play All in Sequence
        </button>
      </div>
    </GlassCard>
  )
}

