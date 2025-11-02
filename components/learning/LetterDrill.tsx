'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'
import AudioComparison from './AudioComparison'
import GlassCard from '@/components/shared/GlassCard'
import { getPronunciationTip, generateFeedback } from '@/lib/data/pronunciationTips'
import type { VocabularyItem } from '@/lib/content/types'

interface LetterDrillProps {
  letters: VocabularyItem[]
  onComplete?: () => void
  showProgress?: boolean
}

export default function LetterDrill({ letters, onComplete, showProgress = true }: LetterDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userRecording, setUserRecording] = useState<Blob | null>(null)
  const [showRecording, setShowRecording] = useState(false)
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<{ message: string; suggestions: string[] } | null>(null)

  const currentLetter = letters[currentIndex]
  const isLastLetter = currentIndex >= letters.length - 1

  const handleRecordingComplete = (blob: Blob) => {
    setUserRecording(blob)
    setShowRecording(false)

    // Simulate comparison and generate feedback
    const score = Math.floor(Math.random() * 40) + 50 // Random score 50-90
    const tip = generateFeedback(currentLetter.georgian, score)
    setFeedback(tip)
  }

  const handleNext = () => {
    if (currentLetter) {
      setCompletedLetters(new Set([...completedLetters, currentLetter.id]))
      setFeedback(null)
      setUserRecording(null)
    }

    if (isLastLetter) {
      onComplete?.()
    } else {
      setCurrentIndex(currentIndex + 1)
      setShowRecording(false)
    }
  }

  const handleStartRecording = () => {
    setShowRecording(true)
    setUserRecording(null)
    setFeedback(null)
  }

  const tip = getPronunciationTip(currentLetter?.georgian || '')

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Letter {currentIndex + 1} of {letters.length}</span>
            <span>{Math.round(((currentIndex + 1) / letters.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / letters.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {showRecording ? (
        /* Recording View */
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onRecordingCancel={() => setShowRecording(false)}
          maxDuration={10}
          title={`Practice: ${currentLetter.georgian}`}
          description="Click start to record your pronunciation"
        />
      ) : (
        /* Comparison and Feedback View */
        <div className="space-y-6">
          {/* Current Letter Display */}
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="text-7xl font-serif text-primary-900 mb-4">
                {currentLetter.georgian}
              </div>
              {currentLetter.transliteration && (
                <div className="text-3xl text-gray-600 font-sans italic mb-2">
                  {currentLetter.transliteration}
                </div>
              )}
              {currentLetter.ipa && (
                <div className="text-2xl text-gray-500 font-mono">
                  /{currentLetter.ipa.replace(/\//g, '')}/
                </div>
              )}
              <p className="text-lg text-gray-700 mt-4">{currentLetter.translation}</p>
            </div>

            {/* Pronunciation Tip */}
            {tip && (
              <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How to pronounce:
                </h4>
                <p className="text-blue-900 mb-3">{tip.description}</p>
                {tip.tips.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    {tip.tips.slice(0, 3).map((tipText, idx) => (
                      <li key={idx}>{tipText}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Audio Comparison */}
            {currentLetter.audioUrl && (
              <AudioComparison
                userAudio={userRecording}
                nativeAudioUrl={currentLetter.audioUrl}
                text={currentLetter.georgian}
                transliteration={currentLetter.transliteration}
                onNewRecording={handleStartRecording}
              />
            )}

            {/* Feedback */}
            {feedback && (
              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Feedback</h4>
                <p className="text-green-900 mb-4">{feedback.message}</p>
                {feedback.suggestions.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-green-800">
                    {feedback.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center mt-8">
              {!userRecording && !currentLetter.audioUrl && (
                <button
                  onClick={handleStartRecording}
                  className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent-dark font-medium transition-colors shadow-lg flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4zM8 14h4a2 2 0 002-2v-1h2a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a4 4 0 00-4-4H8a4 4 0 00-4 4v8a2 2 0 002 2h2v1a2 2 0 002 2z" />
                  </svg>
                  Start Recording
                </button>
              )}

              {userRecording && (
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Record Again
                </button>
              )}

              {userRecording && (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center gap-3"
                >
                  {isLastLetter ? (
                    <>
                      <span>Complete</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Next Letter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Completion Modal */}
      {isLastLetter && completedLetters.has(currentLetter.id) && (
        <GlassCard className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-primary-900 mb-4">
            Drill Complete!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Great job practicing all {letters.length} letters!
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

