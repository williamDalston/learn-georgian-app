'use client'

import { useState, useEffect } from 'react'
import AchievementBadge from './AchievementBadge'
import { achievements, getUnlockedAchievements, type Achievement } from '@/lib/data/achievements'
import type { AchievementCategory } from '@/lib/data/achievements'

const categories: (AchievementCategory | 'all')[] = ['all', 'lessons', 'streaks', 'time', 'milestones']

const categoryNames: Record<AchievementCategory | 'all', string> = {
  all: 'All Achievements',
  lessons: 'Lessons',
  streaks: 'Streaks',
  time: 'Time',
  milestones: 'Milestones',
}

const categoryIcons: Record<AchievementCategory | 'all', string> = {
  all: '🏆',
  lessons: '📚',
  streaks: '🔥',
  time: '⏰',
  milestones: '🎯',
}

export default function AchievementCollection() {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('date')

  useEffect(() => {
    const unlocked = getUnlockedAchievements().map((achievement) => {
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
    setUnlockedAchievements(unlocked)
  }, [])

  const filteredAchievements = achievements
    .map((achievement) => {
      const unlocked = unlockedAchievements.find((a) => a.id === achievement.id)
      return {
        ...achievement,
        unlockedAt: unlocked?.unlockedAt,
      }
    })
    .filter((achievement) => {
      if (selectedCategory === 'all') return true
      return achievement.category === selectedCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
          // Unlocked achievements first, then by date, then by name
          if (a.unlockedAt && b.unlockedAt) {
            return b.unlockedAt.getTime() - a.unlockedAt.getTime()
          }
          if (a.unlockedAt) return -1
          if (b.unlockedAt) return 1
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'all') {
      acc['all'] = achievements.length
    } else {
      acc[cat] = achievements.filter((a) => a.category === cat).length
    }
    return acc
  }, {} as Record<string, number>)

  const unlockedCounts = categories.reduce((acc, cat) => {
    if (cat === 'all') {
      acc['all'] = unlockedAchievements.length
    } else {
      acc[cat] = unlockedAchievements.filter((a) => a.category === cat).length
    }
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-primary-900 mb-2">
          Achievements Collection
        </h1>
        <p className="font-sans text-base text-gray-600">
          Unlock achievements as you progress through your learning journey
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-sans text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{categoryIcons[category as AchievementCategory | 'all']}</span>
              <span>{categoryNames[category as AchievementCategory | 'all']}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedCategory === category
                    ? 'bg-white bg-opacity-30'
                    : unlockedCounts[category] === categoryCounts[category]
                    ? 'bg-accent text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {unlockedCounts[category]}/{categoryCounts[category]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4 flex items-center justify-between">
        <p className="font-sans text-sm text-gray-600">
          Showing {filteredAchievements.length} achievement{filteredAchievements.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <label className="font-sans text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="font-sans text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="date">Date Unlocked</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="font-serif text-xl text-gray-700 mb-2">
            No achievements in this category yet
          </h3>
          <p className="font-sans text-sm text-gray-500">
            Keep learning to unlock more achievements!
          </p>
        </div>
      )}
    </div>
  )
}

