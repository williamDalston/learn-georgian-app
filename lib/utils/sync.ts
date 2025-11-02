/**
 * Data synchronization utilities with retry logic and conflict resolution
 */

import { storageHelpers } from './storage'
import { apiClient } from './apiClient'
import logger from './logger'
import type { ProgressData } from '@/lib/types/api'

interface SyncOptions {
  maxRetries?: number
  retryDelay?: number
  onConflict?: 'local' | 'remote' | 'merge'
}

interface SyncResult {
  success: boolean
  synced: boolean
  conflict?: boolean
  error?: Error
}

/**
 * Sync progress data to backend with retry logic
 */
export async function syncProgress(
  progress: ProgressData,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onConflict = 'merge',
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Get remote progress for conflict detection
      let remoteProgress: ProgressData | null = null
      try {
        const remote = await apiClient.get<{ progress: ProgressData }>('/api/progress/sync')
        remoteProgress = remote.progress
      } catch (error) {
        logger.warn('Failed to fetch remote progress', {
          context: 'sync',
          data: { error },
        })
      }

      // Check for conflicts
      const localProgress = storageHelpers.getJSON<ProgressData>('userProgress')
      if (remoteProgress && localProgress) {
        const conflict = detectConflict(localProgress, remoteProgress)
        if (conflict) {
          logger.warn('Progress conflict detected', {
            context: 'sync',
            data: { local: localProgress, remote: remoteProgress },
          })

          // Resolve conflict
          const resolved = resolveConflict(localProgress, remoteProgress, onConflict)
          
          // Sync resolved progress
          await apiClient.post('/api/progress/sync', { progress: resolved })
          
          // Update local storage
          storageHelpers.setJSON('userProgress', resolved)
          
          return {
            success: true,
            synced: true,
            conflict: true,
          }
        }
      }

      // No conflict, sync normally
      await apiClient.post('/api/progress/sync', { progress })
      
      return {
        success: true,
        synced: true,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff
        logger.warn(`Sync failed, retrying in ${delay}ms`, {
          context: 'sync',
          data: { attempt: attempt + 1, maxRetries, error },
        })
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  return {
    success: false,
    synced: false,
    error: lastError || new Error('Sync failed after retries'),
  }
}

/**
 * Detect conflicts between local and remote progress
 */
function detectConflict(local: ProgressData, remote: ProgressData): boolean {
  // Consider it a conflict if remote has more progress than local
  // This indicates progress was made on another device
  return remote.completedLessons > local.completedLessons ||
         remote.totalTime > local.totalTime ||
         remote.currentStreak > local.currentStreak
}

/**
 * Resolve conflict between local and remote progress
 */
function resolveConflict(
  local: ProgressData,
  remote: ProgressData,
  strategy: 'local' | 'remote' | 'merge'
): ProgressData {
  switch (strategy) {
    case 'local':
      return local
    case 'remote':
      return remote
    case 'merge':
      // Merge by taking maximum values (most progress wins)
      return {
        daysPracticed: Math.max(local.daysPracticed, remote.daysPracticed),
        totalTime: Math.max(local.totalTime, remote.totalTime),
        currentStreak: Math.max(local.currentStreak, remote.currentStreak),
        totalLessons: Math.max(local.totalLessons, remote.totalLessons),
        completedLessons: Math.max(local.completedLessons, remote.completedLessons),
      }
    default:
      return remote
  }
}

/**
 * Sync completed lessons list
 */
export async function syncCompletedLessons(
  lessonIds: string[],
  options: SyncOptions = {}
): Promise<SyncResult> {
  const { maxRetries = 3, retryDelay = 1000 } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // This would sync the completed lessons list
      // For now, just update local storage
      storageHelpers.setJSON('completedLessons', lessonIds)
      
      return {
        success: true,
        synced: true,
      }
    } catch (error) {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
      } else {
        return {
          success: false,
          synced: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }
      }
    }
  }

  return {
    success: false,
    synced: false,
    error: new Error('Sync failed'),
  }
}

/**
 * Periodic sync with exponential backoff on failure
 */
export class PeriodicSyncer {
  private intervalId: NodeJS.Timeout | null = null
  private isSyncing = false
  private failedAttempts = 0
  private baseInterval = 60000 // 1 minute
  private maxInterval = 3600000 // 1 hour

  constructor(
    private syncFn: () => Promise<SyncResult>,
    private interval: number = 60000
  ) {}

  start(): void {
    if (this.intervalId) {
      return
    }

    this.scheduleNextSync()
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }
    this.failedAttempts = 0
  }

  private async sync(): Promise<void> {
    if (this.isSyncing) {
      return
    }

    this.isSyncing = true

    try {
      const result = await this.syncFn()
      
      if (result.success) {
        this.failedAttempts = 0
      } else {
        this.failedAttempts++
      }
    } catch (error) {
      logger.error('Periodic sync failed', {
        context: 'sync',
        error: error instanceof Error ? error : new Error(String(error)),
      })
      this.failedAttempts++
    } finally {
      this.isSyncing = false
      this.scheduleNextSync()
    }
  }

  private scheduleNextSync(): void {
    // Exponential backoff on failure
    const delay = this.failedAttempts > 0
      ? Math.min(this.baseInterval * Math.pow(2, this.failedAttempts), this.maxInterval)
      : this.interval

    this.intervalId = setTimeout(() => this.sync(), delay)
  }
}


