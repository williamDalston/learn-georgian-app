'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import CTAButton from '@/components/shared/CTAButton'
import SoundPlayground from './SoundPlayground'
import PhonologyAwareness from './PhonologyAwareness'
import MouthPositionGuide from './MouthPositionGuide'

interface BootcampStage {
  id: string
  title: string
  description: string
  component: React.ReactNode
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const bootcampStages: BootcampStage[] = [
  {
    id: 'vowels',
    title: 'Stage 1: Master the 5 Vowels',
    description: 'Start with the foundation - Georgian\'s 5 vowel sounds. Simple, clear, and essential.',
    component: <SoundPlayground letters={[]} />,
    duration: '15 minutes',
    difficulty: 'beginner',
  },
  {
    id: 'familiar-consonants',
    title: 'Stage 2: Familiar Consonants',
    description: 'Learn consonants that exist in English: [b], [d], [g], [l], [m], [n], [s], [v], [z].',
    component: <SoundPlayground letters={[]} />,
    duration: '20 minutes',
    difficulty: 'beginner',
  },
  {
    id: 'aspirated-consonants',
    title: 'Stage 3: Aspirated Consonants',
    description: 'Master the aspirated sounds [pʰ], [tʰ], [kʰ], [tʃʰ]. These have a strong puff of air.',
    component: <PhonologyAwareness exerciseType="minimal-pairs" />,
    duration: '25 minutes',
    difficulty: 'beginner',
  },
  {
    id: 'ejective-consonants',
    title: 'Stage 4: Ejective Consonants',
    description: 'The most challenging sounds: ejectives [kʼ], [pʼ], [tʼ], [tsʼ], [tʃʼ], [qʼ].',
    component: <MouthPositionGuide />,
    duration: '30 minutes',
    difficulty: 'intermediate',
  },
  {
    id: 'special-sounds',
    title: 'Stage 5: Special Sounds',
    description: 'Master the trilled R, guttural sounds, and other unique Georgian sounds.',
    component: <MouthPositionGuide />,
    duration: '25 minutes',
    difficulty: 'intermediate',
  },
  {
    id: 'final-mastery',
    title: 'Stage 6: Final Mastery Test',
    description: 'Test your pronunciation across all sounds. Get personalized feedback on areas to improve.',
    component: <PhonologyAwareness exerciseType="minimal-pairs" />,
    duration: '20 minutes',
    difficulty: 'advanced',
  },
]

export default function PronunciationBootcamp() {
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set())
  const [overallProgress, setOverallProgress] = useState(0)

  const handleStageComplete = () => {
    const newCompleted = new Set(completedStages)
    newCompleted.add(currentStage)
    setCompletedStages(newCompleted)
    
    // Update overall progress
    const progress = (newCompleted.size / bootcampStages.length) * 100
    setOverallProgress(progress)

    // Move to next stage
    if (currentStage < bootcampStages.length - 1) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handleNext = () => {
    if (currentStage < bootcampStages.length - 1) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1)
    }
  }

  const currentStageData = bootcampStages[currentStage]
  const isCompleted = completedStages.has(currentStage)
  const canProceed = currentStage < bootcampStages.length - 1
  const allComplete = completedStages.size === bootcampStages.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-primary-900 mb-2">
              Pronunciation Bootcamp
            </h1>
            <p className="text-gray-600">
              Master Georgian pronunciation in 6 progressive stages. Build from vowels to advanced sounds.
            </p>
          </div>
          {allComplete && (
            <div className="text-4xl">🎉</div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: `${overallProgress}%` }}
              animate={{ width: `${overallProgress}%` }}
              className="bg-gradient-to-r from-accent to-accent-dark h-full"
            />
          </div>
        </div>

        {/* Stage Progress Indicators */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {bootcampStages.map((stage, index) => {
            const isCurrent = index === currentStage
            const isDone = completedStages.has(index)
            const isAccessible = index === 0 || completedStages.has(index - 1) || isCurrent

            return (
              <button
                key={stage.id}
                onClick={() => isAccessible && setCurrentStage(index)}
                disabled={!isAccessible}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg transition-all text-sm
                  ${isCurrent
                    ? 'bg-accent text-white shadow-lg'
                    : isDone
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : isAccessible
                    ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {isDone && <span>✓</span>}
                  {isCurrent && <span>●</span>}
                  <span>{index + 1}</span>
                </div>
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Current Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <GlassCard className="p-6">
            {/* Stage Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${currentStageData.difficulty === 'beginner'
                    ? 'bg-blue-100 text-blue-700'
                    : currentStageData.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }
                `}>
                  {currentStageData.difficulty.toUpperCase()}
                </div>
                <div className="text-sm text-gray-500">
                  {currentStageData.duration}
                </div>
                {isCompleted && (
                  <div className="text-green-600 text-sm font-semibold">
                    ✓ Completed
                  </div>
                )}
              </div>
              <h2 className="font-serif text-2xl text-primary-900 mb-2">
                {currentStageData.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentStageData.description}
              </p>
            </div>

            {/* Stage Content */}
            <div className="mb-6">
              {currentStageData.component}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStage === 0}
                className={`
                  px-6 py-3 rounded-lg transition-colors font-semibold
                  ${currentStage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }
                `}
              >
                ← Previous
              </button>

              {!isCompleted && !allComplete && (
                <CTAButton
                  onClick={handleStageComplete}
                  className="flex-1"
                >
                  Mark Complete
                </CTAButton>
              )}

              {isCompleted && canProceed && (
                <CTAButton
                  onClick={handleNext}
                  className="flex-1"
                >
                  Continue to Next Stage →
                </CTAButton>
              )}

              {allComplete && (
                <div className="flex-1 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-gray-600 mb-4">
                    Congratulations! You've completed the Pronunciation Bootcamp!
                  </p>
                  <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-semibold">
                    Take Final Assessment
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Completion Celebration */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="font-serif text-2xl text-primary-900 mb-2">
            Bootcamp Mastery Achieved!
          </h3>
          <p className="text-gray-600 mb-4">
            You've demonstrated mastery of all Georgian pronunciation fundamentals.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-semibold">
              Certificate
            </button>
            <button className="px-6 py-3 bg-white text-primary-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-primary-200">
              Continue to Lessons
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

