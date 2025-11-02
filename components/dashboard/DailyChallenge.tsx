'use client'

import { useEffect, useState } from 'react'
import {
  getDailyChallenges,
  updateChallengeProgress,
  completeChallenge,
  getChallengeProgress,
  type DailyChallenge as ChallengeType,
} from '@/lib/gamification/challenges'
import { PointsManager } from '@/lib/gamification/points'
import { useToast } from '@/lib/hooks/useToast'

export default function DailyChallenge() {
  const [challenges, setChallenges] = useState<ChallengeType[]>([])
  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({})
  const { showToast } = useToast()

  useEffect(() => {
    const todayChallenges = getDailyChallenges()
    setChallenges(todayChallenges)
  }, [])

  const handleChallengeCheck = (challenge: ChallengeType) => {
    if (challenge.completed) return

    // Mark as complete locally first for instant feedback
    setIsChecked({ ...isChecked, [challenge.id]: true })

    // Complete the challenge
    const updated = completeChallenge(challenge.id)
    setChallenges(updated)

    // Award points
    PointsManager.addPoints('daily_goal', challenge.title)

    showToast(
      `🎉 Challenge complete! +${challenge.pointsReward} points`,
      'success',
      3000
    )
  }

  const progressPercentage = (challenge: ChallengeType) => {
    return getChallengeProgress(challenge)
  }

  const completedCount = challenges.filter((c) => c.completed).length
  const totalCount = challenges.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-primary-900">
          Daily Challenges
        </h3>
        <div className="flex items-center gap-2 bg-accent bg-opacity-10 px-3 py-1 rounded-full">
          <span className="text-2xl">✅</span>
          <span className="font-sans text-sm font-semibold text-accent tabular-nums">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {totalCount === 0 && (
        <div className="text-center py-8">
          <p className="font-sans text-gray-600">
            No challenges for today. Check back tomorrow!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = progressPercentage(challenge)
          const isComplete = challenge.completed || isChecked[challenge.id]

          return (
            <div
              key={challenge.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                isComplete
                  ? 'bg-accent bg-opacity-10 border-accent'
                  : 'bg-neutral-50 border-gray-200'
              }`}
            >
              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleChallengeCheck(challenge)}
                  disabled={challenge.completed}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isComplete
                      ? 'bg-accent border-accent'
                      : 'border-gray-300 hover:border-accent'
                  } ${
                    challenge.completed ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                  }`}
                  aria-label={`Mark ${challenge.title} as complete`}
                >
                  {isComplete && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Challenge Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{challenge.icon}</span>
                    <h4 className="font-serif text-base font-semibold text-primary-900">
                      {challenge.title}
                    </h4>
                  </div>
                  <p className="font-sans text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  {!isComplete && (
                    <div className="mb-2">
                      <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-accent to-accent-dark h-full transition-all duration-500 ease-out rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-sans text-xs text-gray-500">
                          {challenge.current}/{challenge.target}
                        </p>
                        <p className="font-sans text-xs text-gray-500">
                          +{challenge.pointsReward} points
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Completed State */}
                  {isComplete && (
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-xs text-accent font-semibold">
                        ✅ Completed!
                      </p>
                      <p className="font-sans text-xs text-gray-500">
                        +{challenge.pointsReward} points earned
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Encouragement */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-6 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-20">
          <p className="font-sans text-sm text-gray-700 text-center">
            🎉 Amazing! You've completed all daily challenges!
          </p>
        </div>
      )}
    </div>
  )
}

