'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'
import GlassCard from '@/components/shared/GlassCard'
import { motion } from 'framer-motion'

interface MinimalPair {
  id: string
  letter1: string
  letter2: string
  letter1Ipa: string
  letter2Ipa: string
  letter1Example?: { word: string; translation: string }
  letter2Example?: { word: string; translation: string }
  description: string
  audioUrl?: string
}

interface MinimalPairPracticeProps {
  pairs: MinimalPair[]
  onComplete?: () => void
}

export default function MinimalPairPractice({ pairs, onComplete }: MinimalPairPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showRecording, setShowRecording] = useState(false)
  const [userRecording, setUserRecording] = useState<Blob | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const currentPair = pairs[currentIndex]
  const isLastPair = currentIndex >= pairs.length - 1

  const handleRecordingComplete = (blob: Blob) => {
    setUserRecording(blob)
    setShowRecording(false)
  }

  const handleSelectLetter = (letter: string) => {
    if (showAnswer) return
    setSelectedLetter(letter)
    setShowAnswer(true)

    // Check if correct (this is a simplified check - in production would use audio analysis)
    const correct = Math.random() > 0.5 // Placeholder logic
    if (correct) {
      setCorrectCount(correctCount + 1)
    }
  }

  const handleNext = () => {
    setShowAnswer(false)
    setSelectedLetter(null)
    setUserRecording(null)

    if (isLastPair) {
      onComplete?.()
    } else {
      setCurrentIndex(currentIndex + 1)
      setShowRecording(false)
    }
  }

  const isCorrect = selectedLetter !== null && showAnswer

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pair {currentIndex + 1} of {pairs.length}</span>
          <span>{Math.round(((currentIndex + 1) / pairs.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / pairs.length) * 100}%` }}
          />
        </div>
      </div>

      {showRecording ? (
        /* Recording View */
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onRecordingCancel={() => setShowRecording(false)}
          maxDuration={10}
          title="Record Your Pronunciation"
          description="Listen to the sound and repeat it"
        />
      ) : (
        /* Practice View */
        <GlassCard className="p-8">
          {/* Instructions */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              Sound Discrimination Practice
            </h3>
            <p className="text-lg text-gray-600">
              {currentPair.description}
            </p>
          </div>

          {/* Pair Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Letter 1 */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: selectedLetter === currentPair.letter1 ? 1.05 : 1,
                borderColor: showAnswer
                  ? selectedLetter === currentPair.letter1
                    ? isCorrect
                      ? 'rgb(34, 197, 94)'
                      : 'rgb(239, 68, 68)'
                    : 'rgb(229, 231, 235)'
                  : 'rgb(229, 231, 235)',
              }}
              className="border-2 rounded-lg p-6 cursor-pointer transition-all"
              onClick={() => handleSelectLetter(currentPair.letter1)}
            >
              <div className="text-center mb-4">
                <div className="text-6xl font-serif text-primary-900 mb-2">
                  {currentPair.letter1}
                </div>
                <div className="text-2xl text-gray-600 font-mono">
                  /{currentPair.letter1Ipa}/
                </div>
              </div>
              {currentPair.letter1Example && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-serif text-primary-900">
                    {currentPair.letter1Example.word}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {currentPair.letter1Example.translation}
                  </div>
                </div>
              )}
              {showAnswer && selectedLetter === currentPair.letter1 && (
                <div className="mt-4 text-center">
                  {isCorrect ? (
                    <span className="text-green-600 font-bold">✓ Correct!</span>
                  ) : (
                    <span className="text-red-600 font-bold">✗ Try again</span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Letter 2 */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: selectedLetter === currentPair.letter2 ? 1.05 : 1,
                borderColor: showAnswer
                  ? selectedLetter === currentPair.letter2
                    ? isCorrect
                      ? 'rgb(34, 197, 94)'
                      : 'rgb(239, 68, 68)'
                    : 'rgb(229, 231, 235)'
                  : 'rgb(229, 231, 235)',
              }}
              className="border-2 rounded-lg p-6 cursor-pointer transition-all"
              onClick={() => handleSelectLetter(currentPair.letter2)}
            >
              <div className="text-center mb-4">
                <div className="text-6xl font-serif text-primary-900 mb-2">
                  {currentPair.letter2}
                </div>
                <div className="text-2xl text-gray-600 font-mono">
                  /{currentPair.letter2Ipa}/
                </div>
              </div>
              {currentPair.letter2Example && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-serif text-primary-900">
                    {currentPair.letter2Example.word}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {currentPair.letter2Example.translation}
                  </div>
                </div>
              )}
              {showAnswer && selectedLetter === currentPair.letter2 && (
                <div className="mt-4 text-center">
                  {isCorrect ? (
                    <span className="text-green-600 font-bold">✓ Correct!</span>
                  ) : (
                    <span className="text-red-600 font-bold">✗ Try again</span>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {!userRecording && (
              <button
                onClick={() => setShowRecording(true)}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4zM8 14h4a2 2 0 002-2v-1h2a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a4 4 0 00-4-4H8a4 4 0 00-4 4v8a2 2 0 002 2h2v1a2 2 0 002 2z" />
                </svg>
                Practice Recording
              </button>
            )}

            {showAnswer && (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-3"
              >
                {isLastPair ? 'Complete' : 'Next Pair'}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Score */}
          {showAnswer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-lg font-semibold text-blue-900">
                Score: {correctCount} / {currentIndex + 1}
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Completion Modal */}
      {isLastPair && showAnswer && (
        <GlassCard className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-primary-900 mb-4">
            Practice Complete!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Final Score: {correctCount} / {pairs.length}
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Continue Learning
          </button>
        </GlassCard>
      )}
    </div>
  )
}

