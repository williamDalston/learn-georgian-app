'use client'

import { useEffect, useState } from 'react'
import { ranks, getRankByLessons, getRankProgress, type Rank } from '@/lib/gamification/ranks'

interface LearnerRankProps {
  completedLessons: number
}

export default function LearnerRank({ completedLessons }: LearnerRankProps) {
  const [currentRank, setCurrentRank] = useState<Rank>(ranks[0])
  const [rankProgress, setRankProgress] = useState({
    progress: 0,
    nextRank: null as Rank | null,
    lessonsUntilNext: 0,
  })

  useEffect(() => {
    const rank = getRankByLessons(completedLessons)
    const progress = getRankProgress(completedLessons, rank)
    
    setCurrentRank(rank)
    setRankProgress(progress)
  }, [completedLessons])

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200 p-6">
      <h3 className="font-serif text-2xl text-primary-900 mb-6">
        Your Rank
      </h3>

      {/* Current Rank Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div 
            className="text-6xl mb-3"
            style={{ filter: `drop-shadow(0 0 10px ${currentRank.color}40)` }}
          >
            {currentRank.icon}
          </div>
          <h4 
            className="font-serif text-2xl font-bold mb-1"
            style={{ color: currentRank.color }}
          >
            {currentRank.name}
          </h4>
          <p className="font-sans text-sm text-gray-600">
            {currentRank.description}
          </p>
        </div>
      </div>

      {/* Progress to Next Rank */}
      {rankProgress.nextRank && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-sm text-gray-700">
              Progress to {rankProgress.nextRank.icon} {rankProgress.nextRank.name}
            </p>
            <p className="font-sans text-sm font-semibold text-gray-700">
              {rankProgress.progress.toFixed(0)}%
            </p>
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full relative"
              style={{
                width: `${rankProgress.progress}%`,
                background: `linear-gradient(90deg, ${currentRank.color}, ${rankProgress.nextRank.color})`,
              }}
            >
              {rankProgress.progress > 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-20 animate-shimmer" />
              )}
            </div>
          </div>
          <p className="font-sans text-xs text-gray-600 mt-2 text-center">
            {rankProgress.lessonsUntilNext > 0
              ? `${rankProgress.lessonsUntilNext} more lesson${
                  rankProgress.lessonsUntilNext !== 1 ? 's' : ''
                } to level up!`
              : 'Complete your next lesson to level up!'}
          </p>
        </div>
      )}

      {/* All Ranks Preview */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-sans text-xs text-gray-600 mb-3 text-center">
          All Ranks
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ranks.map((rank) => {
            const isCurrent = rank.id === currentRank.id
            const isAchieved = completedLessons >= rank.minLessons
            
            return (
              <div
                key={rank.id}
                className={`text-center p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-accent bg-opacity-20 scale-105'
                    : isAchieved
                    ? 'bg-gray-100'
                    : 'bg-gray-50 opacity-40'
                }`}
                title={rank.name}
              >
                <div className="text-2xl mb-1">{rank.icon}</div>
                <p className="font-sans text-xs font-medium text-gray-700 line-clamp-1">
                  {rank.name}
                </p>
                {isCurrent && (
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mt-1"></span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

