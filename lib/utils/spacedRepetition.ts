/**
 * Spaced Repetition System (SM-2 Algorithm)
 * Based on SuperMemo 2 algorithm for optimal review scheduling
 */

import logger from './logger'
import { storageHelpers } from './storage'

export interface FlashcardData {
  id: string
  vocabularyId: string
  lessonId: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  easinessFactor: number // EF starts at 2.5
  interval: number // Days until next review
  repetitions: number // Number of successful reviews
  nextReviewDate: number // Timestamp
  lastReviewDate?: number // Timestamp
  masteryStatus: 'new' | 'learning' | 'reviewing' | 'mastered'
  reviewHistory: ReviewRecord[]
  createdAt: number // Timestamp
}

export interface ReviewRecord {
  date: number
  quality: number // 0-5 rating
  interval: number
  easinessFactor: number
}

/**
 * SM-2 Algorithm Parameters
 */
const INITIAL_EF = 2.5
const MIN_EF = 1.3
const QUALITY_THRESHOLD_MASTERED = 4 // Quality >= 4 is considered good

/**
 * Calculate next review interval using SM-2 algorithm
 */
export function calculateNextInterval(
  quality: number, // 0-5: 0=blackout, 3=pass, 4=good, 5=perfect
  easinessFactor: number,
  interval: number,
  repetitions: number
): { newInterval: number; newEF: number; newRepetitions: number } {
  // Update easiness factor
  let newEF =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEF = Math.max(newEF, MIN_EF)

  // Calculate new interval
  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    // Failed review - reset to beginning
    newInterval = 1
    newRepetitions = 0
  } else {
    // Successful review
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * newEF)
    }
  }

  return { newInterval, newEF, newRepetitions }
}

/**
 * Get mastery status based on repetitions and interval
 */
export function getMasteryStatus(
  repetitions: number,
  interval: number,
  quality: number
): FlashcardData['masteryStatus'] {
  if (repetitions === 0) return 'new'
  if (repetitions < 3 || interval < 7) return 'learning'
  if (interval >= 30 && quality >= 4) return 'mastered'
  return 'reviewing'
}

/**
 * Review a flashcard with quality rating
 */
export function reviewFlashcard(
  flashcard: FlashcardData,
  quality: number // 0-5 rating
): FlashcardData {
  const now = Date.now()
  const { newInterval, newEF, newRepetitions } = calculateNextInterval(
    quality,
    flashcard.easinessFactor,
    flashcard.interval,
    flashcard.repetitions
  )

  const masteryStatus = getMasteryStatus(newRepetitions, newInterval, quality)

  const reviewRecord: ReviewRecord = {
    date: now,
    quality,
    interval: newInterval,
    easinessFactor: newEF,
  }

  return {
    ...flashcard,
    easinessFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: now + newInterval * 24 * 60 * 60 * 1000, // Convert days to ms
    lastReviewDate: now,
    masteryStatus,
    reviewHistory: [...flashcard.reviewHistory, reviewRecord],
  }
}

/**
 * Get flashcards due for review
 */
export function getDueFlashcards(flashcards: FlashcardData[]): FlashcardData[] {
  const now = Date.now()
  return flashcards.filter(
    (card) => card.nextReviewDate <= now || card.masteryStatus === 'new'
  )
}

/**
 * Get flashcards by mastery status
 */
export function getFlashcardsByMastery(
  flashcards: FlashcardData[],
  status: FlashcardData['masteryStatus']
): FlashcardData[] {
  return flashcards.filter((card) => card.masteryStatus === status)
}

/**
 * Get flashcards by lesson
 */
export function getFlashcardsByLesson(
  flashcards: FlashcardData[],
  lessonId: string
): FlashcardData[] {
  return flashcards.filter((card) => card.lessonId === lessonId)
}

/**
 * Get flashcards by level
 */
export function getFlashcardsByLevel(
  flashcards: FlashcardData[],
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
): FlashcardData[] {
  return flashcards.filter((card) => card.level === level)
}

/**
 * Storage key for flashcards
 */
const FLASHCARDS_STORAGE_KEY = 'vocabulary_flashcards'

/**
 * Load flashcards from storage
 */
export function loadFlashcards(): FlashcardData[] {
  try {
    const cards = storageHelpers.getJSON<FlashcardData[]>(
      FLASHCARDS_STORAGE_KEY,
      []
    )
    return cards || []
  } catch (error) {
    logger.error('Failed to load flashcards', {
      context: 'spacedRepetition',
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return []
  }
}

/**
 * Save flashcards to storage
 */
export function saveFlashcards(flashcards: FlashcardData[]): void {
  try {
    storageHelpers.setJSON(FLASHCARDS_STORAGE_KEY, flashcards)
  } catch (error) {
    logger.error('Failed to save flashcards', {
      context: 'spacedRepetition',
      error: error instanceof Error ? error : new Error(String(error)),
    })
  }
}

/**
 * Create a new flashcard from vocabulary item
 */
export function createFlashcard(
  vocabularyId: string,
  lessonId: string,
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
): FlashcardData {
  const now = Date.now()
  return {
    id: `${vocabularyId}-${lessonId}-${now}`, // Unique ID
    vocabularyId,
    lessonId,
    level,
    easinessFactor: INITIAL_EF,
    interval: 0,
    repetitions: 0,
    nextReviewDate: now, // Review immediately (new card)
    masteryStatus: 'new',
    reviewHistory: [],
    createdAt: now,
  }
}

/**
 * Initialize flashcard for vocabulary item if it doesn't exist
 */
export function getOrCreateFlashcard(
  vocabularyId: string,
  lessonId: string,
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
): FlashcardData {
  const existing = loadFlashcards()
  const found = existing.find(
    (card) => card.vocabularyId === vocabularyId && card.lessonId === lessonId
  )

  if (found) {
    return found
  }

  const newCard = createFlashcard(vocabularyId, lessonId, level)
  existing.push(newCard)
  saveFlashcards(existing)
  return newCard
}

/**
 * Get statistics about flashcard collection
 */
export function getFlashcardStats(
  flashcards: FlashcardData[]
): {
  total: number
  new: number
  learning: number
  reviewing: number
  mastered: number
  dueNow: number
  averageEF: number
  totalReviews: number
} {
  const stats = {
    total: flashcards.length,
    new: 0,
    learning: 0,
    reviewing: 0,
    mastered: 0,
    dueNow: 0,
    averageEF: 0,
    totalReviews: 0,
  }

  if (flashcards.length === 0) return stats

  let totalEF = 0
  const now = Date.now()

  flashcards.forEach((card) => {
    switch (card.masteryStatus) {
      case 'new':
        stats.new++
        break
      case 'learning':
        stats.learning++
        break
      case 'reviewing':
        stats.reviewing++
        break
      case 'mastered':
        stats.mastered++
        break
    }

    if (card.nextReviewDate <= now) {
      stats.dueNow++
    }

    totalEF += card.easinessFactor
    stats.totalReviews += card.reviewHistory.length
  })

  stats.averageEF = totalEF / flashcards.length

  return stats
}

