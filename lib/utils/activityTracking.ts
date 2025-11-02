/**
 * Activity Tracking Utilities
 * Track and retrieve user activity history
 */

export interface Activity {
  id: string
  type: 'lesson_completed' | 'achievement_unlocked' | 'exercise_completed' | 'goal_reached' | 'streak_milestone'
  title: string
  description: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

const ACTIVITY_STORAGE_KEY = 'userActivity'

/**
 * Add an activity to the activity log
 */
export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return

  try {
    const activities = getActivities()
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }

    activities.unshift(newActivity) // Add to beginning

    // Keep only last 100 activities
    const trimmed = activities.slice(0, 100)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to add activity', error)
  }
}

/**
 * Get recent activities
 */
export function getActivities(limit?: number): Activity[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY)
    if (!stored) return []

    const activities = JSON.parse(stored) as Activity[]
    // Parse timestamps back to Date objects
    const parsed = activities.map((a) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }))

    return limit ? parsed.slice(0, limit) : parsed
  } catch (error) {
    console.error('Failed to get activities', error)
    return []
  }
}

/**
 * Get activities by type
 */
export function getActivitiesByType(type: Activity['type'], limit?: number): Activity[] {
  const activities = getActivities()
  const filtered = activities.filter((a) => a.type === type)
  return limit ? filtered.slice(0, limit) : filtered
}

/**
 * Clear all activities
 */
export function clearActivities(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACTIVITY_STORAGE_KEY)
}

/**
 * Helper to create lesson completed activity
 */
export function createLessonCompletedActivity(lessonTitle: string, lessonId: string): Omit<Activity, 'id' | 'timestamp'> {
  return {
    type: 'lesson_completed',
    title: 'Lesson Completed',
    description: `Completed: ${lessonTitle}`,
    metadata: { lessonId },
  }
}

/**
 * Helper to create achievement unlocked activity
 */
export function createAchievementUnlockedActivity(achievementTitle: string, achievementId: string): Omit<Activity, 'id' | 'timestamp'> {
  return {
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked',
    description: achievementTitle,
    metadata: { achievementId },
  }
}

