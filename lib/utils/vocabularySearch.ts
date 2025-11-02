/**
 * Vocabulary search utilities
 */

import type { VocabularyItem } from '@/lib/content/types'
import type { FlashcardData } from './spacedRepetition'

export interface VocabularySearchResult extends VocabularyItem {
  lessonId?: string
  level?: string
  masteryStatus?: FlashcardData['masteryStatus']
  matchScore?: number
}

export interface VocabularySearchFilters {
  query?: string
  lessonId?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  partOfSpeech?: string
  masteryStatus?: FlashcardData['masteryStatus']
}

/**
 * Search vocabulary items
 */
export function searchVocabulary(
  vocabulary: VocabularySearchResult[],
  filters: VocabularySearchFilters,
  flashcards?: FlashcardData[]
): VocabularySearchResult[] {
  let results = [...vocabulary]

  // Apply query search
  if (filters.query) {
    const query = filters.query.toLowerCase().trim()
    results = results
      .map((vocab) => {
        let matchScore = 0
        const searchFields = [
          vocab.georgian.toLowerCase(),
          vocab.transliteration.toLowerCase(),
          vocab.translation.toLowerCase(),
          vocab.ipa?.toLowerCase() || '',
          vocab.partOfSpeech?.toLowerCase() || '',
          vocab.notes?.toLowerCase() || '',
          vocab.exampleSentence?.georgian.toLowerCase() || '',
          vocab.exampleSentence?.translation.toLowerCase() || '',
        ]

        // Exact matches get highest score
        if (vocab.georgian.toLowerCase() === query) matchScore += 100
        if (vocab.transliteration.toLowerCase() === query) matchScore += 90
        if (vocab.translation.toLowerCase() === query) matchScore += 80

        // Starts with matches
        if (vocab.georgian.toLowerCase().startsWith(query)) matchScore += 70
        if (vocab.transliteration.toLowerCase().startsWith(query))
          matchScore += 60
        if (vocab.translation.toLowerCase().startsWith(query)) matchScore += 50

        // Contains matches
        searchFields.forEach((field) => {
          if (field.includes(query)) {
            matchScore += 10
          }
        })

        return {
          ...vocab,
          matchScore: matchScore > 0 ? matchScore : undefined,
        }
      })
      .filter((vocab) => vocab.matchScore !== undefined)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }

  // Filter by lesson
  if (filters.lessonId) {
    results = results.filter((vocab) => vocab.lessonId === filters.lessonId)
  }

  // Filter by level
  if (filters.level) {
    results = results.filter((vocab) => vocab.level === filters.level)
  }

  // Filter by part of speech
  if (filters.partOfSpeech) {
    results = results.filter(
      (vocab) =>
        vocab.partOfSpeech?.toLowerCase() ===
        filters.partOfSpeech?.toLowerCase()
    )
  }

  // Filter by mastery status (requires flashcards)
  if (filters.masteryStatus && flashcards) {
    const vocabIds = new Set(
      flashcards
        .filter((card) => card.masteryStatus === filters.masteryStatus)
        .map((card) => `${card.vocabularyId}-${card.lessonId}`)
    )
    results = results.filter((vocab) =>
      vocabIds.has(`${vocab.id}-${vocab.lessonId}`)
    )
  }

  return results
}

/**
 * Get unique parts of speech from vocabulary
 */
export function getPartsOfSpeech(
  vocabulary: VocabularySearchResult[]
): string[] {
  const partsOfSpeech = new Set<string>()
  vocabulary.forEach((vocab) => {
    if (vocab.partOfSpeech) {
      partsOfSpeech.add(vocab.partOfSpeech)
    }
  })
  return Array.from(partsOfSpeech).sort()
}

/**
 * Get autocomplete suggestions
 */
export function getAutocompleteSuggestions(
  vocabulary: VocabularySearchResult[],
  query: string,
  limit: number = 5
): string[] {
  if (!query || query.length < 2) return []

  const queryLower = query.toLowerCase()
  const suggestions = new Set<string>()

  vocabulary.forEach((vocab) => {
    if (
      vocab.georgian.toLowerCase().startsWith(queryLower) &&
      suggestions.size < limit
    ) {
      suggestions.add(vocab.georgian)
    }
    if (
      vocab.transliteration.toLowerCase().startsWith(queryLower) &&
      suggestions.size < limit
    ) {
      suggestions.add(vocab.transliteration)
    }
    if (
      vocab.translation.toLowerCase().startsWith(queryLower) &&
      suggestions.size < limit
    ) {
      suggestions.add(vocab.translation)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}



