'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/shared/GlassCard'
import Flashcard from './Flashcard'
import { useFlashcards } from '@/lib/hooks/useFlashcards'
import type { VocabularyItem } from '@/lib/content/types'
import { loadLessonContent } from '@/lib/content/loader'
import logger from '@/lib/utils/logger'
import { courseStructure } from '@/lib/data/courseStructure'
import { staggerContainer, staggerItem } from '@/lib/utils/animations'

interface VocabularyFlashcardsProps {
  lessonId?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  vocabularyIds?: string[]
}

export default function VocabularyFlashcards({
  lessonId,
  level,
  vocabularyIds,
}: VocabularyFlashcardsProps) {
  const router = useRouter()
  const [vocabulary, setVocabulary] = useState<
    (VocabularyItem & { lessonId?: string; level?: string })[]
  >([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    known: 0,
    studyMore: 0,
  })

  const {
    flashcards,
    allFlashcards,
    addVocabulary: addVocabToFlashcards,
    reviewCard,
    stats,
  } = useFlashcards({
    lessonId,
    level,
    filterByDue: false, // Show all cards for now
  })

  // Load vocabulary
  useEffect(() => {
    async function loadVocab() {
      setIsLoading(true)
      try {
        const allVocab: (VocabularyItem & {
          lessonId?: string
          level?: string
        })[] = []

        if (lessonId) {
          // Load from specific lesson
          const content = await loadLessonContent(lessonId)
          if (content?.vocabulary) {
            const lesson = courseStructure
              .flatMap((l) => l.lessons)
              .find((l) => l.id === lessonId)
            content.vocabulary.forEach((vocab) => {
              allVocab.push({
                ...vocab,
                lessonId,
                level: lesson?.level,
              })
            })
          }
        } else if (level) {
          // Load from all lessons in level
          const levelData = courseStructure.find((l) => l.code === level)
          if (levelData) {
            for (const lesson of levelData.lessons) {
              try {
                const content = await loadLessonContent(lesson.id)
                if (content?.vocabulary) {
                  content.vocabulary.forEach((vocab) => {
                    allVocab.push({
                      ...vocab,
                      lessonId: lesson.id,
                      level: lesson.level,
                    })
                  })
                }
              } catch (err) {
                logger.debug(`Failed to load vocabulary for ${lesson.id}`, {
                  context: 'VocabularyFlashcards',
                })
              }
            }
          }
        } else {
          // Load all vocabulary
          for (const levelData of courseStructure) {
            for (const lesson of levelData.lessons) {
              try {
                const content = await loadLessonContent(lesson.id)
                if (content?.vocabulary) {
                  content.vocabulary.forEach((vocab) => {
                    allVocab.push({
                      ...vocab,
                      lessonId: lesson.id,
                      level: lesson.level,
                    })
                  })
                }
              } catch (err) {
                // Continue if lesson content not found
              }
            }
          }
        }

        // Filter by vocabularyIds if provided
        const filtered = vocabularyIds
          ? allVocab.filter((v) => vocabularyIds.includes(v.id))
          : allVocab

        setVocabulary(filtered)

        // Add to flashcards if not already there
        if (filtered.length > 0 && lessonId) {
          const lesson = courseStructure
            .flatMap((l) => l.lessons)
            .find((l) => l.id === lessonId)
          if (lesson) {
            addVocabToFlashcards(filtered, lessonId, lesson.level)
          }
        }
      } catch (err) {
        logger.error('Failed to load vocabulary', {
          context: 'VocabularyFlashcards',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVocab()
  }, [lessonId, level, vocabularyIds, addVocabToFlashcards])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionComplete || isLoading) return

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          if (!isFlipped) {
            setIsFlipped(true)
          }
          break
        case 'ArrowRight':
          if (isFlipped) {
            e.preventDefault()
            handleKnow()
          }
          break
        case 'ArrowLeft':
          if (isFlipped) {
            e.preventDefault()
            handleStudyMore()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, sessionComplete, isLoading])

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped)
  }, [isFlipped])

  const handleKnow = useCallback(() => {
    if (vocabulary.length === 0 || currentIndex >= vocabulary.length) return

    const currentVocab = vocabulary[currentIndex]
    const flashcard = allFlashcards.find(
      (card) =>
        card.vocabularyId === currentVocab.id &&
        card.lessonId === currentVocab.lessonId
    )

    if (flashcard) {
      // Quality 4 = good (know it)
      reviewCard(flashcard.id, 4)
    }

    setSessionStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      known: prev.known + 1,
    }))

    moveToNext()
  }, [vocabulary, currentIndex, allFlashcards, reviewCard])

  const handleStudyMore = useCallback(() => {
    if (vocabulary.length === 0 || currentIndex >= vocabulary.length) return

    const currentVocab = vocabulary[currentIndex]
    const flashcard = allFlashcards.find(
      (card) =>
        card.vocabularyId === currentVocab.id &&
        card.lessonId === currentVocab.lessonId
    )

    if (flashcard) {
      // Quality 2 = hard (study more)
      reviewCard(flashcard.id, 2)
    }

    setSessionStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      studyMore: prev.studyMore + 1,
    }))

    moveToNext()
  }, [vocabulary, currentIndex, allFlashcards, reviewCard])

  const moveToNext = useCallback(() => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setSessionComplete(true)
    }
  }, [currentIndex, vocabulary.length])

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
    setSessionStats({ reviewed: 0, known: 0, studyMore: 0 })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    )
  }

  if (vocabulary.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Vocabulary Found</h3>
        <p className="text-gray-600 mb-4">
          There's no vocabulary available for the selected filters.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Dashboard
        </button>
      </GlassCard>
    )
  }

  if (sessionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <GlassCard className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Session Complete! 🎉</h2>
          <div className="space-y-4 mb-6">
            <div className="text-5xl font-bold text-primary-600">
              {sessionStats.reviewed}
            </div>
            <p className="text-gray-600">Cards Reviewed</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {sessionStats.known}
                </div>
                <p className="text-sm text-gray-600">Known</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">
                  {sessionStats.studyMore}
                </div>
                <p className="text-sm text-gray-600">Need Review</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Review Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  const currentVocab = vocabulary[currentIndex]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-primary-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / vocabulary.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {currentIndex + 1} / {vocabulary.length}
        </span>
        <div className="flex gap-4">
          <span>📚 Total: {stats.total}</span>
          <span>✅ Mastered: {stats.mastered}</span>
          <span>🔄 Due: {stats.dueNow}</span>
        </div>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Flashcard
            vocabulary={currentVocab}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onKnow={handleKnow}
            onStudyMore={handleStudyMore}
            cardIndex={currentIndex}
            totalCards={vocabulary.length}
          />
        </motion.div>
      </AnimatePresence>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> or{' '}
          <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to flip
        </p>
        {isFlipped && (
          <p>
            <kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd> Study More •{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> I Know This
          </p>
        )}
      </div>
    </div>
  )
}

