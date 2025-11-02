'use client'

import { useEffect, useState } from 'react'
import { courseStructure } from '@/lib/data/courseStructure'
import { getLevelProgress } from '@/lib/utils/achievementHelpers'

interface LevelProgressionProps {
  completedLessonIds?: string[]
}

export default function LevelProgression({
  completedLessonIds = [],
}: LevelProgressionProps) {
  const [levelProgresses, setLevelProgresses] = useState<{
    code: string
    name: string
    progress: number
    completed: number
    total: number
  }[]>([])

  useEffect(() => {
    const progresses = courseStructure.map((level) => {
      const progress = getLevelProgress(level.code, completedLessonIds)
      return {
        code: level.code,
        name: level.name,
        progress: progress.percentage,
        completed: progress.completed,
        total: progress.total,
      }
    })
    setLevelProgresses(progresses)
  }, [completedLessonIds])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-serif text-2xl text-primary-900 mb-6">
        Level Progression
      </h3>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200"></div>

        {/* Levels */}
        <div className="relative flex justify-between items-start">
          {levelProgresses.map((level, index) => {
            const isComplete = level.progress === 100
            const inProgress = level.progress > 0 && level.progress < 100

            return (
              <div
                key={level.code}
                className="flex flex-col items-center flex-1"
              >
                {/* Level Icon */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                    isComplete
                      ? 'bg-accent border-accent shadow-lg scale-110'
                      : inProgress
                      ? 'bg-accent border-accent bg-opacity-50 border-opacity-50'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isComplete ? (
                    <span className="text-2xl">✓</span>
                  ) : (
                    <span
                      className={`font-serif font-bold text-lg ${
                        inProgress ? 'text-accent' : 'text-gray-400'
                      }`}
                    >
                      {level.code}
                    </span>
                  )}
                </div>

                {/* Level Info */}
                <div className="mt-3 text-center w-full px-1">
                  <p
                    className={`font-serif font-semibold mb-1 ${
                      isComplete
                        ? 'text-accent'
                        : inProgress
                        ? 'text-primary-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {level.code}
                  </p>
                  <p className="font-sans text-xs text-gray-600 mb-2 line-clamp-2">
                    {level.name}
                  </p>
                  <p className="font-sans text-xs text-gray-500">
                    {level.completed}/{level.total} lessons
                  </p>
                </div>

                {/* Progress Bar for In-Progress Levels */}
                {inProgress && (
                  <div className="mt-2 w-full px-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${level.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Overall Progress Message */}
      {levelProgresses.some((l) => l.progress > 0) && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="font-sans text-sm text-gray-700 text-center">
            You've completed{' '}
            <span className="font-bold text-accent">
              {levelProgresses.filter((l) => l.progress === 100).length}
            </span>{' '}
            of {levelProgresses.length} levels. Keep going! 💪
          </p>
        </div>
      )}
    </div>
  )
}



