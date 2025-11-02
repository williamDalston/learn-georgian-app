'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Exercise, Question } from '@/lib/content/types'

interface TranslationExerciseProps {
  exercise: Exercise
  question: Question
  onAnswer: (questionId: string, answer: string, isCorrect: boolean) => void
  showResult?: boolean
}

export default function TranslationExercise({
  exercise,
  question,
  onAnswer,
  showResult = false,
}: TranslationExerciseProps) {
  const [answer, setAnswer] = useState('')
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim() || hasAnswered) return

    const normalizedAnswer = answer.trim().toLowerCase()
    const correctAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.map(a => a.toLowerCase().trim())
      : [question.correctAnswer?.toLowerCase().trim() || '']
    
    const alternatives = (question.alternatives || []).map(a => a.toLowerCase().trim())
    const allCorrect = [...correctAnswers, ...alternatives]
    
    // Flexible matching for translations
    const correct = allCorrect.some(correct => {
      return normalizedAnswer === correct ||
             normalizedAnswer.includes(correct) ||
             correct.includes(normalizedAnswer)
    })
    
    setIsCorrect(correct)
    setHasAnswered(true)
    onAnswer(question.id, answer, correct)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !hasAnswered) {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-2 border-primary-200 rounded-xl p-6 mb-4">
          <p className="font-serif text-2xl text-primary-900 mb-2 text-center">
            {question.question}
          </p>
          {question.questionGeorgian && (
            <p className="font-sans text-lg text-gray-700 text-center italic">
              {question.questionGeorgian}
            </p>
          )}
        </div>
        {exercise.instructions && (
          <p className="font-sans text-sm text-gray-600 mb-4">
            {exercise.instructions}
          </p>
        )}
      </div>

      {/* Translation Direction Hint */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 mb-4">
        <p className="font-sans text-sm text-accent-900 text-center">
          Translate the text above into {question.questionGeorgian ? 'English' : 'Georgian'}
        </p>
      </div>

      {/* Input */}
      <div className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={hasAnswered}
          placeholder={question.questionGeorgian ? "Type your English translation..." : "Type your Georgian translation..."}
          className={`w-full px-4 py-3 text-lg font-sans border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 ${
            hasAnswered && showResult
              ? isCorrect
                ? 'bg-green-50 border-green-400 text-green-900'
                : 'bg-red-50 border-red-400 text-red-900'
              : 'bg-white border-gray-300 text-gray-900 hover:border-accent focus:border-accent'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        />
        
        {!hasAnswered && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full px-6 py-3 bg-accent text-white font-sans font-semibold rounded-xl hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            Submit Translation
          </button>
        )}

        {hasAnswered && showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            {isCorrect ? (
              <>
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-sans text-base font-semibold text-green-900">
                  Perfect translation!
                </p>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-sans text-base font-semibold text-red-900">
                  Not quite. Check the correct translation below.
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Correct Answer Display (if wrong) */}
      {hasAnswered && showResult && !isCorrect && question.correctAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        >
          <p className="font-sans text-sm font-semibold text-blue-900 mb-2">
            Correct translation:
          </p>
          <p className="font-serif text-lg text-blue-800">
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(' or ')
              : question.correctAnswer}
          </p>
        </motion.div>
      )}

      {/* Explanation */}
      {hasAnswered && showResult && (question.explanation || question.explanationGeorgian) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border-2 ${
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <svg
              className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                isCorrect ? 'text-green-600' : 'text-blue-600'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-sans text-sm font-semibold mb-1 text-gray-900">
                {isCorrect ? 'Excellent work!' : 'Translation Notes:'}
              </p>
              {question.explanation && (
                <p className="font-sans text-sm text-gray-800 mb-2">
                  {question.explanation}
                </p>
              )}
              {question.explanationGeorgian && (
                <p className="font-serif text-base text-gray-700 italic">
                  {question.explanationGeorgian}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

