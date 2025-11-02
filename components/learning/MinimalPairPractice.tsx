'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'
import GlassCard from '@/components/shared/GlassCard'
import { motion } from 'framer-motion'
import { useLetterAudio, useMinimalPairAudio, useVocabularyAudio } from '@/lib/hooks/useAudio'

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

  // Audio hooks for each letter
  const letter1Audio = useLetterAudio(currentPair.letter1, { fallbackToTTS: true })
  const letter2Audio = useLetterAudio(currentPair.letter2, { fallbackToTTS: true })
  
  // Audio for minimal pair comparison (if audioUrl is provided)
  const pairId = currentPair.audioUrl 
    ? currentPair.audioUrl.replace('/audio/min-pairs/', '').replace('.mp3', '')
    : `${currentPair.letter1}-${currentPair.letter2}`
  const pairAudio = useMinimalPairAudio(
    currentPair.audioUrl ? pairId : null,
    { fallbackToTTS: false }
  )

  // Audio for example words (if provided)
  const letter1ExampleAudio = useVocabularyAudio(
    currentPair.letter1Example?.word || '',
    undefined,
    { fallbackToTTS: true }
  )
  const letter2ExampleAudio = useVocabularyAudio(
    currentPair.letter2Example?.word || '',
    undefined,
    { fallbackToTTS: true }
  )

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
            <p className="text-lg text-gray-600 mb-4">
              {currentPair.description}
            </p>
            {/* Play pair audio button */}
            {currentPair.audioUrl && (
              <button
                onClick={() => pairAudio.play()}
                disabled={pairAudio.isLoading || pairAudio.isPlaying}
                className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                aria-label="Play minimal pair comparison"
              >
                {pairAudio.isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </>
                ) : pairAudio.isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    Playing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Comparison
                  </>
                )}
              </button>
            )}
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
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-6xl font-serif text-primary-900">
                    {currentPair.letter1}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      letter1Audio.play()
                    }}
                    disabled={letter1Audio.isLoading || letter1Audio.isPlaying}
                    className="p-2 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50"
                    aria-label={`Play ${currentPair.letter1}`}
                    title={`Play ${currentPair.letter1}`}
                  >
                    {letter1Audio.isLoading ? (
                      <svg className="w-4 h-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : letter1Audio.isPlaying ? (
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-2xl text-gray-600 font-mono">
                  /{currentPair.letter1Ipa}/
                </div>
              </div>
              {currentPair.letter1Example && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-xl font-serif text-primary-900">
                      {currentPair.letter1Example.word}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        letter1ExampleAudio.play()
                      }}
                      disabled={letter1ExampleAudio.isLoading || letter1ExampleAudio.isPlaying}
                      className="p-1.5 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50"
                      aria-label={`Play ${currentPair.letter1Example.word}`}
                      title={`Play ${currentPair.letter1Example.word}`}
                    >
                      {letter1ExampleAudio.isLoading ? (
                        <svg className="w-3 h-3 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : letter1ExampleAudio.isPlaying ? (
                        <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
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
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-6xl font-serif text-primary-900">
                    {currentPair.letter2}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      letter2Audio.play()
                    }}
                    disabled={letter2Audio.isLoading || letter2Audio.isPlaying}
                    className="p-2 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50"
                    aria-label={`Play ${currentPair.letter2}`}
                    title={`Play ${currentPair.letter2}`}
                  >
                    {letter2Audio.isLoading ? (
                      <svg className="w-4 h-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : letter2Audio.isPlaying ? (
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-2xl text-gray-600 font-mono">
                  /{currentPair.letter2Ipa}/
                </div>
              </div>
              {currentPair.letter2Example && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-xl font-serif text-primary-900">
                      {currentPair.letter2Example.word}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        letter2ExampleAudio.play()
                      }}
                      disabled={letter2ExampleAudio.isLoading || letter2ExampleAudio.isPlaying}
                      className="p-1.5 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50"
                      aria-label={`Play ${currentPair.letter2Example.word}`}
                      title={`Play ${currentPair.letter2Example.word}`}
                    >
                      {letter2ExampleAudio.isLoading ? (
                        <svg className="w-3 h-3 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : letter2ExampleAudio.isPlaying ? (
                        <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
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

