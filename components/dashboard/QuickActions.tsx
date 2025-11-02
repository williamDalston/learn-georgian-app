'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAllLessons } from '@/lib/data/courseStructure'

interface QuickActionsProps {
  nextLessonId?: string
  className?: string
}

export default function QuickActions({
  nextLessonId,
  className = '',
}: QuickActionsProps) {
  const router = useRouter()

  const actions = [
    {
      id: 'start-next',
      label: 'Start Next Lesson',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: nextLessonId ? `/dashboard/lessons/${nextLessonId}` : '/dashboard/lessons',
      color: 'bg-accent hover:bg-accent-dark text-white',
    },
    {
      id: 'vocabulary',
      label: 'Review Vocabulary',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/dashboard/vocabulary',
      color: 'bg-primary-600 hover:bg-primary-700 text-white',
    },
    {
      id: 'exercises',
      label: 'Practice Exercises',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      href: '/dashboard/exercises',
      color: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    },
    {
      id: 'achievements',
      label: 'View Achievements',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      href: '/dashboard/achievements',
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
  ]

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="font-serif text-xl text-primary-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 ${action.color} hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            {action.icon}
            <span className="font-sans text-xs sm:text-sm text-center font-medium">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

