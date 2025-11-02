/**
 * Data export utilities for user data backup
 */

export interface UserData {
  progress?: {
    completedLessons?: string[]
    daysPracticed?: number
    totalTime?: number
    currentStreak?: number
    totalLessons?: number
    completedLessonsCount?: number
  }
  achievements?: string[]
  notes?: Record<string, string>
  settings?: Record<string, any>
  bookmarks?: string[]
  vocabulary?: Array<{
    georgian: string
    transliteration: string
    translation: string
    learned?: boolean
    lastReviewed?: string
  }>
  exportDate?: string
  version?: string
}

const EXPORT_VERSION = '1.0.0'

/**
 * Export all user data to JSON
 */
export function exportUserData(): UserData | null {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    const data: UserData = {
      exportDate: new Date().toISOString(),
      version: EXPORT_VERSION,
    }

    // Export progress
    const progress = localStorage.getItem('userProgress')
    const completedLessons = localStorage.getItem('completedLessons')
    
    if (progress || completedLessons) {
      data.progress = {}
      
      if (progress) {
        try {
          data.progress = { ...JSON.parse(progress) }
        } catch {
          // Ignore parse errors
        }
      }
      
      if (completedLessons) {
        try {
          data.progress.completedLessons = JSON.parse(completedLessons)
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Export achievements
    const achievements = localStorage.getItem('unlockedAchievements')
    if (achievements) {
      try {
        data.achievements = JSON.parse(achievements)
      } catch {
        // Ignore parse errors
      }
    }

    // Export notes
    const notes = localStorage.getItem('lessonNotes')
    if (notes) {
      try {
        data.notes = JSON.parse(notes)
      } catch {
        // Ignore parse errors
      }
    }

    // Export settings
    const settings = localStorage.getItem('userSettings')
    if (settings) {
      try {
        data.settings = JSON.parse(settings)
      } catch {
        // Ignore parse errors
      }
    }

    // Export bookmarks
    const bookmarks = localStorage.getItem('bookmarkedLessons')
    if (bookmarks) {
      try {
        data.bookmarks = JSON.parse(bookmarks)
      } catch {
        // Ignore parse errors
      }
    }

    // Export vocabulary (if exists)
    const vocabulary = localStorage.getItem('userVocabulary')
    if (vocabulary) {
      try {
        data.vocabulary = JSON.parse(vocabulary)
      } catch {
        // Ignore parse errors
      }
    }

    return data
  } catch (error) {
    console.error('Error exporting user data:', error)
    return null
  }
}

/**
 * Download user data as JSON file
 */
export function downloadUserData(): boolean {
  const data = exportUserData()
  if (!data) {
    return false
  }

  try {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `georgian-learning-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error downloading user data:', error)
    return false
  }
}

/**
 * Validate imported user data
 */
export function validateUserData(data: unknown): data is UserData {
  if (!data || typeof data !== 'object') {
    return false
  }

  const userData = data as Record<string, any>

  // Check for required structure
  if (userData.version && typeof userData.version !== 'string') {
    return false
  }

  // Validate progress structure if present
  if (userData.progress && typeof userData.progress !== 'object') {
    return false
  }

  // Validate achievements if present
  if (userData.achievements && !Array.isArray(userData.achievements)) {
    return false
  }

  // Validate notes if present
  if (userData.notes && typeof userData.notes !== 'object') {
    return false
  }

  return true
}

/**
 * Import user data from JSON
 */
export interface ImportResult {
  success: boolean
  imported: {
    progress?: boolean
    achievements?: boolean
    notes?: boolean
    settings?: boolean
    bookmarks?: boolean
    vocabulary?: boolean
  }
  errors: string[]
}

export function importUserData(
  data: UserData,
  options?: {
    merge?: boolean // Merge with existing data instead of replacing
    onConflict?: 'keep' | 'overwrite' | 'merge' // What to do on conflicts
  }
): ImportResult {
  const result: ImportResult = {
    success: false,
    imported: {},
    errors: [],
  }

  try {
    if (!validateUserData(data)) {
      result.errors.push('Invalid data format')
      return result
    }

    const merge = options?.merge ?? false
    const onConflict = options?.onConflict ?? 'overwrite'

    // Import progress
    if (data.progress) {
      try {
        if (merge) {
          const existing = localStorage.getItem('userProgress')
          const existingCompleted = localStorage.getItem('completedLessons')
          
          if (existing && onConflict === 'keep') {
            // Keep existing
          } else if (existing && onConflict === 'merge') {
            // Merge logic could go here
            const existingData = JSON.parse(existing)
            const merged = { ...existingData, ...data.progress }
            localStorage.setItem('userProgress', JSON.stringify(merged))
            result.imported.progress = true
          } else {
            // Overwrite
            localStorage.setItem('userProgress', JSON.stringify(data.progress))
            result.imported.progress = true
          }

          if (data.progress.completedLessons) {
            if (existingCompleted && onConflict === 'keep') {
              // Keep existing
            } else if (existingCompleted && onConflict === 'merge') {
              const existingIds = JSON.parse(existingCompleted)
              const merged = [...new Set([...existingIds, ...data.progress.completedLessons])]
              localStorage.setItem('completedLessons', JSON.stringify(merged))
            } else {
              localStorage.setItem('completedLessons', JSON.stringify(data.progress.completedLessons))
            }
          }
        } else {
          localStorage.setItem('userProgress', JSON.stringify(data.progress))
          if (data.progress.completedLessons) {
            localStorage.setItem('completedLessons', JSON.stringify(data.progress.completedLessons))
          }
          result.imported.progress = true
        }
      } catch (error) {
        result.errors.push(`Failed to import progress: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Import achievements
    if (data.achievements) {
      try {
        if (merge && onConflict === 'merge') {
          const existing = localStorage.getItem('unlockedAchievements')
          if (existing) {
            const existingIds = JSON.parse(existing)
            const merged = [...new Set([...existingIds, ...data.achievements])]
            localStorage.setItem('unlockedAchievements', JSON.stringify(merged))
          } else {
            localStorage.setItem('unlockedAchievements', JSON.stringify(data.achievements))
          }
        } else if (!merge || onConflict === 'overwrite') {
          localStorage.setItem('unlockedAchievements', JSON.stringify(data.achievements))
        }
        result.imported.achievements = true
      } catch (error) {
        result.errors.push(`Failed to import achievements: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Import notes
    if (data.notes) {
      try {
        if (merge && onConflict === 'merge') {
          const existing = localStorage.getItem('lessonNotes')
          if (existing) {
            const existingNotes = JSON.parse(existing)
            const merged = { ...existingNotes, ...data.notes }
            localStorage.setItem('lessonNotes', JSON.stringify(merged))
          } else {
            localStorage.setItem('lessonNotes', JSON.stringify(data.notes))
          }
        } else if (!merge || onConflict === 'overwrite') {
          localStorage.setItem('lessonNotes', JSON.stringify(data.notes))
        }
        result.imported.notes = true
      } catch (error) {
        result.errors.push(`Failed to import notes: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Import settings
    if (data.settings) {
      try {
        if (merge && onConflict === 'merge') {
          const existing = localStorage.getItem('userSettings')
          if (existing) {
            const existingSettings = JSON.parse(existing)
            const merged = { ...existingSettings, ...data.settings }
            localStorage.setItem('userSettings', JSON.stringify(merged))
          } else {
            localStorage.setItem('userSettings', JSON.stringify(data.settings))
          }
        } else if (!merge || onConflict === 'overwrite') {
          localStorage.setItem('userSettings', JSON.stringify(data.settings))
        }
        result.imported.settings = true
      } catch (error) {
        result.errors.push(`Failed to import settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Import bookmarks
    if (data.bookmarks) {
      try {
        if (merge && onConflict === 'merge') {
          const existing = localStorage.getItem('bookmarkedLessons')
          if (existing) {
            const existingBookmarks = JSON.parse(existing)
            const merged = [...new Set([...existingBookmarks, ...data.bookmarks])]
            localStorage.setItem('bookmarkedLessons', JSON.stringify(merged))
          } else {
            localStorage.setItem('bookmarkedLessons', JSON.stringify(data.bookmarks))
          }
        } else if (!merge || onConflict === 'overwrite') {
          localStorage.setItem('bookmarkedLessons', JSON.stringify(data.bookmarks))
        }
        result.imported.bookmarks = true
      } catch (error) {
        result.errors.push(`Failed to import bookmarks: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Import vocabulary
    if (data.vocabulary) {
      try {
        if (merge && onConflict === 'merge') {
          const existing = localStorage.getItem('userVocabulary')
          if (existing) {
            const existingVocab = JSON.parse(existing)
            const merged = [...existingVocab, ...data.vocabulary]
            localStorage.setItem('userVocabulary', JSON.stringify(merged))
          } else {
            localStorage.setItem('userVocabulary', JSON.stringify(data.vocabulary))
          }
        } else if (!merge || onConflict === 'overwrite') {
          localStorage.setItem('userVocabulary', JSON.stringify(data.vocabulary))
        }
        result.imported.vocabulary = true
      } catch (error) {
        result.errors.push(`Failed to import vocabulary: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    result.success = result.errors.length === 0
    return result
  } catch (error) {
    result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Handle file upload and import
 */
export async function importFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text) as UserData
        const result = importUserData(data, { merge: true, onConflict: 'merge' })
        resolve(result)
      } catch (error) {
        resolve({
          success: false,
          imported: {},
          errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        })
      }
    }

    reader.onerror = () => {
      resolve({
        success: false,
        imported: {},
        errors: ['Failed to read file'],
      })
    }

    reader.readAsText(file)
  })
}

