/**
 * Smart Recommendation Engine
 * Analyzes user progress and provides personalized learning suggestions
 */

import { getAllLessons, getLessonById, type Lesson } from '@/lib/data/courseStructure'
import logger from '@/lib/utils/logger'

export interface UserProgress {
  completedLessons: string[]
  daysPracticed: number
  currentStreak: number
  totalTime: number
  completedLessonsCount: number
}

export interface Recommendation {
  lesson: Lesson
  reason: string
  priority: 'high' | 'medium' | 'low'
  type: 'next' | 'review' | 'time_based' | 'weak_area' | 'goal_based'
}

export interface WeakArea {
  lessonId: string
  lessonTitle: string
  errorRate: number
  lastAttempted: Date | null
  suggestedAction: 'review' | 'practice' | 'retake'
}

/**
 * Get personalized next lesson recommendation
 */
export function getNextLessonRecommendation(
  progress: UserProgress
): Recommendation | null {
  try {
    const nextLesson = getAllLessons().find(
      (lesson) => !progress.completedLessons.includes(lesson.id)
    )

    if (!nextLesson) {
      return null
    }

    // Calculate reason based on progress
    let reason = 'Continue your learning journey'
    if (progress.currentStreak > 0) {
      reason = `Keep your ${progress.currentStreak}-day streak going!`
    } else if (progress.completedLessonsCount === 0) {
      reason = 'Start your first lesson and begin your journey'
    } else {
      reason = `You've completed ${progress.completedLessonsCount} lessons. Time for the next one!`
    }

    return {
      lesson: nextLesson,
      reason,
      priority: 'high',
      type: 'next',
    }
  } catch (error) {
    logger.error('Failed to get next lesson recommendation', {
      context: 'recommendationEngine',
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return null
  }
}

/**
 * Identify weak areas based on exercise performance
 */
export function identifyWeakAreas(
  progress: UserProgress,
  exercisePerformance?: Record<string, { score: number; attempts: number; lastAttempt: string }>
): WeakArea[] {
  if (!exercisePerformance || Object.keys(exercisePerformance).length === 0) {
    return []
  }

  const weakAreas: WeakArea[] = []
  const threshold = 0.6 // 60% score threshold

  Object.entries(exercisePerformance).forEach(([lessonId, performance]) => {
    const errorRate = 1 - performance.score // error rate is inverse of score

    if (performance.score < threshold && performance.attempts > 0) {
      const lesson = getLessonById(lessonId)
      if (lesson) {
        let suggestedAction: 'review' | 'practice' | 'retake' = 'review'
        if (performance.score < 0.4) {
          suggestedAction = 'retake'
        } else if (performance.attempts === 1) {
          suggestedAction = 'practice'
        }

        weakAreas.push({
          lessonId,
          lessonTitle: lesson.title,
          errorRate,
          lastAttempted: performance.lastAttempt ? new Date(performance.lastAttempt) : null,
          suggestedAction,
        })
      }
    }
  })

  // Sort by error rate (highest first)
  return weakAreas.sort((a, b) => b.errorRate - a.errorRate)
}

/**
 * Get time-based recommendations
 */
export function getTimeBasedRecommendations(
  progress: UserProgress,
  availableMinutes?: number
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const allLessons = getAllLessons()
  const currentHour = new Date().getHours()
  const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'

  // Filter uncompleted lessons
  const availableLessons = allLessons.filter(
    (lesson) => !progress.completedLessons.includes(lesson.id)
  )

  if (availableMinutes) {
    // Find lessons that fit the available time
    const fittingLessons = availableLessons.filter(
      (lesson) => lesson.duration <= availableMinutes && lesson.duration >= availableMinutes - 15
    )

    if (fittingLessons.length > 0) {
      const recommended = fittingLessons[0]
      recommendations.push({
        lesson: recommended,
        reason: `Perfect for ${availableMinutes} minutes - ${recommended.duration} minute lesson`,
        priority: 'high',
        type: 'time_based',
      })
    }
  }

  // Add time-of-day specific recommendations
  const quickLessons = availableLessons.filter((l) => l.duration <= 30)
  const fullLessons = availableLessons.filter((l) => l.duration > 30)

  if (timeOfDay === 'morning' && quickLessons.length > 0) {
    recommendations.push({
      lesson: quickLessons[0],
      reason: 'Start your day with a quick 15-30 minute lesson',
      priority: 'medium',
      type: 'time_based',
    })
  } else if (timeOfDay === 'evening' && quickLessons.length > 0) {
    recommendations.push({
      lesson: quickLessons[0],
      reason: 'End your day with vocabulary review or a quick practice',
      priority: 'medium',
      type: 'time_based',
    })
  }

  return recommendations
}

/**
 * Get recommendations for weak areas
 */
export function getWeakAreaRecommendations(
  weakAreas: WeakArea[]
): Recommendation[] {
  return weakAreas.slice(0, 3).map((area) => {
    const lesson = getLessonById(area.lessonId)
    if (!lesson) {
      return null
    }

    let reason = `Review this lesson to improve your understanding`
    if (area.suggestedAction === 'retake') {
      reason = `You struggled with this lesson - consider retaking it`
    } else if (area.suggestedAction === 'practice') {
      reason = `Practice more exercises from this lesson`
    }

    return {
      lesson,
      reason,
      priority: area.errorRate > 0.5 ? 'high' : 'medium',
      type: 'weak_area',
    }
  }).filter((rec): rec is Recommendation => rec !== null)
}

/**
 * Calculate learning pace
 */
export function calculateLearningPace(progress: UserProgress): {
  lessonsPerWeek: number
  currentPace: number
  isOnTrack: boolean
  message: string
} {
  if (progress.daysPracticed === 0) {
    return {
      lessonsPerWeek: 0,
      currentPace: 0,
      isOnTrack: false,
      message: 'Start learning to see your pace',
    }
  }

  const currentPace = progress.completedLessonsCount / Math.max(progress.daysPracticed / 7, 1)
  const recommendedPace = 3 // 3 lessons per week recommended
  const lessonsPerWeek = currentPace

  let message = 'You\'re making great progress!'
  if (currentPace < recommendedPace * 0.7) {
    message = 'Try to increase your study frequency for better results'
  } else if (currentPace > recommendedPace * 1.5) {
    message = 'Excellent pace! Keep up the momentum'
  }

  return {
    lessonsPerWeek,
    currentPace,
    isOnTrack: currentPace >= recommendedPace * 0.7,
    message,
  }
}

