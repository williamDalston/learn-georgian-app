'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/shared/GlassCard'
import { useFlashcards } from '@/lib/hooks/useFlashcards'
import {
  searchVocabulary,
  getPartsOfSpeech,
  getAutocompleteSuggestions,
  type VocabularySearchFilters,
  type VocabularySearchResult,
} from '@/lib/utils/vocabularySearch'
import { loadLessonContent } from '@/lib/content/loader'
import { courseStructure } from '@/lib/data/courseStructure'
import logger from '@/lib/utils/logger'
import type { VocabularyItem } from '@/lib/content/types'

export default function VocabularySearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<VocabularySearchFilters>({})
  const [allVocabulary, setAllVocabulary] = useState<VocabularySearchResult[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVocab, setSelectedVocab] =
    useState<VocabularySearchResult | null>(null)
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const { allFlashcards } = useFlashcards()

  // Load all vocabulary
  useEffect(() => {
    async function loadAllVocab() {
      setIsLoading(true)
      try {
        const vocab: VocabularySearchResult[] = []

        for (const levelData of courseStructure) {
          for (const lesson of levelData.lessons) {
            try {
              const content = await loadLessonContent(lesson.id)
              if (content?.vocabulary) {
                content.vocabulary.forEach((item) => {
                  const flashcard = allFlashcards.find(
                    (card) =>
                      card.vocabularyId === item.id &&
                      card.lessonId === lesson.id
                  )

                  vocab.push({
                    ...item,
                    lessonId: lesson.id,
                    level: lesson.level,
                    masteryStatus: flashcard?.masteryStatus,
                  })
                })
              }
            } catch (err) {
              // Continue if lesson not found
            }
          }
        }

        setAllVocabulary(vocab)
      } catch (err) {
        logger.error('Failed to load vocabulary', {
          context: 'VocabularySearch',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadAllVocab()
  }, [allFlashcards])

  // Update autocomplete suggestions
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const suggestions = getAutocompleteSuggestions(allVocabulary, searchQuery)
      setAutocompleteSuggestions(suggestions)
      setShowAutocomplete(suggestions.length > 0)
    } else {
      setAutocompleteSuggestions([])
      setShowAutocomplete(false)
    }
  }, [searchQuery, allVocabulary])

  // Search results
  const searchResults = useMemo(() => {
    if (isLoading) return []

    const results = searchVocabulary(allVocabulary, filters, allFlashcards)
    return results
  }, [allVocabulary, filters, allFlashcards, isLoading])

  const partsOfSpeech = useMemo(
    () => getPartsOfSpeech(allVocabulary),
    [allVocabulary]
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setFilters((prev) => ({ ...prev, query: value || undefined }))
  }

  const handleAutocompleteSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setFilters((prev) => ({ ...prev, query: suggestion }))
    setShowAutocomplete(false)
  }

  const handleFilterChange = (
    key: keyof VocabularySearchFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({})
  }

  const handleVocabClick = (vocab: VocabularySearchResult) => {
    setSelectedVocab(vocab)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <GlassCard className="p-6">
        <div className="relative">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowAutocomplete(searchQuery.length >= 2)}
                placeholder="Search by Georgian word, transliteration, or translation..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
              {/* Autocomplete Dropdown */}
              {showAutocomplete && autocompleteSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {autocompleteSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAutocompleteSelect(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={filters.level || ''}
              onChange={(e) =>
                handleFilterChange(
                  'level',
                  e.target.value || undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Levels</option>
              {courseStructure.map((lvl) => (
                <option key={lvl.code} value={lvl.code}>
                  {lvl.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Part of Speech
            </label>
            <select
              value={filters.partOfSpeech || ''}
              onChange={(e) =>
                handleFilterChange('partOfSpeech', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              {partsOfSpeech.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mastery Status
            </label>
            <select
              value={filters.masteryStatus || ''}
              onChange={(e) =>
                handleFilterChange(
                  'masteryStatus',
                  e.target.value || undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="learning">Learning</option>
              <option value="reviewing">Reviewing</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quick Actions
            </label>
            <button
              onClick={() => router.push('/dashboard/flashcards')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Practice Flashcards
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Found {searchResults.length} vocabulary {searchResults.length === 1 ? 'item' : 'items'}
        </div>
      </GlassCard>

      {/* Search Results */}
      {selectedVocab ? (
        // Vocabulary Detail View
        <GlassCard className="p-6">
          <button
            onClick={() => setSelectedVocab(null)}
            className="mb-4 text-primary-600 hover:text-primary-700 flex items-center gap-2"
          >
            ← Back to results
          </button>
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-serif text-primary-900 mb-2">
                {selectedVocab.georgian}
              </h2>
              <p className="text-xl text-gray-600 italic">
                {selectedVocab.transliteration}
              </p>
              {selectedVocab.ipa && (
                <p className="text-sm text-gray-500 font-mono mt-1">
                  /{selectedVocab.ipa}/
                </p>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedVocab.translation}
              </h3>
              {selectedVocab.partOfSpeech && (
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  {selectedVocab.partOfSpeech}
                </span>
              )}
              {selectedVocab.masteryStatus && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ml-2 ${
                    selectedVocab.masteryStatus === 'mastered'
                      ? 'bg-green-100 text-green-800'
                      : selectedVocab.masteryStatus === 'reviewing'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedVocab.masteryStatus === 'learning'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedVocab.masteryStatus}
                </span>
              )}
            </div>
            {selectedVocab.exampleSentence && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-serif text-primary-900 mb-2">
                  {selectedVocab.exampleSentence.georgian}
                </p>
                <p className="text-sm text-gray-600 italic mb-1">
                  {selectedVocab.exampleSentence.transliteration}
                </p>
                <p className="text-sm text-gray-700">
                  {selectedVocab.exampleSentence.translation}
                </p>
              </div>
            )}
            {selectedVocab.notes && (
              <p className="text-sm text-gray-600 italic">{selectedVocab.notes}</p>
            )}
            {selectedVocab.lessonId && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Lesson: {selectedVocab.lessonId.toUpperCase()}
                  {selectedVocab.level && ` • Level: ${selectedVocab.level}`}
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        // Results List
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((vocab) => (
              <GlassCard
                key={`${vocab.id}-${vocab.lessonId}`}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleVocabClick(vocab)}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-primary-900">
                    {vocab.georgian}
                  </h3>
                  <p className="text-gray-600 italic">{vocab.transliteration}</p>
                  <p className="font-bold text-gray-900">{vocab.translation}</p>
                  {vocab.partOfSpeech && (
                    <p className="text-xs text-gray-500">{vocab.partOfSpeech}</p>
                  )}
                  {vocab.masteryStatus && (
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        vocab.masteryStatus === 'mastered'
                          ? 'bg-green-100 text-green-800'
                          : vocab.masteryStatus === 'reviewing'
                          ? 'bg-blue-100 text-blue-800'
                          : vocab.masteryStatus === 'learning'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {vocab.masteryStatus}
                    </span>
                  )}
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No vocabulary found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


