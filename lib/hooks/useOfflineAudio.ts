/**
 * Hook for Offline Audio Support
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Manages offline audio caching and playback
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getCachedAudio,
  preloadAudioForOffline,
  clearAudioCacheIfNeeded,
  DEFAULT_MOBILE_CONFIG,
  type MobileAudioConfig,
} from '@/lib/utils/mobileAudio'
import logger from '@/lib/utils/logger'

export interface UseOfflineAudioReturn {
  isCaching: boolean
  cacheProgress: number
  cachedCount: number
  totalCount: number
  preloadAudio: (urls: string[]) => Promise<void>
  getCached: (url: string) => Promise<Response | null>
  clearCache: () => Promise<void>
}

/**
 * Hook to manage offline audio caching
 */
export function useOfflineAudio(
  config: MobileAudioConfig = DEFAULT_MOBILE_CONFIG
): UseOfflineAudioReturn {
  const [isCaching, setIsCaching] = useState(false)
  const [cacheProgress, setCacheProgress] = useState(0)
  const [cachedCount, setCachedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const preloadAudio = useCallback(
    async (urls: string[]) => {
      if (!config.enableOfflineCache) return

      setIsCaching(true)
      setTotalCount(urls.length)
      setCachedCount(0)
      setCacheProgress(0)

      try {
        let loaded = 0

        // Preload with progress tracking
        for (const url of urls) {
          try {
            await preloadAudioForOffline([url], config)
            loaded++
            setCachedCount(loaded)
            setCacheProgress((loaded / urls.length) * 100)
          } catch (error) {
            logger.debug(`Failed to preload audio: ${url}`, {
              context: 'useOfflineAudio',
              error: error as Error,
            })
          }
        }

        // Clean up cache if needed
        await clearAudioCacheIfNeeded(config)
      } catch (error) {
        logger.error('Failed to preload audio', {
          context: 'useOfflineAudio',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      } finally {
        setIsCaching(false)
      }
    },
    [config]
  )

  const getCached = useCallback(
    async (url: string): Promise<Response | null> => {
      try {
        return await getCachedAudio(url)
      } catch (error) {
        logger.debug(`Failed to get cached audio: ${url}`, {
          context: 'useOfflineAudio',
          error: error as Error,
        })
        return null
      }
    },
    []
  )

  const clearCache = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('audio-cache-v1')
        const keys = await cache.keys()
        await Promise.all(keys.map((key) => cache.delete(key)))
        setCachedCount(0)
        setTotalCount(0)
        setCacheProgress(0)
      }
    } catch (error) {
      logger.error('Failed to clear audio cache', {
        context: 'useOfflineAudio',
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }, [])

  return {
    isCaching,
    cacheProgress,
    cachedCount,
    totalCount,
    preloadAudio,
    getCached,
    clearCache,
  }
}

