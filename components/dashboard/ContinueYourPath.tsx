'use client'

import Link from 'next/link'
import CTAButton from '@/components/shared/CTAButton'

interface Lesson {
  id: string
  title: string
  description: string
  moduleNumber?: number
  lessonNumber?: number
  duration?: number // in minutes
  thumbnail?: string
}

interface ContinueYourPathProps {
  nextLesson?: Lesson
  className?: string
}

export default function ContinueYourPath({
  nextLesson,
  className = '',
}: ContinueYourPathProps) {
  if (!nextLesson) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h2 className="font-serif text-2xl text-primary-900 mb-4">
          Continue Your Path
        </h2>
        <div className="text-center py-8">
          <p className="font-sans text-gray-600 mb-4">
            Great job! You've completed all available lessons.
          </p>
          <p className="font-sans text-sm text-gray-500">
            New content will be available soon.
          </p>
        </div>
      </div>
    )
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <h2 className="font-serif text-2xl text-primary-900 mb-6 px-6 pt-6">
        Continue Your Path
      </h2>

      <div className="px-6 pb-6">
        {/* Lesson Card */}
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Thumbnail */}
          {nextLesson.thumbnail ? (
            <div className="relative h-48 bg-gray-200">
              <img
                src={nextLesson.thumbnail}
                alt={nextLesson.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-48 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="h-16 w-16 mx-auto mb-2 text-primary-900 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Lesson Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                {nextLesson.moduleNumber && nextLesson.lessonNumber && (
                  <span className="inline-block font-sans text-xs font-semibold text-accent bg-accent bg-opacity-10 px-2 py-1 rounded mb-2">
                    Module {nextLesson.moduleNumber} • Lesson {nextLesson.lessonNumber}
                  </span>
                )}
                <h3 className="font-serif text-xl text-primary-900 mb-2">
                  {nextLesson.title}
                </h3>
              </div>
              {nextLesson.duration && (
                <span className="font-sans text-sm text-gray-500 whitespace-nowrap ml-4">
                  {formatDuration(nextLesson.duration)}
                </span>
              )}
            </div>

            <p className="font-sans text-gray-600 mb-6 line-clamp-2">
              {nextLesson.description}
            </p>

            {/* CTA Button */}
            <Link href={`/dashboard/lessons/${nextLesson.id}`}>
              <CTAButton className="w-full">
                Continue Learning
              </CTAButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

