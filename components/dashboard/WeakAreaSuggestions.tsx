'use client'

import Link from 'next/link'
import { useRecommendations } from '@/lib/hooks/useRecommendations'
import type { WeakArea } from '@/lib/utils/recommendationEngine'

interface WeakAreaSuggestionsProps {
  completedLessons?: string[]
  className?: string
}

export default function WeakAreaSuggestions({
  completedLessons,
  className = '',
}: WeakAreaSuggestionsProps) {
  const { weakAreas, isLoading } = useRecommendations({
    completedLessons,
  })

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="font-serif text-xl text-primary-900 mb-4">
          Areas to Review
        </h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (weakAreas.length === 0) {
    return null
  }

  const getActionLabel = (action: WeakArea['suggestedAction']) => {
    switch (action) {
      case 'retake':
        return 'Retake Lesson'
      case 'practice':
        return 'Practice More'
      default:
        return 'Review Lesson'
    }
  }

  const getActionColor = (action: WeakArea['suggestedAction']) => {
    switch (action) {
      case 'retake':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'practice':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="font-serif text-xl text-primary-900">
          Areas to Review
        </h3>
      </div>

      <p className="font-sans text-sm text-gray-600 mb-4">
        These lessons could use some extra practice to strengthen your understanding.
      </p>

      <div className="space-y-3">
        {weakAreas.slice(0, 3).map((area) => (
          <div
            key={area.lessonId}
            className="p-4 border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-serif text-base text-primary-900 mb-1">
                  {area.lessonTitle}
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getActionColor(area.suggestedAction)}`}>
                    {getActionLabel(area.suggestedAction)}
                  </span>
                  {area.errorRate > 0 && (
                    <span className="font-sans text-xs text-gray-500">
                      {(area.errorRate * 100).toFixed(0)}% error rate
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/lessons/${area.lessonId}`}
              className="inline-block font-sans text-sm text-accent hover:text-accent-dark transition-colors"
            >
              Review now →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

