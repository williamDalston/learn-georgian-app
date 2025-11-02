'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import { getLessonExerciseStats, loadExerciseResults } from '@/lib/utils/exerciseScoring'
import type { ExerciseResult } from '@/lib/utils/exerciseScoring'

interface ExerciseAnalyticsProps {
  lessonId: string
}

export default function ExerciseAnalytics({ lessonId }: ExerciseAnalyticsProps) {
  const [stats, setStats] = useState<{
    totalExercises: number
    completedExercises: number
    averageScore: number
    exercises: Array<{
      exerciseId: string
      score: number
      completed: boolean
    }>
  } | null>(null)

  useEffect(() => {
    const lessonStats = getLessonExerciseStats(lessonId)
    setStats(lessonStats)
  }, [lessonId])

  if (!stats || stats.totalExercises === 0) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="font-sans text-gray-600">
            No exercise data available yet.
          </p>
          <p className="font-sans text-sm text-gray-500 mt-2">
            Complete exercises to see your progress here.
          </p>
        </div>
      </GlassCard>
    )
  }

  const completionPercentage = stats.totalExercises > 0
    ? Math.round((stats.completedExercises / stats.totalExercises) * 100)
    : 0

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-primary-900 mb-2">
          Exercise Performance
        </h3>
        <p className="font-sans text-sm text-gray-600">
          Track your progress and identify areas for improvement.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent-50 to-accent-100/50 border-2 border-accent-200 rounded-xl p-4"
        >
          <p className="font-sans text-sm text-accent-700 font-semibold mb-2">
            Completion Rate
          </p>
          <p className="font-serif text-3xl font-bold text-accent-900">
            {completionPercentage}%
          </p>
          <p className="font-sans text-xs text-accent-600 mt-1">
            {stats.completedExercises} of {stats.totalExercises} exercises
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-4"
        >
          <p className="font-sans text-sm text-green-700 font-semibold mb-2">
            Average Score
          </p>
          <p className="font-serif text-3xl font-bold text-green-900">
            {stats.averageScore}%
          </p>
          <p className="font-sans text-xs text-green-600 mt-1">
            Across all exercises
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-4"
        >
          <p className="font-sans text-sm text-blue-700 font-semibold mb-2">
            Exercises Completed
          </p>
          <p className="font-serif text-3xl font-bold text-blue-900">
            {stats.completedExercises}
          </p>
          <p className="font-sans text-xs text-blue-600 mt-1">
            Total completed
          </p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="font-sans text-sm font-semibold text-accent-700">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-accent to-accent-dark h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Individual Exercise Scores */}
      {stats.exercises.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-serif text-lg text-primary-900 mb-3">
            Exercise Breakdown
          </h4>
          {stats.exercises.map((exercise, index) => (
            <motion.div
              key={exercise.exerciseId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-gray-900 truncate">
                    {exercise.exerciseId.replace(`${lessonId}_`, '')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {exercise.completed ? (
                    <>
                      <div className="text-right">
                        <p className="font-sans text-base font-bold text-accent-700">
                          {exercise.score}%
                        </p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            exercise.score >= 80
                              ? 'bg-green-500'
                              : exercise.score >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${exercise.score}%` }}
                        />
                      </div>
                      {exercise.score >= 80 && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </>
                  ) : (
                    <span className="font-sans text-sm text-gray-400">
                      Not completed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {stats.averageScore < 70 && stats.completedExercises > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-sans text-sm font-semibold text-blue-900 mb-1">
                Keep Practicing!
              </p>
              <p className="font-sans text-sm text-blue-800">
                Review the lesson content and try the exercises again to improve your score.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </GlassCard>
  )
}

