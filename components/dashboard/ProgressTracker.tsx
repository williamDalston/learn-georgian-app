'use client'

import { useState, useEffect } from 'react'
import logger from '@/lib/utils/logger'
import AchievementBadge from './AchievementBadge'
import { achievements, getUnlockedAchievements, unlockAchievement, type Achievement } from '@/lib/data/achievements'
import { checkLevelCompletion, checkAllLevelCompletions } from '@/lib/utils/achievementHelpers'

interface ProgressTrackerProps {
  daysPracticed?: number
  totalTime?: number // in minutes
  currentStreak?: number
  totalLessons?: number
  completedLessons?: number
}

export default function ProgressTracker({
  daysPracticed = 0,
  totalTime = 0,
  currentStreak = 0,
  totalLessons = 12,
  completedLessons = 0,
}: ProgressTrackerProps) {
  const hours = Math.floor(totalTime / 60)
  const minutes = totalTime % 60
  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0
  
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)

  // Check for new achievements
  useEffect(() => {
    const unlocked = getUnlockedAchievements()
    const unlockedIds = new Set(unlocked.map(a => a.id))
    
    // Get completed lesson IDs for level checks
    let completedLessonIds: string[] = []
    try {
      if (typeof window !== 'undefined') {
        const completed = localStorage.getItem('completedLessons')
        if (completed) {
          completedLessonIds = JSON.parse(completed) as string[]
        }
      }
    } catch (err) {
      logger.error('Failed to load completed lessons', {
        context: 'ProgressTracker',
        error: err instanceof Error ? err : new Error(String(err)),
      })
    }
    
    // Check which achievements should be unlocked
    achievements.forEach(achievement => {
      if (!unlockedIds.has(achievement.id)) {
        let shouldUnlock = false
        
        // Special handling for level completion achievements
        if (achievement.id === 'a1-complete') {
          shouldUnlock = checkLevelCompletion('A1', completedLessonIds)
        } else {
          shouldUnlock = achievement.condition({
            completedLessons,
            daysPracticed,
            currentStreak,
            totalTime,
          })
        }
        
        if (shouldUnlock) {
          unlockAchievement(achievement.id)
          setRecentAchievements(prev => [...prev, achievement])
          
          // Show achievements section if we have new ones
          setShowAchievements(true)
        }
      }
    })
  }, [completedLessons, daysPracticed, currentStreak, totalTime])

  // Load unlocked achievements with timestamps
  const unlockedAchievements = getUnlockedAchievements().map(achievement => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-serif text-2xl text-primary-900 mb-6">
        Your Progress
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-sm font-medium text-gray-700">
            Course Progress
          </span>
          <span className="font-sans text-sm font-semibold text-primary-900 tabular-nums">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-accent to-accent-dark h-full transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-20 animate-shimmer" />
            )}
          </div>
        </div>
        <p className="mt-2 font-sans text-xs text-gray-500">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Days Practiced */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-default group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg group-hover:scale-110 transition-transform">
              <svg
                className="h-5 w-5 text-primary-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm text-gray-600">Days Practiced</p>
              <p className="font-serif text-2xl font-bold text-primary-900 tabular-nums">
                {daysPracticed}
              </p>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-default group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
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
            </div>
            <div>
              <p className="font-sans text-sm text-gray-600">Current Streak</p>
              <p className="font-serif text-2xl font-bold text-accent tabular-nums">
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Time */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-default group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-100 rounded-lg group-hover:scale-110 transition-transform">
              <svg
                className="h-5 w-5 text-secondary-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm text-gray-600">Total Time</p>
              <p className="font-serif text-2xl font-bold text-secondary-900 tabular-nums">
                {hours > 0 ? `${hours}h ` : ''}{minutes}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      {currentStreak > 0 && (
        <div className="mt-6 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-20">
          <p className="font-sans text-sm text-gray-700 text-center">
            🔥 Amazing! You're on a {currentStreak}-day streak. Keep it up!
          </p>
        </div>
      )}

      {/* Achievements Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-serif text-lg text-primary-900">
            Achievements
          </h4>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="font-sans text-xs text-gray-600 hover:text-accent transition-colors"
          >
            {showAchievements ? 'Hide' : 'Show'} ({unlockedAchievements.length}/{achievements.length})
          </button>
        </div>

        {showAchievements && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {achievements.map((achievement) => {
              const unlocked = unlockedAchievements.find(a => a.id === achievement.id)
              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={{
                    ...achievement,
                    unlockedAt: unlocked?.unlockedAt,
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Quick view: Show count of unlocked achievements */}
        {!showAchievements && unlockedAchievements.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-2xl">🏆</span>
            <span className="font-sans">
              {unlockedAchievements.length} achievement{unlockedAchievements.length !== 1 ? 's' : ''} unlocked
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

