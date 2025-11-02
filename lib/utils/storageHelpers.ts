/**
 * Storage utilities with error handling and graceful degradation
 * Handles localStorage quota errors and provides fallback strategies
 */

interface StorageResult<T> {
  success: boolean
  data?: T
  error?: Error
}

/**
 * Safe localStorage get with error handling
 */
export function getFromStorage<T>(key: string): StorageResult<T> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: new Error('Window is not defined') }
    }

    const item = localStorage.getItem(key)
    if (item === null) {
      return { success: true, data: undefined }
    }

    const parsed = JSON.parse(item) as T
    return { success: true, data: parsed }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    return { success: false, error: err }
  }
}

/**
 * Safe localStorage set with error handling and quota management
 */
export function setInStorage<T>(
  key: string,
  value: T,
  options?: {
    onQuotaExceeded?: () => void
    compress?: boolean
  }
): StorageResult<void> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: new Error('Window is not defined') }
    }

    const stringified = JSON.stringify(value)
    localStorage.setItem(key, stringified)
    return { success: true }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))

    // Handle quota exceeded error
    if (
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) {
      // Try to free up space
      const freed = freeStorageSpace()
      
      if (options?.onQuotaExceeded) {
        options.onQuotaExceeded()
      }

      if (freed) {
        // Retry once after freeing space
        try {
          const stringified = JSON.stringify(value)
          localStorage.setItem(key, stringified)
          return { success: true }
        } catch (retryError) {
          return {
            success: false,
            error: new Error('Storage quota exceeded and cleanup failed'),
          }
        }
      }

      return {
        success: false,
        error: new Error('Storage quota exceeded. Please clear some data.'),
      }
    }

    return { success: false, error: err }
  }
}

/**
 * Safe localStorage remove
 */
export function removeFromStorage(key: string): StorageResult<void> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: new Error('Window is not defined') }
    }

    localStorage.removeItem(key)
    return { success: true }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    return { success: false, error: err }
  }
}

/**
 * Clear all storage (with optional prefix filter)
 */
export function clearStorage(prefix?: string): StorageResult<void> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: new Error('Window is not defined') }
    }

    if (prefix) {
      // Clear only keys with prefix
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))
    } else {
      localStorage.clear()
    }

    return { success: true }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    return { success: false, error: err }
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): {
  used: number
  quota: number
  percentage: number
  available: number
} {
  if (typeof navigator === 'undefined' || !('storage' in navigator)) {
    return { used: 0, quota: 0, percentage: 0, available: 0 }
  }

  try {
    // Calculate used space
    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Estimate quota (browsers typically allow 5-10MB)
    const quota = 5 * 1024 * 1024 // 5MB estimate
    const percentage = (used / quota) * 100
    const available = quota - used

    return { used, quota, percentage, available }
  } catch {
    return { used: 0, quota: 0, percentage: 0, available: 0 }
  }
}

/**
 * Free up storage space by removing old/non-essential data
 */
function freeStorageSpace(): boolean {
  try {
    // Strategy: Remove old cached data, old sessions, etc.
    // This is a basic implementation - can be customized based on app needs
    
    const keysToRemove: string[] = []
    const now = Date.now()
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days

    // Remove old cache entries (example)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('cache_')) {
        try {
          const item = localStorage.getItem(key)
          if (item) {
            const parsed = JSON.parse(item)
            if (parsed.timestamp && now - parsed.timestamp > maxAge) {
              keysToRemove.push(key)
            }
          }
        } catch {
          // If we can't parse, remove it
          keysToRemove.push(key)
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
    return keysToRemove.length > 0
  } catch {
    return false
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

