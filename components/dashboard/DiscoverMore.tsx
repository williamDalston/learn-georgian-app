'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Recommendation {
  id: string
  title: string
  description: string
  type: 'theory' | 'expert' | 'exercise'
  duration?: number
  thumbnail?: string
}

interface DiscoverMoreProps {
  recommendations?: Recommendation[]
  className?: string
}

type FilterType = 'all' | 'theory' | 'expert' | 'exercise'

const defaultRecommendations: Recommendation[] = [
  {
    id: 'theory-1',
    title: 'Understanding the Nature of Mind',
    description: 'Deep dive into the philosophical foundations of inner freedom',
    type: 'theory',
    duration: 25,
  },
  {
    id: 'expert-1',
    title: 'Conversation with Dr. Sarah Chen',
    description: 'Expert insights on mindfulness and neuroscience',
    type: 'expert',
    duration: 45,
  },
  {
    id: 'exercise-1',
    title: 'Daily Reflection Exercise',
    description: 'A practical exercise to deepen your practice',
    type: 'exercise',
    duration: 15,
  },
]

export default function DiscoverMore({
  recommendations = defaultRecommendations,
  className = '',
}: DiscoverMoreProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredRecommendations =
    filter === 'all'
      ? recommendations
      : recommendations.filter((r) => r.type === filter)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'theory':
        return { label: 'Theory', color: 'bg-primary-100 text-primary-900' }
      case 'expert':
        return { label: 'Expert Talk', color: 'bg-secondary-100 text-secondary-900' }
      case 'exercise':
        return { label: 'Exercise', color: 'bg-accent bg-opacity-20 text-accent' }
      default:
        return { label: 'Content', color: 'bg-gray-100 text-gray-900' }
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    return `${minutes}m`
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-primary-900">Discover More</h3>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {(['all', 'theory', 'expert', 'exercise'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1.5 rounded-lg font-sans text-sm transition-colors ${
                filter === filterType
                  ? 'bg-accent text-white'
                  : 'bg-neutral-100 text-gray-700 hover:bg-neutral-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((item) => {
            const typeInfo = getTypeLabel(item.type)
            return (
              <Link
                key={item.id}
                href={`/dashboard/content/${item.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block font-sans text-xs font-semibold px-2 py-1 rounded ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      {item.duration && (
                        <span className="font-sans text-xs text-gray-500">
                          {formatDuration(item.duration)}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg text-primary-900 mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-sans text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors flex-shrink-0 mt-1"
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
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="font-sans text-gray-500">No {filter === 'all' ? '' : filter} content available.</p>
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/dashboard/resources"
          className="font-sans text-sm text-accent hover:text-accent-dark font-medium flex items-center gap-2 justify-center transition-colors"
        >
          View All Resources
          <svg
            className="h-4 w-4"
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
        </Link>
      </div>
    </div>
  )
}

