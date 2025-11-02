'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import CTAButton from '@/components/shared/CTAButton'
import { useRecommendations } from '@/lib/hooks/useRecommendations'
import { type Recommendation } from '@/lib/utils/recommendationEngine'

interface SmartRecommendationsProps {
  completedLessons?: string[]
  daysPracticed?: number
  currentStreak?: number
  totalTime?: number
  className?: string
}

export default function SmartRecommendations({
  completedLessons,
  daysPracticed = 0,
  currentStreak = 0,
  totalTime = 0,
  className = '',
}: SmartRecommendationsProps) {
  const { recommendations, isLoading } = useRecommendations({
    completedLessons,
    daysPracticed,
    currentStreak,
    totalTime,
  })

  // Group recommendations by type
  const groupedRecommendations = useMemo(() => {
    const grouped: Record<string, Recommendation[]> = {
      next: [],
      review: [],
      time_based: [],
      weak_area: [],
      goal_based: [],
    }

    recommendations.forEach((rec) => {
      if (rec.type === 'weak_area') {
        grouped.review.push(rec)
      } else {
        grouped[rec.type]?.push(rec)
      }
    })

    return grouped
  }, [recommendations])

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="font-serif text-2xl text-primary-900 mb-4">
          Recommendations
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  // Get the top recommendation
  const topRecommendation = recommendations[0]

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="h-6 w-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="font-serif text-2xl text-primary-900 dark:text-gray-100">
          Smart Recommendations
        </h3>
      </div>

      {/* Top Recommendation - Featured */}
      {topRecommendation && (
        <div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className="inline-block font-sans text-xs font-semibold text-accent bg-white px-2 py-1 rounded mb-2">
                Recommended for You
              </span>
              <h4 className="font-serif text-lg text-primary-900 mb-2">
                {topRecommendation.lesson.title}
              </h4>
              <p className="font-sans text-sm text-gray-600 mb-3">
                {topRecommendation.reason}
              </p>
              {topRecommendation.lesson.duration && (
                <p className="font-sans text-xs text-gray-500 mb-3">
                  ⏱ {topRecommendation.lesson.duration} minutes
                </p>
              )}
            </div>
          </div>
          <Link href={`/dashboard/lessons/${topRecommendation.lesson.id}`}>
            <CTAButton className="w-full">
              Start This Lesson
            </CTAButton>
          </Link>
        </div>
      )}

      {/* Other Recommendations */}
      {recommendations.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-serif text-lg text-primary-900 mb-3">
            More Suggestions
          </h4>
          {recommendations.slice(1, 4).map((rec, index) => (
            <Link
              key={rec.lesson.id}
              href={`/dashboard/lessons/${rec.lesson.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-serif text-base text-primary-900 mb-1">
                    {rec.lesson.title}
                  </h5>
                  <p className="font-sans text-xs text-gray-600">
                    {rec.reason}
                  </p>
                  {rec.lesson.duration && (
                    <span className="inline-block mt-2 font-sans text-xs text-gray-500">
                      {rec.lesson.duration} min
                    </span>
                  )}
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

