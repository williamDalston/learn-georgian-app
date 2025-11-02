/**
 * Audio Hook
 * 
 * React hook for easy audio playback with fallback to TTS
 * Provides state management and automatic fallback handling
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  playLetterAudio,
  playVocabularyAudio,
  playPhraseAudio,
  type AudioLoadOptions,
} from '@/lib/utils/audioLoader'
import { getMinPairPath } from '@/lib/utils/audioManifest'
import { speakGeorgian, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'
import { audioFileExists } from '@/lib/utils/audioManifest'
import logger from '@/lib/utils/logger'

export interface UseAudioOptions {
  fallbackToTTS?: boolean
  autoPlay?: boolean
  onPlay?: () => void
  onStop?: () => void
  onError?: (error: Error) => void
  onEnd?: () => void
}

export interface UseAudioReturn {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  error: Error | null
  play: () => Promise<void>
  stop: () => void
  pause: () => void
  resume: () => void
  audioElement: HTMLAudioElement | null
}

/**
 * Hook for playing letter audio
 */
export function useLetterAudio(
  letter: string,
  options: UseAudioOptions = {}
): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async () => {
    try {
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      stopSpeaking()

      setIsLoading(true)
      setIsPlaying(true)
      setHasError(false)
      setError(null)
      options.onPlay?.()

      const audio = await playLetterAudio(letter, {
        fallbackToTTS: options.fallbackToTTS !== false,
        onError: (err) => {
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
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
          options.onEnd?.()
        }
        audio.onerror = () => {
          const err = new Error('Audio playback failed')
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
        }
      } else {
        // TTS fallback - estimate duration
        setTimeout(() => {
          setIsPlaying(false)
          setIsLoading(false)
          options.onEnd?.()
        }, letter.length * 150) // Rough estimate
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Audio playback failed')
      setError(error)
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
      options.onError?.(error)
    }
  }, [letter, options])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()
    setIsPlaying(false)
    setIsLoading(false)
    options.onStop?.()
  }, [options])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    stopSpeaking()
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err instanceof Error ? err : new Error('Resume failed'))
        setHasError(true)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  // Auto-play if requested
  useEffect(() => {
    if (options.autoPlay && letter) {
      play()
    }
  }, [options.autoPlay, letter, play])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    stop,
    pause,
    resume,
    audioElement: audioRef.current,
  }
}

/**
 * Hook for playing vocabulary audio
 */
export function useVocabularyAudio(
  word: string,
  lessonId?: string,
  options: UseAudioOptions = {}
): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      stopSpeaking()

      setIsLoading(true)
      setIsPlaying(true)
      setHasError(false)
      setError(null)
      options.onPlay?.()

      const audio = await playVocabularyAudio(word, lessonId, {
        fallbackToTTS: options.fallbackToTTS !== false,
        onError: (err) => {
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
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
          options.onEnd?.()
        }
        audio.onerror = () => {
          const err = new Error('Audio playback failed')
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
        }
      } else {
        setTimeout(() => {
          setIsPlaying(false)
          setIsLoading(false)
          options.onEnd?.()
        }, word.length * 150)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Audio playback failed')
      setError(error)
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
      options.onError?.(error)
    }
  }, [word, lessonId, options])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()
    setIsPlaying(false)
    setIsLoading(false)
    options.onStop?.()
  }, [options])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    stopSpeaking()
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err instanceof Error ? err : new Error('Resume failed'))
        setHasError(true)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  useEffect(() => {
    if (options.autoPlay && word) {
      play()
    }
  }, [options.autoPlay, word, play])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    stop,
    pause,
    resume,
    audioElement: audioRef.current,
  }
}

/**
 * Hook for playing minimal pair audio
 */
export function useMinimalPairAudio(
  pairId: string | null,
  options: UseAudioOptions = {}
): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async () => {
    if (!pairId) return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      stopSpeaking()

      setIsLoading(true)
      setIsPlaying(true)
      setHasError(false)
      setError(null)
      options.onPlay?.()

      const audioUrl = getMinPairPath(pairId)
      const exists = await audioFileExists(audioUrl)

      if (exists) {
        const audio = new Audio(audioUrl)
        audio.preload = 'auto'
        
        audio.onloadeddata = () => {
          setIsLoading(false)
        }

        audio.onended = () => {
          setIsPlaying(false)
          setIsLoading(false)
          options.onEnd?.()
        }

        audio.onerror = () => {
          const err = new Error(`Failed to load audio: ${audioUrl}`)
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
        }

        audioRef.current = audio
        await audio.play()
      } else if (options.fallbackToTTS !== false && isSpeechSupported()) {
        // For minimal pairs, we might not have a single text to speak
        // So we skip TTS fallback for now
        setIsLoading(false)
        setIsPlaying(false)
        const err = new Error(`Audio file not found: ${audioUrl}`)
        setError(err)
        setHasError(true)
        options.onError?.(err)
      } else {
        const err = new Error(`Audio file not found: ${audioUrl}`)
        setError(err)
        setHasError(true)
        setIsPlaying(false)
        setIsLoading(false)
        options.onError?.(err)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Audio playback failed')
      setError(error)
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
      options.onError?.(error)
    }
  }, [pairId, options])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()
    setIsPlaying(false)
    setIsLoading(false)
    options.onStop?.()
  }, [options])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    stopSpeaking()
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err instanceof Error ? err : new Error('Resume failed'))
        setHasError(true)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    stop,
    pause,
    resume,
    audioElement: audioRef.current,
  }
}

/**
 * Generic hook for playing audio from a URL
 */
export function useAudio(
  audioUrl: string | null,
  options: UseAudioOptions = {}
): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async () => {
    if (!audioUrl) return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      stopSpeaking()

      setIsLoading(true)
      setIsPlaying(true)
      setHasError(false)
      setError(null)
      options.onPlay?.()

      const exists = await audioFileExists(audioUrl)

      if (exists) {
        const audio = new Audio(audioUrl)
        audio.preload = 'auto'
        
        audio.onloadeddata = () => {
          setIsLoading(false)
        }

        audio.onended = () => {
          setIsPlaying(false)
          setIsLoading(false)
          options.onEnd?.()
        }

        audio.onerror = () => {
          const err = new Error(`Failed to load audio: ${audioUrl}`)
          setError(err)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
          options.onError?.(err)
        }

        audioRef.current = audio
        await audio.play()
      } else {
        const err = new Error(`Audio file not found: ${audioUrl}`)
        setError(err)
        setHasError(true)
        setIsPlaying(false)
        setIsLoading(false)
        options.onError?.(err)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Audio playback failed')
      setError(error)
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
      options.onError?.(error)
    }
  }, [audioUrl, options])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    stopSpeaking()
    setIsPlaying(false)
    setIsLoading(false)
    options.onStop?.()
  }, [options])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    stopSpeaking()
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err instanceof Error ? err : new Error('Resume failed'))
        setHasError(true)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  useEffect(() => {
    if (options.autoPlay && audioUrl) {
      play()
    }
  }, [options.autoPlay, audioUrl, play])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    isPlaying,
    isLoading,
    hasError,
    error,
    play,
    stop,
    pause,
    resume,
    audioElement: audioRef.current,
  }
}

