/**
 * Hook for letter audio playback
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { playLetterAudio } from '@/lib/utils/audioLoader'

export interface UseLetterAudioReturn {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  error?: Error
  play: (letter: string) => Promise<void>
  stop: () => void
}

/**
 * Hook to manage letter audio playback
 */
export function useLetterAudio(): UseLetterAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async (letter: string) => {
    setIsLoading(true)
    setHasError(false)
    setError(undefined)
    
    try {
      await playLetterAudio(letter, {
        fallbackToTTS: true,
        onError: (err) => {
          setHasError(true)
          setError(err)
          setIsPlaying(false)
          setIsLoading(false)
        },
      })
      
      setIsPlaying(true)
      
      // Note: We can't directly track audio playback state from the loader
      // This is a simplified version. For better tracking, we'd need
      // to return the audio element from the loader.
      
      // Simulate audio completion after a short delay
      // In a real implementation, we'd track the audio element's ended event
      setTimeout(() => {
        setIsPlaying(false)
        setIsLoading(false)
      }, 2000) // Approximate duration
      
    } catch (err) {
      setHasError(true)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsPlaying(false)
      setIsLoading(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  return {
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    stop,
  }
}

