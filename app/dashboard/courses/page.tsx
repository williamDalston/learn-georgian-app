'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CourseOutline from '@/components/dashboard/CourseOutline'
import { courseStructure, getAllLessons, type Lesson } from '@/lib/data/courseStructure'

interface Module {
  id: string
  title: string
  description?: string
  level: string
  lessons: {
    id: string
    title: string
    duration?: number
    isCompleted?: boolean
    isLocked?: boolean
  }[]
  isExpanded?: boolean
}

function CoursesContent() {
  const searchParams = useSearchParams()
  const levelFilter = searchParams?.get('level')
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

  // Load completed lessons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const completed = localStorage.getItem('completedLessons')
        if (completed) {
          const completedIds = JSON.parse(completed) as string[]
          setCompletedLessons(new Set(completedIds))
        }
      } catch (err) {
        console.error('Failed to load completed lessons:', err)
      }
    }
  }, [])

  // Convert course structure to module format
  const modules: Module[] = courseStructure
    .filter(level => !levelFilter || level.code === levelFilter)
    .map((level, index) => ({
      id: level.code,
      title: `${level.code}: ${level.name}`,
      description: level.description,
      level: level.code,
      lessons: level.lessons.map((lesson) => {
        const allLessons = getAllLessons()
        const lessonIndex = allLessons.findIndex(l => l.id === lesson.id)
        const previousLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null
        const isPreviousCompleted = previousLesson
          ? completedLessons.has(previousLesson.id)
          : true
        const isLocked = !isPreviousCompleted

        return {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          isCompleted: completedLessons.has(lesson.id),
          isLocked,
        }
      }),
      isExpanded: levelFilter === level.code || index === 0, // Expand filtered level or first level
    }))

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedCount = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
    0
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary-900 mb-2">
          Course Outline
        </h1>
        <p className="font-sans text-base sm:text-lg text-gray-600 mb-4">
          Complete overview of your Georgian learning journey from A1 to C1
        </p>

        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-sans text-sm text-gray-600 mb-1">Overall Progress</p>
              <p className="font-serif text-2xl font-bold text-primary-900">
                {completedCount} of {totalLessons} lessons completed
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-sm font-medium text-gray-700">
                  {Math.round((completedCount / totalLessons) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-accent to-accent-dark h-full transition-all duration-700 ease-out rounded-full relative"
                  style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                >
                  {(completedCount / totalLessons) * 100 > 0 && (
                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-shimmer" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Filter Chips */}
        {levelFilter && (
          <div className="mb-4">
            <a
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-accent transition-colors font-sans text-sm text-gray-700 hover:text-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filter: {levelFilter}
            </a>
          </div>
        )}
      </div>

      {/* Course Outline */}
      <CourseOutline
        modules={modules}
        currentLessonId={currentLessonId || undefined}
      />
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  )
}

// Mark page as dynamic to avoid static generation
export const dynamic = 'force-dynamic'
