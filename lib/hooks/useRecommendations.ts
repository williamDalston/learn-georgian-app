'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  getNextLessonRecommendation,
  getTimeBasedRecommendations,
  identifyWeakAreas,
  getWeakAreaRecommendations,
  type Recommendation,
  type UserProgress,
  type WeakArea,
} from '@/lib/utils/recommendationEngine'
import logger from '@/lib/utils/logger'

interface UseRecommendationsOptions {
  completedLessons?: string[]
  daysPracticed?: number
  currentStreak?: number
  totalTime?: number
  availableMinutes?: number
  exercisePerformance?: Record<string, { score: number; attempts: number; lastAttempt: string }>
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load exercise performance from localStorage if not provided
  const exercisePerformance = useMemo(() => {
    if (options.exercisePerformance) {
      return options.exercisePerformance
    }

    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('exercisePerformance')
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (err) {
        logger.error('Failed to load exercise performance', {
          context: 'useRecommendations',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }

    return undefined
  }, [options.exercisePerformance])

  // Load completed lessons from localStorage if not provided
  const completedLessons = useMemo(() => {
    if (options.completedLessons) {
      return options.completedLessons
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('completedLessons')
        if (stored) {
          return JSON.parse(stored) as string[]
        }
      } catch (err) {
        logger.error('Failed to load completed lessons', {
          context: 'useRecommendations',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }

    return []
  }, [options.completedLessons])

  useEffect(() => {
    const generateRecommendations = () => {
      setIsLoading(true)

      try {
        const progress: UserProgress = {
          completedLessons,
          daysPracticed: options.daysPracticed || 0,
          currentStreak: options.currentStreak || 0,
          totalTime: options.totalTime || 0,
          completedLessonsCount: completedLessons.length,
        }

        const allRecommendations: Recommendation[] = []

        // Get next lesson recommendation
        const nextLesson = getNextLessonRecommendation(progress)
        if (nextLesson) {
          allRecommendations.push(nextLesson)
        }

        // Get time-based recommendations
        const timeBased = getTimeBasedRecommendations(
          progress,
          options.availableMinutes
        )
        allRecommendations.push(...timeBased)

        // Identify weak areas
        const areas = identifyWeakAreas(progress, exercisePerformance)
        setWeakAreas(areas)

        // Get weak area recommendations
        if (areas.length > 0) {
          const weakAreaRecs = getWeakAreaRecommendations(areas)
          allRecommendations.push(...weakAreaRecs)
        }

        // Sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        allRecommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

        setRecommendations(allRecommendations.slice(0, 5)) // Top 5 recommendations
      } catch (error) {
        logger.error('Failed to generate recommendations', {
          context: 'useRecommendations',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      } finally {
        setIsLoading(false)
      }
    }

    generateRecommendations()
  }, [
    completedLessons,
    options.daysPracticed,
    options.currentStreak,
    options.totalTime,
    options.availableMinutes,
    exercisePerformance,
  ])

  return {
    recommendations,
    weakAreas,
    isLoading,
  }
}

