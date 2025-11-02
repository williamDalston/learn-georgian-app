'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  duration?: number
  isCompleted?: boolean
  isLocked?: boolean
}

interface Module {
  id: string
  title: string
  description?: string
  level?: string
  lessons: Lesson[]
  isExpanded?: boolean
}

interface CourseOutlineProps {
  modules: Module[]
  currentLessonId?: string
  className?: string
}

export default function CourseOutline({
  modules,
  currentLessonId,
  className = '',
}: CourseOutlineProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.filter((m) => m.isExpanded).map((m) => m.id))
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
    0
  )

  const getLevelColorClasses = (levelCode: string) => {
    switch (levelCode) {
      case 'A1':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
      case 'A2':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200'
      case 'B1':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200'
      case 'B2':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200'
      case 'C1':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-primary-900 mb-2">Course Outline</h3>
        <p className="font-sans text-sm text-gray-600">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const isExpanded = expandedModules.has(module.id)
          const moduleCompleted = module.lessons.every((l) => l.isCompleted)
          const moduleInProgress = module.lessons.some(
            (l) => l.isCompleted && !moduleCompleted
          )
          const levelCode = module.level || 'A1'
          const levelColorClasses = getLevelColorClasses(levelCode)

          return (
            <div
              key={module.id}
              className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-xl ${levelColorClasses} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-xl">
                        {levelCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-xl text-primary-900 mb-1">{module.title}</h4>
                    {module.description && (
                      <p className="font-sans text-sm text-gray-600">{module.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="font-sans text-base font-semibold text-gray-700">
                      {module.lessons.filter((l) => l.isCompleted).length}/{module.lessons.length}
                    </span>
                    <span className="font-sans text-xs text-gray-500">lessons</span>
                  </div>
                  <svg
                    className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-neutral-50">
                  <ul className="divide-y divide-gray-200">
                    {module.lessons.map((lesson, index) => {
                      const isCurrent = lesson.id === currentLessonId
                      const isPreviousCompleted =
                        index === 0 || module.lessons[index - 1]?.isCompleted

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={
                              lesson.isLocked || !isPreviousCompleted
                                ? '#'
                                : `/dashboard/lessons/${lesson.id}`
                            }
                            className={`flex items-center gap-4 p-5 transition-colors ${
                              isCurrent
                                ? 'bg-gradient-to-r from-accent/10 to-accent/5 border-l-4 border-accent shadow-sm'
                                : lesson.isLocked || !isPreviousCompleted
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {lesson.isCompleted ? (
                                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                  <svg
                                    className="h-5 w-5 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : lesson.isLocked || !isPreviousCompleted ? (
                                <div className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                  <svg
                                    className="h-4 w-4 text-gray-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                                  <span className="text-xs text-gray-400 font-semibold">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-sans text-base ${
                                  isCurrent
                                    ? 'font-semibold text-accent'
                                    : lesson.isCompleted
                                    ? 'text-gray-700'
                                    : 'text-gray-900 font-medium'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              {lesson.duration && (
                                <p className="font-sans text-xs text-gray-500 mt-1">
                                  ⏱️ {formatDuration(lesson.duration)}
                                </p>
                              )}
                            </div>
                            {lesson.isLocked || !isPreviousCompleted ? (
                              <div className="flex-shrink-0">
                                <span className="text-xs text-gray-400">🔒 Locked</span>
                              </div>
                            ) : (
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

