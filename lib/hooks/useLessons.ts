'use client'

import { useState, useEffect } from 'react'
import { getAllLessons, getNextLesson, getLessonById, type Lesson } from '@/lib/data/courseStructure'
import logger from '@/lib/utils/logger'

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

  // Load lessons from course structure
  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Get all lessons from course structure
        const allLessons = getAllLessons()

        // Load completed lessons from localStorage
        if (typeof window !== 'undefined') {
          try {
            const completed = localStorage.getItem('completedLessons')
            if (completed) {
              const completedIds = JSON.parse(completed) as string[]
              allLessons.forEach((lesson) => {
                if (completedIds.includes(lesson.id)) {
                  lesson.isCompleted = true
                }
              })
            }
          } catch (err) {
            logger.error('Failed to load completed lessons', {
              context: 'useLessons',
              error: err instanceof Error ? err : new Error(String(err)),
            })
          }
        }

        setLessons(allLessons)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lessons')
      } finally {
        setIsLoading(false)
      }
    }

    loadLessons()
  }, [])

  const getNextLessonLocal = (): Lesson | undefined => {
    const completedIds = lessons.filter(l => l.isCompleted).map(l => l.id)
    return getNextLesson(completedIds)
  }

  const getLessonByIdLocal = (id: string): Lesson | undefined => {
    return getLessonById(id) || lessons.find((lesson) => lesson.id === id)
  }

  const markLessonComplete = async (lessonId: string) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
      )
    )

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const completed = localStorage.getItem('completedLessons')
        const completedIds = completed ? (JSON.parse(completed) as string[]) : []
        if (!completedIds.includes(lessonId)) {
          completedIds.push(lessonId)
          localStorage.setItem('completedLessons', JSON.stringify(completedIds))
        }
      } catch (err) {
        logger.error('Failed to save completed lesson', {
          context: 'useLessons',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
  }

  const getProgressStats = () => {
    const completed = lessons.filter((l) => l.isCompleted).length
    const total = lessons.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      completed,
      total,
      percentage,
    }
  }

  return {
    lessons,
    isLoading,
    error,
    currentLessonId,
    setCurrentLessonId,
    getNextLesson: getNextLessonLocal,
    getLessonById: getLessonByIdLocal,
    markLessonComplete,
    getProgressStats,
  }
}

