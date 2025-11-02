'use client'

import { useEffect, useState } from 'react'
import { getNextAchievement } from '@/lib/utils/achievementHelpers'

interface NextAchievementCardProps {
  completedLessons: number
  daysPracticed: number
  currentStreak: number
  totalTime: number
  completedLessonIds?: string[]
}

export default function NextAchievementCard({
  completedLessons,
  daysPracticed,
  currentStreak,
  totalTime,
  completedLessonIds = [],
}: NextAchievementCardProps) {
  const [nextAchievement, setNextAchievement] = useState<{
    achievement: any
    progress: number
    remaining: number
    message: string
  } | null>(null)

  useEffect(() => {
    const achievementData = getNextAchievement({
      completedLessons,
      daysPracticed,
      currentStreak,
      totalTime,
      completedLessonIds,
    })
    setNextAchievement(achievementData)
  }, [completedLessons, daysPracticed, currentStreak, totalTime, completedLessonIds])

  if (!nextAchievement) return null

  return (
    <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{nextAchievement.achievement.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-primary-900 mb-1">
            Next Achievement
          </h3>
          <h4 className="font-sans text-base font-semibold text-accent mb-2">
            {nextAchievement.achievement.title}
          </h4>
          <p className="font-sans text-sm text-gray-600 mb-3">
            {nextAchievement.achievement.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-accent to-accent-dark h-full transition-all duration-500 ease-out rounded-full relative"
                style={{ width: `${nextAchievement.progress}%` }}
              >
                {nextAchievement.progress > 0 && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-shimmer" />
                )}
              </div>
            </div>
          </div>

          <p className="font-sans text-xs text-gray-600 font-medium">
            {nextAchievement.message}
          </p>
        </div>
      </div>
    </div>
  )
}



