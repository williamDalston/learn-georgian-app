'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Exercise, Question } from '@/lib/content/types'

interface WritingExerciseProps {
  exercise: Exercise
  question: Question
  onAnswer: (questionId: string, answer: string, isCorrect: boolean) => void
  showResult?: boolean
}

export default function WritingExercise({
  exercise,
  question,
  onAnswer,
  showResult = false,
}: WritingExerciseProps) {
  const [answer, setAnswer] = useState('')
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim() || hasAnswered) return

    const normalizedAnswer = answer.trim()
    const correctAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer || '']
    
    const alternatives = (question.alternatives || []).map(a => a.trim())
    const allCorrect = [...correctAnswers, ...alternatives].map(a => a.trim())
    
    // For writing exercises, we'll do a flexible comparison
    const correct = allCorrect.some(correct => {
      const normalizedCorrect = correct.toLowerCase().trim()
      const normalizedUser = normalizedAnswer.toLowerCase().trim()
      return normalizedUser === normalizedCorrect || 
             normalizedUser.includes(normalizedCorrect) ||
             normalizedCorrect.includes(normalizedUser)
    })
    
    setIsCorrect(correct)
    setHasAnswered(true)
    onAnswer(question.id, answer, correct)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey && !hasAnswered) {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="mb-6">
        <p className="font-serif text-xl text-primary-900 mb-2 leading-relaxed">
          {question.question}
        </p>
        {question.questionGeorgian && (
          <p className="font-sans text-lg text-gray-700 italic mb-4">
            {question.questionGeorgian}
          </p>
        )}
        {exercise.instructions && (
          <p className="font-sans text-sm text-gray-600 mb-4">
            {exercise.instructions}
          </p>
        )}
        <p className="font-sans text-xs text-gray-500 italic">
          Tip: Press Ctrl+Enter to submit
        </p>
      </div>

      {/* Textarea */}
      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={hasAnswered}
          placeholder="Type your answer in Georgian here..."
          rows={6}
          className={`w-full px-4 py-3 text-base font-sans border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none ${
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
            Submit Answer
          </button>
        )}

        {hasAnswered && showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            {isCorrect ? (
              <>
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-sans text-base font-semibold text-green-900">
                  Correct!
                </p>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-sans text-base font-semibold text-red-900">
                  Not quite right. Check the explanation below.
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
            Correct answer:
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
                {isCorrect ? 'Great work!' : 'Explanation:'}
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

