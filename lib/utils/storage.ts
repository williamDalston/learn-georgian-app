/**
 * Enhanced localStorage utilities with error handling and quota management
 */

import logger from './logger'

export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'StorageError'
  }
}

interface StorageOptions {
  fallbackToMemory?: boolean
  compress?: boolean
}

class StorageManager {
  private memoryStorage = new Map<string, string>()

  /**
   * Get item from storage with fallback to memory
   */
  getItem(key: string, options: StorageOptions = {}): string | null {
    try {
      if (typeof window === 'undefined') {
        // Server-side: use memory storage
        return this.memoryStorage.get(key) || null
      }

      return localStorage.getItem(key)
    } catch (error) {
      logger.warn('Failed to read from localStorage', {
        context: 'storage',
        data: { key, error },
      })

      if (options.fallbackToMemory) {
        return this.memoryStorage.get(key) || null
      }

      throw new StorageError('Failed to read from storage', error)
    }
  }

  /**
   * Set item in storage with quota handling
   */
  setItem(
    key: string,
    value: string,
    options: StorageOptions = {}
  ): void {
    try {
      if (typeof window === 'undefined') {
        // Server-side: use memory storage
        this.memoryStorage.set(key, value)
        return
      }

      localStorage.setItem(key, value)
    } catch (error) {
      const err = error as Error & { name?: string; code?: number }

      // Handle quota exceeded error
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        logger.error('Storage quota exceeded', {
          context: 'storage',
          data: { key, valueLength: value.length },
        })

        // Try to free up space
        this.cleanupOldData()

        try {
          // Try again after cleanup
          localStorage.setItem(key, value)
          return
        } catch (retryError) {
          // Still failing, try memory storage if enabled
          if (options.fallbackToMemory) {
            logger.warn('Falling back to memory storage', {
              context: 'storage',
              data: { key },
            })
            this.memoryStorage.set(key, value)
            return
          }

          throw new StorageError(
            'Storage quota exceeded and cleanup failed',
            retryError
          )
        }
      }

      throw new StorageError('Failed to write to storage', error)
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    try {
      if (typeof window === 'undefined') {
        this.memoryStorage.delete(key)
        return
      }

      localStorage.removeItem(key)
      this.memoryStorage.delete(key)
    } catch (error) {
      logger.warn('Failed to remove from localStorage', {
        context: 'storage',
        data: { key, error },
      })
    }
  }

  /**
   * Clear all storage (be careful!)
   */
  clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
      this.memoryStorage.clear()
    } catch (error) {
      logger.warn('Failed to clear storage', {
        context: 'storage',
        data: { error },
      })
    }
  }

  /**
   * Get estimated storage usage
   */
  getStorageUsage(): { used: number; quota: number; percentage: number } {
    if (typeof window === 'undefined') {
      return { used: 0, quota: 0, percentage: 0 }
    }

    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }

      // Estimate quota (most browsers use ~5-10MB)
      const quota = 5 * 1024 * 1024 // 5MB estimate
      const used = total * 2 // Rough estimate (UTF-16 encoding)

      return {
        used,
        quota,
        percentage: (used / quota) * 100,
      }
    } catch (error) {
      logger.warn('Failed to estimate storage usage', {
        context: 'storage',
        data: { error },
      })
      return { used: 0, quota: 0, percentage: 0 }
    }
  }

  /**
   * Cleanup old or non-essential data
   */
  private cleanupOldData(): void {
    if (typeof window === 'undefined') return

    try {
      const keysToPreserve = [
        'userEmail',
        'isAuthenticated',
        'userProgress',
        'completedLessons',
      ]

      // Remove old/unused keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && !keysToPreserve.includes(key)) {
          localStorage.removeItem(key)
        }
      }

      logger.info('Cleaned up old storage data', {
        context: 'storage',
      })
    } catch (error) {
      logger.warn('Failed to cleanup storage', {
        context: 'storage',
        data: { error },
      })
    }
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const storage = new StorageManager()

/**
 * Helper functions for common storage operations
 */
export const storageHelpers = {
  /**
   * Get JSON from storage
   */
  getJSON<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = storage.getItem(key, { fallbackToMemory: true })
      return item ? (JSON.parse(item) as T) : defaultValue || null
    } catch (error) {
      logger.error('Failed to parse JSON from storage', {
        context: 'storage',
        data: { key, error },
      })
      return defaultValue || null
    }
  },

  /**
   * Set JSON to storage
   */
  setJSON<T>(key: string, value: T): void {
    try {
      const json = JSON.stringify(value)
      storage.setItem(key, json, { fallbackToMemory: true })
    } catch (error) {
      logger.error('Failed to stringify JSON for storage', {
        context: 'storage',
        data: { key, error },
      })
      throw error
    }
  },

  /**
   * Remove multiple keys
   */
  removeMultiple(keys: string[]): void {
    keys.forEach((key) => storage.removeItem(key))
  },
}

