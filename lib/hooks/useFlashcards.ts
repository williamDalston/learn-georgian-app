/**
 * React hook for managing vocabulary flashcards
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { VocabularyItem } from '@/lib/content/types'
import {
  type FlashcardData,
  loadFlashcards,
  saveFlashcards,
  reviewFlashcard,
  getDueFlashcards,
  getOrCreateFlashcard,
  createFlashcard,
  getFlashcardStats,
  type ReviewRecord,
} from '@/lib/utils/spacedRepetition'
import logger from '@/lib/utils/logger'

export interface UseFlashcardsOptions {
  lessonId?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  filterByDue?: boolean
  filterByMastery?: FlashcardData['masteryStatus']
}

export function useFlashcards(options: UseFlashcardsOptions = {}) {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load flashcards on mount
  useEffect(() => {
    try {
      const loaded = loadFlashcards()
      setFlashcards(loaded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flashcards')
      logger.error('Failed to load flashcards', {
        context: 'useFlashcards',
        error: err instanceof Error ? err : new Error(String(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save flashcards whenever they change
  useEffect(() => {
    if (!isLoading && flashcards.length > 0) {
      try {
        saveFlashcards(flashcards)
      } catch (err) {
        logger.error('Failed to save flashcards', {
          context: 'useFlashcards',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
  }, [flashcards, isLoading])

  // Filter flashcards based on options
  const filteredFlashcards = flashcards.filter((card) => {
    if (options.lessonId && card.lessonId !== options.lessonId) return false
    if (options.level && card.level !== options.level) return false
    if (options.filterByMastery && card.masteryStatus !== options.filterByMastery)
      return false
    return true
  })

  // Get due flashcards if filterByDue is true
  const displayCards = options.filterByDue
    ? getDueFlashcards(filteredFlashcards)
    : filteredFlashcards

  /**
   * Add vocabulary items as flashcards
   */
  const addVocabulary = useCallback(
    (
      vocabulary: VocabularyItem[],
      lessonId: string,
      level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
    ) => {
      setFlashcards((prev) => {
        const existingIds = new Set(
          prev.map((card) => `${card.vocabularyId}-${card.lessonId}`)
        )
        const newCards: FlashcardData[] = []

        vocabulary.forEach((vocab) => {
          const key = `${vocab.id}-${lessonId}`
          if (!existingIds.has(key)) {
            const card = createFlashcard(vocab.id, lessonId, level)
            newCards.push(card)
            existingIds.add(key)
          }
        })

        return [...prev, ...newCards]
      })
    },
    []
  )

  /**
   * Review a flashcard with quality rating (0-5)
   */
  const reviewCard = useCallback((cardId: string, quality: number) => {
    if (quality < 0 || quality > 5) {
      setError('Quality rating must be between 0 and 5')
      return
    }

    setFlashcards((prev) => {
      const index = prev.findIndex((card) => card.id === cardId)
      if (index === -1) {
        setError('Flashcard not found')
        return prev
      }

      const updated = [...prev]
      updated[index] = reviewFlashcard(prev[index], quality)
      return updated
    })
  }, [])

  /**
   * Get or create flashcard for vocabulary item
   */
  const getFlashcard = useCallback(
    (
      vocabularyId: string,
      lessonId: string,
      level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
    ) => {
      return getOrCreateFlashcard(vocabularyId, lessonId, level)
    },
    []
  )

  /**
   * Remove a flashcard
   */
  const removeFlashcard = useCallback((cardId: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== cardId))
  }, [])

  /**
   * Get statistics
   */
  const stats = getFlashcardStats(flashcards)

  /**
   * Reset flashcard (start over)
   */
  const resetFlashcard = useCallback((cardId: string) => {
    setFlashcards((prev) => {
      const index = prev.findIndex((card) => card.id === cardId)
      if (index === -1) return prev

      const card = prev[index]
      const resetCard = createFlashcard(
        card.vocabularyId,
        card.lessonId,
        card.level
      )
      resetCard.id = card.id // Keep same ID

      const updated = [...prev]
      updated[index] = resetCard
      return updated
    })
  }, [])

  return {
    flashcards: displayCards,
    allFlashcards: flashcards,
    isLoading,
    error,
    addVocabulary,
    reviewCard,
    getFlashcard,
    removeFlashcard,
    resetFlashcard,
    stats,
  }
}


