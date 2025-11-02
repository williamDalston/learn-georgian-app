'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import MultipleChoiceExercise from './MultipleChoiceExercise'
import FillBlankExercise from './FillBlankExercise'
import MatchingExercise from './MatchingExercise'
import AudioExercise from './AudioExercise'
import WritingExercise from './WritingExercise'
import TranslationExercise from './TranslationExercise'
import type { Exercise, Question } from '@/lib/content/types'

interface ExercisePlayerProps {
  exercise: Exercise
  onQuestionComplete?: (questionId: string, isCorrect: boolean) => void
  onExerciseComplete?: (exerciseId: string, score: number, totalPoints: number) => void
  showResults?: boolean
}

export default function ExercisePlayer({
  exercise,
  onQuestionComplete,
  onExerciseComplete,
  showResults = false,
}: ExercisePlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, {
    answer: string | string[] | Blob | Array<{ left: string; right: string }> | null
    isCorrect: boolean
    answered: boolean
  }>>({})
  const [showResultsState, setShowResultsState] = useState(showResults)

  const currentQuestion = exercise.questions[currentQuestionIndex]
  const allQuestionsAnswered = exercise.questions.every(q => questionAnswers[q.id]?.answered)

  const handleAnswer = (
    questionId: string,
    answer: string | string[] | Blob | Array<{ left: string; right: string }> | null,
    isCorrect: boolean
  ) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer,
        isCorrect,
        answered: true,
      },
    }))

    onQuestionComplete?.(questionId, isCorrect)

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < exercise.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 1500)
  }

  const handleMatchingAnswer = (
    questionId: string,
    matches: Array<{ left: string; right: string }>,
    isComplete: boolean
  ) => {
    if (isComplete) {
      // For matching exercises, check if all matches are correct
      const question = exercise.questions.find(q => q.id === questionId)
      const correctMatches = question?.correctMatches || []
      
      const isCorrect = correctMatches.every(correctMatch =>
        matches.some(match => match.left === correctMatch.left && match.right === correctMatch.right)
      ) && matches.length === correctMatches.length

      setQuestionAnswers(prev => ({
        ...prev,
        [questionId]: {
          answer: matches,
          isCorrect,
          answered: true,
        },
      }))

      onQuestionComplete?.(questionId, isCorrect)

      // Auto-advance after matching is complete
      setTimeout(() => {
        if (currentQuestionIndex < exercise.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
        }
      }, 1500)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleShowResults = () => {
    setShowResultsState(true)
    
    // Calculate score
    const totalPoints = exercise.points * exercise.questions.length
    const earnedPoints = exercise.questions.reduce((sum, q) => {
      const answer = questionAnswers[q.id]
      if (answer?.isCorrect) {
        return sum + exercise.points
      }
      return sum
    }, 0)

    onExerciseComplete?.(exercise.id, earnedPoints, totalPoints)
  }

  const renderExerciseComponent = () => {
    const props = {
      exercise,
      question: currentQuestion,
      onAnswer: handleAnswer,
      showResult: showResultsState,
    }

    switch (exercise.type) {
      case 'multiple-choice':
        return <MultipleChoiceExercise {...props} />
      
      case 'fill-blank':
        return <FillBlankExercise {...props} />
      
      case 'matching':
        return (
          <MatchingExercise
            {...props}
            onAnswer={(questionId, matches, isComplete) =>
              handleMatchingAnswer(questionId, matches, isComplete)
            }
          />
        )
      
      case 'audio':
        return <AudioExercise {...props} />
      
      case 'writing':
        return <WritingExercise {...props} />
      
      case 'translation':
        return <TranslationExercise {...props} />
      
      default:
        return (
          <div className="p-6 text-center">
            <p className="font-sans text-gray-600">
              Exercise type "{exercise.type}" is not yet supported.
            </p>
          </div>
        )
    }
  }

  const calculateProgress = () => {
    const answeredCount = exercise.questions.filter(q => questionAnswers[q.id]?.answered).length
    return (answeredCount / exercise.questions.length) * 100
  }

  const calculateScore = () => {
    const correctCount = exercise.questions.filter(q => questionAnswers[q.id]?.isCorrect).length
    return {
      correct: correctCount,
      total: exercise.questions.length,
      percentage: Math.round((correctCount / exercise.questions.length) * 100),
    }
  }

  const score = calculateScore()

  return (
    <GlassCard className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-2xl text-primary-900 mb-2">
              {exercise.title}
            </h3>
            {exercise.instructions && (
              <p className="font-sans text-sm text-gray-600">
                {exercise.instructions}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="px-3 py-1.5 bg-accent/10 text-accent-700 rounded-full text-sm font-semibold border border-accent-200">
              {exercise.points} {exercise.points === 1 ? 'point' : 'points'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {exercise.questions.length}
            </span>
            <span className="font-sans text-sm font-semibold text-accent-700">
              {Math.round(calculateProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-accent to-accent-dark h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Component */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderExerciseComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-sans font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-2">
          {exercise.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-accent w-8'
                  : questionAnswers[exercise.questions[index].id]?.answered
                  ? questionAnswers[exercise.questions[index].id]?.isCorrect
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-gray-300'
              }`}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>

        {currentQuestionIndex < exercise.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!questionAnswers[currentQuestion.id]?.answered}
            className="px-4 py-2 bg-accent text-white font-sans font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : allQuestionsAnswered && !showResultsState ? (
          <button
            onClick={handleShowResults}
            className="px-4 py-2 bg-green-500 text-white font-sans font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            Show Results
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        ) : (
          <div className="px-4 py-2 bg-gray-100 text-gray-600 font-sans font-medium rounded-lg">
            Complete
          </div>
        )}
      </div>

      {/* Final Score Display */}
      {showResultsState && allQuestionsAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gradient-to-br from-accent-50 to-accent-100/50 border-2 border-accent-200 rounded-xl"
        >
          <div className="text-center">
            <h4 className="font-serif text-xl text-primary-900 mb-2">
              Exercise Complete!
            </h4>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="font-sans text-4xl font-bold text-accent-700">
                  {score.correct}/{score.total}
                </p>
                <p className="font-sans text-sm text-gray-600 mt-1">
                  Correct Answers
                </p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="font-sans text-4xl font-bold text-accent-700">
                  {score.percentage}%
                </p>
                <p className="font-sans text-sm text-gray-600 mt-1">
                  Score
                </p>
              </div>
            </div>
            {score.percentage >= 80 && (
              <p className="mt-4 font-sans text-base text-green-700 font-semibold">
                🎉 Excellent work! Keep it up!
              </p>
            )}
          </div>
        </motion.div>
      )}
    </GlassCard>
  )
}

