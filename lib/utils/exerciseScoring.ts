// Exercise scoring and validation utilities

import type { Exercise, Question } from '@/lib/content/types'

export interface ExerciseResult {
  exerciseId: string
  questionResults: QuestionResult[]
  totalPoints: number
  earnedPoints: number
  percentage: number
  completedAt: Date
}

export interface QuestionResult {
  questionId: string
  answer: string | string[] | Blob | Array<{ left: string; right: string }> | null
  isCorrect: boolean
  answeredAt: Date
}

export interface ExerciseProgress {
  exerciseId: string
  questionAnswers: Record<string, QuestionResult>
  currentQuestionIndex: number
  completed: boolean
}

/**
 * Validate an answer against the correct answer
 */
export function validateAnswer(
  question: Question,
  answer: string | string[] | Blob | Array<{ left: string; right: string }> | null
): boolean {
  if (!answer && answer !== '') return false

  // Handle matching exercises
  if (Array.isArray(answer) && answer.length > 0 && 'left' in answer[0]) {
    const matches = answer as Array<{ left: string; right: string }>
    const correctMatches = question.correctMatches || []
    
    if (matches.length !== correctMatches.length) return false
    
    return correctMatches.every(correctMatch =>
      matches.some(match => match.left === correctMatch.left && match.right === correctMatch.right)
    )
  }

  // Handle blob/audio answers (always consider correct for now)
  if (answer instanceof Blob) {
    return true // Audio exercises are auto-approved
  }

  // Handle string or array of strings
  const normalizedAnswer = typeof answer === 'string' 
    ? answer.toLowerCase().trim()
    : Array.isArray(answer)
    ? answer.map(a => String(a).toLowerCase().trim())
    : []

  const correctAnswers = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.map(a => String(a).toLowerCase().trim())
    : [String(question.correctAnswer || '').toLowerCase().trim()]

  const alternatives = (question.alternatives || []).map(a => String(a).toLowerCase().trim())
  const allCorrect = [...correctAnswers, ...alternatives]

  if (typeof normalizedAnswer === 'string') {
    return allCorrect.some(correct => {
      return normalizedAnswer === correct ||
             normalizedAnswer.includes(correct) ||
             correct.includes(normalizedAnswer)
    })
  }

  if (Array.isArray(normalizedAnswer)) {
    return normalizedAnswer.every(ans =>
      allCorrect.some(correct =>
        ans === correct || ans.includes(correct) || correct.includes(ans)
      )
    )
  }

  return false
}

/**
 * Calculate exercise score
 */
export function calculateExerciseScore(
  exercise: Exercise,
  questionResults: QuestionResult[]
): { earnedPoints: number; totalPoints: number; percentage: number } {
  const totalPoints = exercise.points * exercise.questions.length
  const earnedPoints = questionResults.reduce((sum, result) => {
    if (result.isCorrect) {
      return sum + exercise.points
    }
    return sum
  }, 0)

  const percentage = totalPoints > 0 
    ? Math.round((earnedPoints / totalPoints) * 100)
    : 0

  return { earnedPoints, totalPoints, percentage }
}

/**
 * Save exercise progress to localStorage
 */
export function saveExerciseProgress(
  lessonId: string,
  exerciseId: string,
  progress: ExerciseProgress
): void {
  try {
    const key = `exerciseProgress_${lessonId}_${exerciseId}`
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save exercise progress:', error)
  }
}

/**
 * Load exercise progress from localStorage
 */
export function loadExerciseProgress(
  lessonId: string,
  exerciseId: string
): ExerciseProgress | null {
  try {
    const key = `exerciseProgress_${lessonId}_${exerciseId}`
    const stored = localStorage.getItem(key)
    if (!stored) return null

    const progress = JSON.parse(stored)
    // Convert answeredAt strings back to Date objects
    Object.values(progress.questionAnswers).forEach((result: any) => {
      if (result.answeredAt) {
        result.answeredAt = new Date(result.answeredAt)
      }
    })

    return progress as ExerciseProgress
  } catch (error) {
    console.error('Failed to load exercise progress:', error)
    return null
  }
}

/**
 * Save exercise result
 */
export function saveExerciseResult(result: ExerciseResult): void {
  try {
    const key = `exerciseResult_${result.exerciseId}`
    const results = loadExerciseResults()
    results[result.exerciseId] = result
    localStorage.setItem('exerciseResults', JSON.stringify(results))
  } catch (error) {
    console.error('Failed to save exercise result:', error)
  }
}

/**
 * Load all exercise results
 */
export function loadExerciseResults(): Record<string, ExerciseResult> {
  try {
    const stored = localStorage.getItem('exerciseResults')
    if (!stored) return {}

    const results = JSON.parse(stored)
    // Convert dates back to Date objects
    Object.values(results).forEach((result: any) => {
      result.completedAt = new Date(result.completedAt)
      result.questionResults.forEach((qr: any) => {
        qr.answeredAt = new Date(qr.answeredAt)
      })
    })

    return results
  } catch (error) {
    console.error('Failed to load exercise results:', error)
    return {}
  }
}

/**
 * Get exercise statistics for a lesson
 */
export function getLessonExerciseStats(lessonId: string): {
  totalExercises: number
  completedExercises: number
  averageScore: number
  exercises: Array<{
    exerciseId: string
    score: number
    completed: boolean
  }>
} {
  const results = loadExerciseResults()
  const lessonResults = Object.values(results).filter(r =>
    r.exerciseId.startsWith(`${lessonId}_`)
  )

  const totalExercises = lessonResults.length
  const completedExercises = lessonResults.filter(r => r.percentage > 0).length
  const averageScore = lessonResults.length > 0
    ? Math.round(
        lessonResults.reduce((sum, r) => sum + r.percentage, 0) / lessonResults.length
      )
    : 0

  const exercises = lessonResults.map(r => ({
    exerciseId: r.exerciseId,
    score: r.percentage,
    completed: r.percentage > 0,
  }))

  return {
    totalExercises,
    completedExercises,
    averageScore,
    exercises,
  }
}

