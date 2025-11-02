'use client'

import { useState } from 'react'
import Link from 'next/link'
import { courseStructure } from '@/lib/data/courseStructure'

export default function CourseOutlineSidebar() {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['a1'])) // Default: A1 expanded

  const toggleLevel = (levelCode: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev)
      if (next.has(levelCode)) {
        next.delete(levelCode)
      } else {
        next.add(levelCode)
      }
      return next
    })
  }

  const getTotalLessons = () => {
    return courseStructure.reduce((sum, level) => sum + level.lessons.length, 0)
  }

  const getCompletedLessons = () => {
    // This would be replaced with actual user progress data
    // For now, return 0 as placeholder
    return 0
  }

  const completedLessons = getCompletedLessons()
  const totalLessons = getTotalLessons()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-serif text-lg text-primary-900 mb-1">Course Outline</h3>
        <p className="font-sans text-sm text-gray-600">
          {completedLessons} of {totalLessons} lessons
        </p>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Levels */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {courseStructure.map((level) => {
            const isExpanded = expandedLevels.has(level.code.toLowerCase())
            const levelLessonsCompleted = level.lessons.filter((l) => l.isCompleted).length

            return (
              <div key={level.code} className="border-b border-gray-100 last:border-b-0">
                {/* Level Header */}
                <button
                  onClick={() => toggleLevel(level.code.toLowerCase())}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-sm">
                        <span className="text-white font-sans font-bold text-xs">
                          {level.code}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-primary-900 truncate">
                        {level.code}: {level.focus.split('+')[0]?.trim() || level.focus}
                      </h4>
                      <p className="font-sans text-xs text-gray-600 mt-0.5">
                        {levelLessonsCompleted}/{level.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
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
                </button>

                {/* Level Lessons */}
                {isExpanded && (
                  <div className="bg-neutral-50 border-t border-gray-100">
                    <ul className="divide-y divide-gray-100">
                      {level.lessons.map((lesson, index) => {
                        const isLocked = false // This would come from actual user progress
                        const isCompleted = lesson.isCompleted || false

                        return (
                          <li key={lesson.id}>
                            <Link
                              href={isLocked ? '#' : `/dashboard/lessons/${lesson.id}`}
                              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isLocked
                                  ? 'opacity-40 cursor-not-allowed'
                                  : 'hover:bg-white'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
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
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-sans text-sm truncate ${
                                    isCompleted ? 'text-gray-600' : 'text-gray-900'
                                  }`}
                                >
                                  {index + 1}. {lesson.title}
                                </p>
                              </div>
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
    </div>
  )
}
