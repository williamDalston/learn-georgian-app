'use client'

import { useEffect, useState } from 'react'
import { getUnlockedAchievements } from '@/lib/data/achievements'

interface AchievementCarouselProps {
  interval?: number
}

export default function AchievementCarousel({ interval = 5000 }: AchievementCarouselProps) {
  const [achievements, setAchievements] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const unlocked = getUnlockedAchievements().map(achievement => {
      try {
        const timestamps = localStorage.getItem('achievementTimestamps')
        const timestampMap = timestamps ? JSON.parse(timestamps) : {}
        const unlockedAt = timestampMap[achievement.id]
        return {
          ...achievement,
          unlockedAt: unlockedAt ? new Date(unlockedAt) : undefined,
        }
      } catch {
        return achievement
      }
    })

    // Sort by most recent first
    unlocked.sort((a, b) => {
      if (!a.unlockedAt) return 1
      if (!b.unlockedAt) return -1
      return b.unlockedAt.getTime() - a.unlockedAt.getTime()
    })

    setAchievements(unlocked)
  }, [])

  // Auto-rotate through achievements
  useEffect(() => {
    if (achievements.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % achievements.length)
    }, interval)

    return () => clearInterval(timer)
  }, [achievements.length, interval, isPaused])

  if (achievements.length === 0) return null

  const currentAchievement = achievements[currentIndex]

  return (
    <div
      className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200 p-6 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-lg text-primary-900">
            Recent Achievements
          </h3>
          <span className="font-sans text-xs text-gray-500">
            ({achievements.length})
          </span>
        </div>

        {/* Pagination Dots */}
        {achievements.length > 1 && (
          <div className="flex items-center gap-2">
            {achievements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-accent w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to achievement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-5xl flex-shrink-0 animate-bounce">
          {currentAchievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-xl font-bold text-primary-900 mb-1">
            {currentAchievement.title}
          </h4>
          <p className="font-sans text-sm text-gray-600 mb-2">
            {currentAchievement.description}
          </p>
          {currentAchievement.unlockedAt && (
            <p className="font-sans text-xs text-gray-500">
              Unlocked {currentAchievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Navigation Arrows */}
        {achievements.length > 1 && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? achievements.length - 1 : currentIndex - 1
                )
              }
              className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
              aria-label="Previous achievement"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % achievements.length)}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
              aria-label="Next achievement"
            >
              <svg
                className="w-4 h-4 text-gray-600"
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
          </div>
        )}
      </div>
    </div>
  )
}


