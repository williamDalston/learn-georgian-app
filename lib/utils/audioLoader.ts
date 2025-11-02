/**
 * Audio Loader Utilities
 * 
 * Handles loading, caching, and management of audio files.
 * Provides fallback mechanisms and error handling.
 * 
 * Agent 15: Enhanced with mobile optimizations
 */

import {
  getLetterAudioUrl,
  getVocabularyAudioUrl,
  getPhraseAudioUrl,
  audioFileExists,
  type AudioManifestEntry,
} from './audioManifest'
import { speakGeorgian, stopSpeaking, isSpeechSupported } from './text-to-speech'
import {
  isMobileDevice,
  createMobileAudioElement,
  getOptimizedAudioUrl,
  getCachedAudio,
  DEFAULT_MOBILE_CONFIG,
} from './mobileAudio'

/**
 * Audio loading options
 */
export interface AudioLoadOptions {
  fallbackToTTS?: boolean
  preload?: boolean
  onError?: (error: Error) => void
  onLoad?: () => void
}

/**
 * Audio player state
 */
export interface AudioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  hasError: boolean
  error?: Error
  duration?: number
  currentTime?: number
}

/**
 * Create an HTML5 Audio element with error handling
 * Agent 15: Enhanced with mobile optimizations
 */
export function createAudioElement(
  url: string,
  options: AudioLoadOptions = {}
): HTMLAudioElement {
  // Use mobile-optimized audio element on mobile devices
  if (isMobileDevice()) {
    return createMobileAudioElement(url, DEFAULT_MOBILE_CONFIG)
  }
  
  const audio = new Audio()
  
  // Configure audio element
  audio.preload = options.preload ? 'auto' : 'metadata'
  
  // Use optimized URL for mobile
  const optimizedUrl = getOptimizedAudioUrl(url)
  audio.src = optimizedUrl
  
  // Error handling
  audio.onerror = (e) => {
    const error = new Error(`Failed to load audio: ${url}`)
    console.error('Audio loading error:', error)
    options.onError?.(error)
  }
  
  audio.onloadeddata = () => {
    options.onLoad?.()
  }
  
  return audio
}

/**
 * Load and play letter audio with fallback
 */
export async function playLetterAudio(
  letter: string,
  options: AudioLoadOptions = {}
): Promise<HTMLAudioElement | null> {
  const audioUrl = getLetterAudioUrl(letter)
  
  // Check if audio file exists
  const exists = await audioFileExists(audioUrl)
  
  if (exists) {
    // Play native audio
    const audio = createAudioElement(audioUrl, options)
    
    // Add ended event handler
    audio.onended = () => {
      options.onLoad?.()
    }
    
    try {
      await audio.play()
      return audio
    } catch (error) {
      console.error('Failed to play audio:', error)
      if (options.fallbackToTTS !== false) {
        // Fallback to TTS
        stopSpeaking()
        speakGeorgian(letter, {
          onError: options.onError,
        })
      } else {
        options.onError?.(error as Error)
      }
      return null
    }
  } else if (options.fallbackToTTS !== false && isSpeechSupported()) {
    // Fallback to TTS if audio doesn't exist
    stopSpeaking()
    speakGeorgian(letter, {
      onError: options.onError,
    })
    return null
  } else {
    const error = new Error(`Audio file not found: ${audioUrl}`)
    options.onError?.(error)
    return null
  }
}

/**
 * Load and play vocabulary audio with fallback
 */
export async function playVocabularyAudio(
  word: string,
  lessonId?: string,
  options: AudioLoadOptions = {}
): Promise<HTMLAudioElement | null> {
  const audioUrl = getVocabularyAudioUrl(word, lessonId)
  
  // Check if audio file exists
  const exists = await audioFileExists(audioUrl)
  
  if (exists) {
    // Play native audio
    const audio = createAudioElement(audioUrl, options)
    
    // Add ended event handler
    audio.onended = () => {
      options.onLoad?.()
    }
    
    try {
      await audio.play()
      return audio
    } catch (error) {
      console.error('Failed to play audio:', error)
      if (options.fallbackToTTS !== false) {
        // Fallback to TTS
        stopSpeaking()
        speakGeorgian(word, {
          onError: options.onError,
        })
      } else {
        options.onError?.(error as Error)
      }
      return null
    }
  } else if (options.fallbackToTTS !== false && isSpeechSupported()) {
    // Fallback to TTS if audio doesn't exist
    stopSpeaking()
    speakGeorgian(word, {
      onError: options.onError,
    })
    return null
  } else {
    const error = new Error(`Audio file not found: ${audioUrl}`)
    options.onError?.(error)
    return null
  }
}

/**
 * Load and play phrase audio with fallback
 */
export async function playPhraseAudio(
  phrase: string,
  lessonId?: string,
  options: AudioLoadOptions = {}
): Promise<HTMLAudioElement | null> {
  const audioUrl = getPhraseAudioUrl(phrase, lessonId)
  
  // Check if audio file exists
  const exists = await audioFileExists(audioUrl)
  
  if (exists) {
    // Play native audio
    const audio = createAudioElement(audioUrl, options)
    
    // Add ended event handler
    audio.onended = () => {
      options.onLoad?.()
    }
    
    try {
      await audio.play()
      return audio
    } catch (error) {
      console.error('Failed to play audio:', error)
      if (options.fallbackToTTS !== false) {
        // Fallback to TTS
        stopSpeaking()
        speakGeorgian(phrase, {
          onError: options.onError,
        })
      } else {
        options.onError?.(error as Error)
      }
      return null
    }
  } else if (options.fallbackToTTS !== false && isSpeechSupported()) {
    // Fallback to TTS if audio doesn't exist
    stopSpeaking()
    speakGeorgian(phrase, {
      onError: options.onError,
    })
    return null
  } else {
    const error = new Error(`Audio file not found: ${audioUrl}`)
    options.onError?.(error)
    return null
  }
}

/**
 * Load and play minimal pair audio
 */
export async function playMinimalPairAudio(
  pairId: string,
  options: AudioLoadOptions = {}
): Promise<HTMLAudioElement | null> {
  const { getMinPairPath } = await import('./audioManifest')
  const audioUrl = getMinPairPath(pairId)
  
  // Check if audio file exists
  const exists = await audioFileExists(audioUrl)
  
  if (exists) {
    // Play native audio
    const audio = createAudioElement(audioUrl, options)
    
    // Add ended event handler
    audio.onended = () => {
      options.onLoad?.()
    }
    
    try {
      await audio.play()
      return audio
    } catch (error) {
      console.error('Failed to play minimal pair audio:', error)
      options.onError?.(error as Error)
      return null
    }
  } else {
    const error = new Error(`Minimal pair audio file not found: ${audioUrl}`)
    options.onError?.(error)
    return null
  }
}

/**
 * Preload audio files for better performance
 */
export async function preloadAudio(urls: string[]): Promise<void> {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.onloadeddata = () => resolve()
      audio.onerror = () => resolve() // Continue even if some fail
      audio.src = url
    })
  })
  
  await Promise.all(promises)
}

/**
 * Audio cache for frequently used audio files
 */
class AudioCache {
  private cache = new Map<string, HTMLAudioElement>()
  private maxSize = 50 // Maximum number of cached audio elements
  
  get(url: string): HTMLAudioElement | undefined {
    return this.cache.get(url)
  }
  
  set(url: string, audio: HTMLAudioElement): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(url, audio)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  has(url: string): boolean {
    return this.cache.has(url)
  }
}

// Global audio cache instance
export const audioCache = new AudioCache()

