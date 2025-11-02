'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import type { Exercise, Question, Option } from '@/lib/content/types'

interface MultipleChoiceExerciseProps {
  exercise: Exercise
  question: Question
  onAnswer: (questionId: string, answer: string, isCorrect: boolean) => void
  showResult?: boolean
}

export default function MultipleChoiceExercise({
  exercise,
  question,
  onAnswer,
  showResult = false,
}: MultipleChoiceExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSelect = (optionId: string) => {
    if (hasAnswered) return

    setSelectedAnswer(optionId)
    const correct = optionId === question.correctAnswer || 
                   (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionId))
    
    setIsCorrect(correct)
    setHasAnswered(true)
    onAnswer(question.id, optionId, correct)
  }

  const isSelected = (optionId: string) => selectedAnswer === optionId
  const isRightAnswer = (optionId: string) => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(optionId)
    }
    return optionId === question.correctAnswer
  }

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="mb-6">
        <p className="font-serif text-xl text-primary-900 mb-2">
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
      </div>

      {/* Options */}
      <div className="space-y-3">
        <AnimatePresence>
          {question.options?.map((option: Option, index: number) => {
            const selected = isSelected(option.id)
            const correct = isRightAnswer(option.id)
            const showFeedback = hasAnswered && showResult

            let bgClass = 'bg-white border-gray-300 hover:border-accent hover:bg-accent/5'
            let textClass = 'text-gray-900'
            
            if (showFeedback) {
              if (correct) {
                bgClass = 'bg-green-50 border-green-400 border-2'
                textClass = 'text-green-900'
              } else if (selected && !correct) {
                bgClass = 'bg-red-50 border-red-400 border-2'
                textClass = 'text-red-900'
              }
            } else if (selected) {
              bgClass = 'bg-accent/10 border-accent border-2'
              textClass = 'text-accent-900'
            }

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(option.id)}
                disabled={hasAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${bgClass} ${textClass} ${
                  hasAnswered ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-accent/50`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-sans text-base font-medium">
                        {option.text}
                      </span>
                    </div>
                    {option.textGeorgian && (
                      <p className="mt-2 ml-11 font-serif text-lg text-gray-700">
                        {option.textGeorgian}
                      </p>
                    )}
                  </div>
                  
                  {showFeedback && (
                    <div className="flex-shrink-0">
                      {correct ? (
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : selected && !correct ? (
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

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
                {isCorrect ? 'Correct!' : 'Explanation:'}
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

