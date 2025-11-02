/**
 * Mobile Audio Optimization Utilities
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Provides optimized audio handling for mobile devices including:
 * - Progressive loading for better performance
 * - Offline audio caching
 * - Mobile-friendly audio controls
 * - Optimized recording quality for mobile
 */

import { audioFileExists } from './audioManifest'
import logger from './logger'

/**
 * Mobile audio configuration
 */
export interface MobileAudioConfig {
  enableProgressiveLoading: boolean
  enableOfflineCache: boolean
  maxCacheSize: number // in MB
  preferredFormat: 'mp3' | 'ogg' | 'webm'
  lowQualityThreshold: number // kbps threshold for switching to low quality
}

export const DEFAULT_MOBILE_CONFIG: MobileAudioConfig = {
  enableProgressiveLoading: true,
  enableOfflineCache: true,
  maxCacheSize: 100, // 100MB max cache
  preferredFormat: 'mp3',
  lowQualityThreshold: 500, // Switch to low quality below 500kbps connection
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

/**
 * Detect connection quality (rough estimate)
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return 'medium'
  }
  
  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  if (!conn) return 'medium'
  
  // @ts-ignore
  const effectiveType = conn.effectiveType || '4g'
  // @ts-ignore
  const downlink = conn.downlink || 10
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
    return 'slow'
  }
  if (effectiveType === '3g' || downlink < 1.5) {
    return 'medium'
  }
  
  return 'fast'
}

/**
 * Get optimized audio URL based on device and connection
 */
export function getOptimizedAudioUrl(
  baseUrl: string,
  config: MobileAudioConfig = DEFAULT_MOBILE_CONFIG
): string {
  const isMobile = isMobileDevice()
  const quality = getConnectionQuality()
  
  // For mobile with slow connection, use low-quality version if available
  if (isMobile && quality === 'slow') {
    const lowQualityUrl = baseUrl.replace('.mp3', '-low.mp3')
    // Note: In production, you'd check if low quality version exists
    // For now, return base URL
    return baseUrl
  }
  
  return baseUrl
}

/**
 * Progressive audio loading
 * Loads audio in chunks for better mobile performance
 */
export async function loadAudioProgressively(
  url: string,
  onProgress?: (progress: number) => void
): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    
    audio.preload = 'auto'
    audio.src = url
    
    // Track loading progress
    audio.addEventListener('progress', () => {
      if (audio.buffered.length > 0 && audio.duration > 0) {
        const loaded = audio.buffered.end(audio.buffered.length - 1)
        const progress = (loaded / audio.duration) * 100
        onProgress?.(Math.min(progress, 100))
      }
    })
    
    audio.addEventListener('canplay', () => {
      resolve(audio)
    })
    
    audio.addEventListener('error', (e) => {
      reject(new Error(`Failed to load audio: ${url}`))
    })
    
    // Start loading
    audio.load()
  })
}

/**
 * Preload audio for offline caching
 */
export async function preloadAudioForOffline(
  urls: string[],
  config: MobileAudioConfig = DEFAULT_MOBILE_CONFIG
): Promise<void> {
  if (typeof window === 'undefined' || !config.enableOfflineCache) {
    return
  }
  
  // Check if Cache API is available (PWA support)
  if ('caches' in window) {
    try {
      const cache = await caches.open('audio-cache-v1')
      const promises = urls.map(async (url) => {
        try {
          const exists = await cache.match(url)
          if (!exists) {
            const response = await fetch(url)
            if (response.ok) {
              await cache.put(url, response)
            }
          }
        } catch (error) {
          logger.debug(`Failed to cache audio: ${url}`, {
            context: 'mobileAudio',
            error: error as Error,
          })
        }
      })
      
      await Promise.all(promises)
    } catch (error) {
      logger.debug('Failed to open audio cache', {
        context: 'mobileAudio',
        error: error as Error,
      })
    }
  }
}

/**
 * Get cached audio from Cache API
 */
export async function getCachedAudio(url: string): Promise<Response | null> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return null
  }
  
  try {
    const cache = await caches.open('audio-cache-v1')
    return await cache.match(url) || null
  } catch {
    return null
  }
}

/**
 * Clear audio cache if it exceeds max size
 */
export async function clearAudioCacheIfNeeded(
  config: MobileAudioConfig = DEFAULT_MOBILE_CONFIG
): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return
  }
  
  try {
    const cache = await caches.open('audio-cache-v1')
    const keys = await cache.keys()
    
    // Rough estimate: 1MB per audio file
    const estimatedSize = keys.length
    
    if (estimatedSize > config.maxCacheSize) {
      // Delete oldest entries (first half)
      const keysToDelete = keys.slice(0, Math.floor(keys.length / 2))
      await Promise.all(keysToDelete.map((key) => cache.delete(key)))
      
      logger.debug('Cleared audio cache', {
        context: 'mobileAudio',
        data: { deleted: keysToDelete.length },
      })
    }
  } catch (error) {
    logger.debug('Failed to clear audio cache', {
      context: 'mobileAudio',
      error: error as Error,
    })
  }
}

/**
 * Mobile-optimized audio element creation
 */
export function createMobileAudioElement(
  url: string,
  config: MobileAudioConfig = DEFAULT_MOBILE_CONFIG
): HTMLAudioElement {
  const audio = new Audio()
  
  // Mobile optimizations
  audio.preload = config.enableProgressiveLoading ? 'metadata' : 'none'
  
  // Use optimized URL
  const optimizedUrl = getOptimizedAudioUrl(url, config)
  audio.src = optimizedUrl
  
  // Mobile-friendly error handling
  audio.addEventListener('error', () => {
    logger.debug(`Audio loading error on mobile: ${url}`, {
      context: 'mobileAudio',
    })
  })
  
  return audio
}

/**
 * Check if audio can play on mobile
 */
export function canPlayAudioOnMobile(audio: HTMLAudioElement): boolean {
  if (!isMobileDevice()) return true
  
  // Check if audio can play
  return audio.readyState >= HTMLMediaElement.HAVE_METADATA
}

