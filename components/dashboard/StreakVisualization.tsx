'use client'

import { useEffect, useState } from 'react'
import { StreakManager } from '@/lib/gamification/streaks'
import { getActivities } from '@/lib/utils/activityTracking'

interface StreakVisualizationProps {
  currentStreak: number
}

export default function StreakVisualization({ currentStreak }: StreakVisualizationProps) {
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    lastActiveDate: '',
  })

  useEffect(() => {
    const data = StreakManager.getStreak()
    setStreakData(data)
  }, [currentStreak])

  // Get activity dates for visualization
  const activities = getActivities(100)
  const activityDates = new Set(
    activities.map((a) => {
      const date = new Date(a.timestamp)
      return date.toISOString().split('T')[0]
    })
  )

  // Create 7x4 grid for last 28 days
  const days = 28
  const today = new Date()
  const last28Days: { date: string; hasActivity: boolean; isToday: boolean }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    last28Days.push({
      date: dateStr,
      hasActivity: activityDates.has(dateStr),
      isToday: i === 0,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-serif text-2xl text-primary-900 mb-6">
        Your Streak
      </h3>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-accent bg-opacity-10 rounded-lg p-4 border border-accent border-opacity-20">
          <p className="font-sans text-sm text-gray-600 mb-1">Current Streak</p>
          <p className="font-serif text-3xl font-bold text-accent tabular-nums flex items-center gap-2">
            {streakData.current > 0 && <span className="text-2xl">🔥</span>}
            {streakData.current} {streakData.current === 1 ? 'day' : 'days'}
          </p>
        </div>

        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <p className="font-sans text-sm text-gray-600 mb-1">Longest Streak</p>
          <p className="font-serif text-3xl font-bold text-primary-900 tabular-nums">
            {streakData.longest} {streakData.longest === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Activity Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-sm text-gray-700 font-medium">
            Last {days} Days
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent"></div>
              <span className="font-sans text-xs text-gray-600">Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-200"></div>
              <span className="font-sans text-xs text-gray-600">None</span>
            </div>
          </div>
        </div>

        {/* Activity Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2">
          {last28Days.map((day, index) => (
            <div
              key={day.date}
              className={`aspect-square rounded transition-all duration-200 ${
                day.hasActivity
                  ? 'bg-accent shadow-sm hover:scale-110'
                  : day.isToday
                  ? 'bg-accent bg-opacity-20 border-2 border-accent'
                  : 'bg-gray-200'
              }`}
              title={`${new Date(day.date).toLocaleDateString()}${
                day.hasActivity ? ' - Practice day!' : ''
              }`}
            >
              {day.isToday && !day.hasActivity && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-accent font-bold">T</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streak Warning or Encouragement */}
      {streakData.current > 0 && (
        <div className="mt-6 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-20">
          <p className="font-sans text-sm text-gray-700 text-center">
            🔥 Amazing! You're on a {streakData.current}-day streak. Keep it up!
          </p>
        </div>
      )}
    </div>
  )
}


