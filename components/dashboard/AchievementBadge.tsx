'use client'

import { useEffect, useState } from 'react'
import { triggerConfetti } from './ConfettiAnimation'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
}

interface AchievementBadgeProps {
  achievement: Achievement
  onUnlock?: (id: string) => void
}

export default function AchievementBadge({
  achievement,
  onUnlock,
}: AchievementBadgeProps) {
  const [isUnlocked, setIsUnlocked] = useState(!!achievement.unlockedAt)
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    if (achievement.unlockedAt && !isUnlocked) {
      setIsUnlocked(true)
      setIsCelebrating(true)
      onUnlock?.(achievement.id)

      // Trigger confetti celebration
      triggerConfetti({ variant: 'celebratory', intensity: 'medium' })

      // Show celebration animation
      setTimeout(() => {
        setIsCelebrating(false)
      }, 3000)
    }
  }, [achievement.unlockedAt, isUnlocked, achievement.id, onUnlock])

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        isUnlocked
          ? 'bg-accent bg-opacity-10 border-accent shadow-md'
          : 'bg-neutral-50 border-gray-200 opacity-60'
      } ${isCelebrating ? 'animate-pulse scale-105' : ''}`}
    >
      {isCelebrating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`text-3xl flex-shrink-0 ${isUnlocked ? '' : 'grayscale opacity-50'}`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-serif text-sm font-semibold ${
              isUnlocked ? 'text-primary-900' : 'text-gray-500'
            }`}
          >
            {achievement.title}
          </h4>
          <p
            className={`font-sans text-xs mt-1 ${
              isUnlocked ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            {achievement.description}
          </p>
          {achievement.unlockedAt && (
            <p className="font-sans text-xs text-gray-500 mt-2">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
        {isUnlocked && (
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-accent"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

// Achievement Celebration Modal
export function AchievementCelebration({ achievement }: { achievement?: Achievement }) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti celebration
      triggerConfetti({ variant: 'celebratory', intensity: 'high' })
    }
  }, [achievement])

  if (!achievement) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center animate-fade-in transform scale-100 animate-pulse">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 className="font-serif text-2xl text-primary-900 mb-2">Achievement Unlocked!</h3>
        <div className="text-5xl mb-4 animate-pulse">{achievement.icon}</div>
        <h4 className="font-serif text-xl text-primary-900 mb-2 font-bold">{achievement.title}</h4>
        <p className="font-sans text-gray-600 mb-4">{achievement.description}</p>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="font-sans text-sm text-gray-500">Keep going! You're making great progress!</p>
        </div>
      </div>
    </div>
  )
}

