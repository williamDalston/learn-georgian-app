'use client'

import { useMemo } from 'react'
import { getDailyMotivation } from '@/lib/utils/dailyMotivation'

interface EnhancedWelcomeProps {
  userName?: string
  todayGoal?: string
  currentStreak?: number
  className?: string
}

export default function EnhancedWelcome({
  userName,
  todayGoal,
  currentStreak = 0,
  className = '',
}: EnhancedWelcomeProps) {
  const motivation = useMemo(() => getDailyMotivation(userName, todayGoal), [userName, todayGoal])

  return (
    <div className={`bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg shadow-md p-6 border border-primary-100 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary-900 mb-2">
            {motivation.greeting}
          </h1>
          {motivation.timeBasedGreeting && (
            <p className="font-sans text-base sm:text-lg text-gray-600">
              {motivation.timeBasedGreeting}! Ready to continue your journey?
            </p>
          )}
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent bg-opacity-20 rounded-full border border-accent border-opacity-30">
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span className="font-serif text-sm font-semibold text-accent">
              {currentStreak} day streak
            </span>
          </div>
        )}
      </div>

      {/* Today's Focus */}
      {todayGoal && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-serif text-lg text-primary-900">Today's Focus</h3>
          </div>
          <p className="font-sans text-sm text-gray-700">{todayGoal}</p>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="pt-4 border-t border-primary-200">
        <p className="font-sans text-sm italic text-gray-600 text-center">
          "{motivation.motivationalQuote}"
        </p>
      </div>
    </div>
  )
}

