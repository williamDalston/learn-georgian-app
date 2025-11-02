'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { courseStructure } from '@/lib/data/courseStructure'

interface CourseOutlineDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentLessonId: string
}

export default function CourseOutlineDrawer({ isOpen, onClose, currentLessonId }: CourseOutlineDrawerProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set())
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  // Load completed lessons from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedLessons')
      if (saved) {
        try {
          setCompletedLessons(JSON.parse(saved))
        } catch (err) {
          console.error('Failed to parse completed lessons')
        }
      }
    }
  }, [])

  // Auto-expand current lesson's level
  useEffect(() => {
    if (isOpen && currentLessonId) {
      // Find which level contains current lesson
      for (const level of courseStructure) {
        if (level.lessons.some(l => l.id === currentLessonId)) {
          setExpandedLevels(prev => new Set([...Array.from(prev), level.code.toLowerCase()]))
          break
        }
      }
    }
  }, [isOpen, currentLessonId])

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

  const totalLessons = getTotalLessons()
  const completedCount = completedLessons.length

  // Handle outside click and escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const getProgressPercentage = () => {
    if (totalLessons === 0) return 0
    return Math.round((completedCount / totalLessons) * 100)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:bg-opacity-30"
            onClick={onClose}
          />

          {/* Drawer - Mobile: Bottom Sheet, Desktop: Side Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 z-50 bg-white shadow-2xl flex flex-col lg:rounded-l-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-accent/5 to-accent-50">
              <div className="flex-1">
                <h2 className="font-serif text-xl lg:text-2xl text-primary-900 mb-1">
                  Course Outline
                </h2>
                <p className="font-sans text-sm text-gray-600">
                  {completedCount} of {totalLessons} lessons completed
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-accent to-accent-dark h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close course outline"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {courseStructure.map((level) => {
                  const isExpanded = expandedLevels.has(level.code.toLowerCase())
                  const levelLessonsCompleted = level.lessons.filter(l => completedLessons.includes(l.id)).length
                  const isCurrentLevel = level.lessons.some(l => l.id === currentLessonId)

                  return (
                    <div key={level.code} className="border-b border-gray-100 last:border-b-0">
                      {/* Level Header */}
                      <button
                        onClick={() => toggleLevel(level.code.toLowerCase())}
                        className={`w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left ${
                          isCurrentLevel ? 'bg-primary-50 border-l-4 border-accent' : ''
                        }`}
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
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-neutral-50 border-t border-gray-100">
                              <ul className="divide-y divide-gray-100">
                                {level.lessons.map((lesson, index) => {
                                  const isCompleted = completedLessons.includes(lesson.id)
                                  const isCurrent = lesson.id === currentLessonId
                                  const isLocked = false // TODO: Implement lesson locking logic

                                  return (
                                    <li key={lesson.id}>
                                      <Link
                                        href={isLocked ? '#' : `/dashboard/lessons/${lesson.id}`}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                                          isLocked
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'hover:bg-white cursor-pointer'
                                        } ${
                                          isCurrent
                                            ? 'bg-white border-l-4 border-accent font-semibold'
                                            : ''
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
                                            <div className={`w-5 h-5 rounded-full border-2 ${
                                              isCurrent ? 'border-accent' : 'border-gray-300'
                                            }`} />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={`font-sans text-sm truncate ${
                                              isCompleted
                                                ? 'text-gray-600'
                                                : isCurrent
                                                ? 'text-accent'
                                                : 'text-gray-900'
                                            }`}
                                          >
                                            {index + 1}. {lesson.title}
                                          </p>
                                          {isCurrent && (
                                            <p className="font-sans text-xs text-accent mt-0.5">
                                              Currently watching
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="font-sans text-xs text-gray-600 text-center">
                Keep going! You're doing great! 🎉
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

