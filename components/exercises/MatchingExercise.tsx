'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Exercise, Question, MatchItem } from '@/lib/content/types'

interface MatchingExerciseProps {
  exercise: Exercise
  question: Question
  onAnswer: (questionId: string, matches: Array<{ left: string; right: string }>, isComplete: boolean) => void
  showResult?: boolean
}

export default function MatchingExercise({
  exercise,
  question,
  onAnswer,
  showResult = false,
}: MatchingExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Array<{ left: string; right: string }>>([])
  const [completed, setCompleted] = useState(false)

  const leftItems = question.leftItems || []
  const rightItems = question.rightItems || []
  const correctMatches = question.correctMatches || []

  const handleLeftClick = (leftId: string) => {
    if (completed) return
    
    // If already matched, unselect
    if (selectedLeft === leftId) {
      setSelectedLeft(null)
      return
    }
    
    // If already matched this left item, remove it first
    const existingMatch = matches.find(m => m.left === leftId)
    if (existingMatch) {
      setMatches(matches.filter(m => m.left !== leftId))
      setSelectedLeft(null)
      return
    }
    
    setSelectedLeft(leftId)
  }

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft || completed) return
    
    // Check if right item is already matched
    const existingMatch = matches.find(m => m.right === rightId)
    if (existingMatch) {
      // Remove existing match
      setMatches(matches.filter(m => m.right !== rightId))
    }
    
    // Add new match
    const newMatches = [
      ...matches.filter(m => m.left !== selectedLeft),
      { left: selectedLeft, right: rightId },
    ]
    
    setMatches(newMatches)
    setSelectedLeft(null)
    
    // Check if all items are matched
    const allMatched = leftItems.length > 0 && newMatches.length === leftItems.length
    setCompleted(allMatched)
    
    onAnswer(question.id, newMatches, allMatched)
  }

  const isMatched = (leftId: string) => matches.some(m => m.left === leftId)
  const getMatchForLeft = (leftId: string) => matches.find(m => m.left === leftId)?.right
  const isCorrectMatch = (leftId: string, rightId: string) => {
    return correctMatches.some(m => m.left === leftId && m.right === rightId)
  }
  const getCorrectMatch = (leftId: string) => {
    return correctMatches.find(m => m.left === leftId)?.right
  }

  const getMatchStatus = (leftId: string, rightId: string) => {
    if (!showResult || !completed) return null
    
    const matched = matches.some(m => m.left === leftId && m.right === rightId)
    if (!matched) return null
    
    return isCorrectMatch(leftId, rightId) ? 'correct' : 'incorrect'
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="mb-6">
        <p className="font-serif text-xl text-primary-900 mb-2">
          {question.question || exercise.title}
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
        <p className="font-sans text-sm text-accent-700 font-medium">
          Click an item on the left, then click its match on the right.
        </p>
      </div>

      {/* Matching Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="font-sans font-semibold text-gray-700 uppercase text-sm tracking-wide mb-3">
            Left Column
          </h3>
          {leftItems.map((item: MatchItem, index: number) => {
            const matched = isMatched(item.id)
            const matchedRightId = getMatchForLeft(item.id)
            const selected = selectedLeft === item.id
            const status = matchedRightId ? getMatchStatus(item.id, matchedRightId) : null

            let bgClass = 'bg-white border-gray-300 hover:border-accent hover:bg-accent/5'
            
            if (showResult && status) {
              bgClass = status === 'correct' 
                ? 'bg-green-50 border-green-400 border-2' 
                : 'bg-red-50 border-red-400 border-2'
            } else if (selected) {
              bgClass = 'bg-accent/20 border-accent border-2'
            } else if (matched) {
              bgClass = 'bg-gray-100 border-gray-400'
            }

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLeftClick(item.id)}
                disabled={completed && matched}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  bgClass
                } ${matched && !selected ? 'opacity-60' : ''} ${
                  completed ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-accent/50`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sans text-base font-medium text-gray-900">
                    {item.text}
                  </span>
                  {item.textGeorgian && (
                    <span className="font-serif text-lg text-gray-700">
                      {item.textGeorgian}
                    </span>
                  )}
                  {showResult && status === 'correct' && (
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {showResult && status === 'incorrect' && (
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="font-sans font-semibold text-gray-700 uppercase text-sm tracking-wide mb-3">
            Right Column
          </h3>
          {rightItems.map((item: MatchItem, index: number) => {
            const matched = matches.some(m => m.right === item.id)
            const selected = matches.some(m => 
              m.right === item.id && selectedLeft === m.left
            )
            
            let bgClass = 'bg-white border-gray-300 hover:border-accent hover:bg-accent/5'
            
            if (matched && showResult) {
              const matchedLeftId = matches.find(m => m.right === item.id)?.left
              const status = matchedLeftId ? getMatchStatus(matchedLeftId, item.id) : null
              
              if (status) {
                bgClass = status === 'correct' 
                  ? 'bg-green-50 border-green-400 border-2' 
                  : 'bg-red-50 border-red-400 border-2'
              } else {
                bgClass = 'bg-gray-100 border-gray-400'
              }
            } else if (selected) {
              bgClass = 'bg-accent/20 border-accent border-2'
            }

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleRightClick(item.id)}
                disabled={completed && matched}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  bgClass
                } ${matched && !selected ? 'opacity-60' : ''} ${
                  completed ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-accent/50`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sans text-base font-medium text-gray-900">
                    {item.text}
                  </span>
                  {item.textGeorgian && (
                    <span className="font-serif text-lg text-gray-700">
                      {item.textGeorgian}
                    </span>
                  )}
                  {showResult && matched && (() => {
                    const matchedLeftId = matches.find(m => m.right === item.id)?.left
                    const status = matchedLeftId ? getMatchStatus(matchedLeftId || '', item.id) : null
                    if (status === 'correct') {
                      return (
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )
                    }
                    if (status === 'incorrect') {
                      return (
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )
                    }
                    return null
                  })()}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Completion Status */}
      {completed && showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-sans text-base font-semibold text-green-900">
              All items matched!
            </p>
          </div>
        </motion.div>
      )}

      {/* Explanation */}
      {completed && showResult && (question.explanation || question.explanationGeorgian) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5 text-blue-600"
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

