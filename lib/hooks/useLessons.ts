'use client'

import { useState, useEffect } from 'react'

interface Lesson {
  id: string
  title: string
  description: string
  moduleNumber?: number
  lessonNumber?: number
  duration?: number
  videoUrl?: string
  exerciseMaterials?: {
    name: string
    url: string
  }[]
  isCompleted?: boolean
}

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

  // Mock lessons data - in production, this would come from an API
  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockLessons: Lesson[] = [
          {
            id: 'lesson-1',
            title: 'Introduction: Understanding Your Inner Landscape',
            description:
              'Begin your journey by exploring the foundational concepts of inner freedom and self-awareness.',
            moduleNumber: 1,
            lessonNumber: 1,
            duration: 18,
            isCompleted: false,
          },
          {
            id: 'lesson-2',
            title: 'Recognizing Patterns in Your Thoughts',
            description:
              'Learn to identify recurring thought patterns and understand their impact on your emotional state.',
            moduleNumber: 1,
            lessonNumber: 2,
            duration: 22,
            isCompleted: false,
          },
          // Add more lessons as needed
        ]

        // Load completed lessons from localStorage
        if (typeof window !== 'undefined') {
          try {
            const completed = localStorage.getItem('completedLessons')
            if (completed) {
              const completedIds = JSON.parse(completed) as string[]
              mockLessons.forEach((lesson) => {
                if (completedIds.includes(lesson.id)) {
                  lesson.isCompleted = true
                }
              })
            }
          } catch (err) {
            console.error('Failed to load completed lessons:', err)
          }
        }

        setLessons(mockLessons)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lessons')
      } finally {
        setIsLoading(false)
      }
    }

    loadLessons()
  }, [])

  const getNextLesson = (): Lesson | undefined => {
    return lessons.find((lesson) => !lesson.isCompleted)
  }

  const getLessonById = (id: string): Lesson | undefined => {
    return lessons.find((lesson) => lesson.id === id)
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
        console.error('Failed to save completed lesson:', err)
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
    getNextLesson,
    getLessonById,
    markLessonComplete,
    getProgressStats,
  }
}

