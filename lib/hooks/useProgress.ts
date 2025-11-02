'use client'

import { useState, useEffect } from 'react'
import { getTotalLessonCount } from '@/lib/data/courseStructure'
import logger from '@/lib/utils/logger'

interface ProgressData {
  daysPracticed: number
  totalTime: number // in minutes
  currentStreak: number
  totalLessons: number
  completedLessons: number
}

export function useProgress(initialData?: ProgressData) {
  const [progress, setProgress] = useState<ProgressData>({
    daysPracticed: 0,
    totalTime: 0,
    currentStreak: 0,
    totalLessons: getTotalLessonCount(), // Dynamically calculated from course structure
    completedLessons: 0,
    ...initialData,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('userProgress')
        if (saved) {
          const parsed = JSON.parse(saved)
          setProgress((prev) => ({ ...prev, ...parsed }))
        }
      } catch (err) {
        logger.error('Failed to load progress', {
          context: 'useProgress',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userProgress', JSON.stringify(progress))
      } catch (err) {
        logger.error('Failed to save progress', {
          context: 'useProgress',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
  }, [progress])

  const updateProgress = async (updates: Partial<ProgressData>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setProgress((prev) => ({ ...prev, ...updates }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
    } finally {
      setIsLoading(false)
    }
  }

  const markLessonComplete = async () => {
    await updateProgress({
      completedLessons: progress.completedLessons + 1,
      daysPracticed: progress.daysPracticed + 1,
      currentStreak: progress.currentStreak + 1,
      totalTime: progress.totalTime + 18, // Assuming 18 min average lesson
    })
  }

  const resetProgress = () => {
    setProgress({
      daysPracticed: 0,
      totalTime: 0,
      currentStreak: 0,
      totalLessons: getTotalLessonCount(), // Dynamically calculated from course structure
      completedLessons: 0,
    })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProgress')
    }
  }

  const progressPercentage =
    progress.totalLessons > 0
      ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
      : 0

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    markLessonComplete,
    resetProgress,
    progressPercentage,
  }
}

