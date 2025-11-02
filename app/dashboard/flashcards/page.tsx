'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import VocabularyFlashcards from '@/components/learning/VocabularyFlashcards'
import GlassCard from '@/components/shared/GlassCard'
import { useFlashcards } from '@/lib/hooks/useFlashcards'
import { courseStructure } from '@/lib/data/courseStructure'

function FlashcardsContent() {
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson') || undefined
  const levelParam = searchParams.get('level') as
    | 'A1'
    | 'A2'
    | 'B1'
    | 'B2'
    | 'C1'
    | null
  const level = levelParam || undefined

  const [selectedLesson, setSelectedLesson] = useState<string | undefined>(
    lessonId
  )
  const [selectedLevel, setSelectedLevel] = useState<
    'A1' | 'A2' | 'B1' | 'B2' | 'C1' | undefined
  >(level)

  const { stats } = useFlashcards()

  const allLessons = courseStructure.flatMap((level) =>
    level.lessons.map((lesson) => ({ ...lesson, levelCode: level.code }))
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-primary-900 mb-2">
          Vocabulary Flashcards
        </h1>
        <p className="text-gray-600">
          Practice vocabulary with spaced repetition
        </p>
      </div>

      {/* Filters */}
      <GlassCard className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Level
            </label>
            <select
              value={selectedLevel || ''}
              onChange={(e) => {
                const value = e.target.value as
                  | 'A1'
                  | 'A2'
                  | 'B1'
                  | 'B2'
                  | 'C1'
                  | ''
                setSelectedLevel(value || undefined)
                setSelectedLesson(undefined) // Clear lesson when changing level
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Levels</option>
              {courseStructure.map((lvl) => (
                <option key={lvl.code} value={lvl.code}>
                  {lvl.code}: {lvl.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Lesson
            </label>
            <select
              value={selectedLesson || ''}
              onChange={(e) => {
                setSelectedLesson(e.target.value || undefined)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!selectedLevel}
            >
              <option value="">
                {selectedLevel ? 'All Lessons' : 'Select a level first'}
              </option>
              {selectedLevel &&
                allLessons
                  .filter((lesson) => lesson.levelCode === selectedLevel)
                  .map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.mastered}
            </div>
            <div className="text-sm text-gray-600">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.learning}
            </div>
            <div className="text-sm text-gray-600">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.dueNow}
            </div>
            <div className="text-sm text-gray-600">Due Now</div>
          </div>
        </div>
      </GlassCard>

      {/* Flashcards Component */}
      <VocabularyFlashcards
        lessonId={selectedLesson}
        level={selectedLevel}
      />
    </div>
  )
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-primary-900 mb-2">
            Vocabulary Flashcards
          </h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FlashcardsContent />
    </Suspense>
  )
}

// Mark page as dynamic to avoid static generation
export const dynamic = 'force-dynamic'
