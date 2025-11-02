/**
 * Audio Manifest System
 * Centralized registry for all audio files in the application
 * 
 * This manifest maps content IDs to audio file paths, allowing easy
 * loading and fallback handling for audio assets.
 */

export interface AudioManifestEntry {
  id: string
  path: string
  type: 'letter' | 'word' | 'phrase' | 'min-pair' | 'ejective-practice'
  lessonId?: string
  vocabularyId?: string
  description?: string
  duration?: number // in seconds
}

export interface AudioManifest {
  letters: Record<string, AudioManifestEntry>
  words: Record<string, AudioManifestEntry>
  phrases: Record<string, AudioManifestEntry>
  minPairs: Record<string, AudioManifestEntry>
  ejectivePractice: AudioManifestEntry[]
}

/**
 * Generate audio file path from content identifiers
 */
export function getAudioPath(
  type: 'letter' | 'word' | 'phrase',
  identifier: string,
  lessonId?: string
): string {
  const basePath = '/audio'
  
  switch (type) {
    case 'letter':
      return `${basePath}/letters/${identifier}.mp3`
    case 'word':
      if (lessonId) {
        return `${basePath}/words/${lessonId}/${identifier}.mp3`
      }
      return `${basePath}/words/${identifier}.mp3`
    case 'phrase':
      if (lessonId) {
        return `${basePath}/phrases/${lessonId}/${identifier}.mp3`
      }
      return `${basePath}/phrases/${identifier}.mp3`
    default:
      return ''
  }
}

/**
 * Generate minimal pair audio path
 */
export function getMinPairPath(pairId: string): string {
  return `/audio/min-pairs/${pairId}.mp3`
}

/**
 * Generate ejective practice audio path
 */
export function getEjectivePracticePath(exerciseId: string): string {
  return `/audio/ejective-practice/${exerciseId}.mp3`
}

/**
 * Get audio URL for a Georgian letter
 */
export function getLetterAudioUrl(letter: string): string {
  return getAudioPath('letter', letter)
}

/**
 * Get audio URL for vocabulary word
 */
export function getVocabularyAudioUrl(
  word: string,
  lessonId?: string
): string {
  // Normalize word (lowercase, remove spaces)
  const normalized = word.toLowerCase().replace(/\s+/g, '-')
  return getAudioPath('word', normalized, lessonId)
}

/**
 * Get audio URL for example sentence/phrase
 */
export function getPhraseAudioUrl(
  phrase: string,
  lessonId?: string
): string {
  const normalized = phrase.toLowerCase().replace(/\s+/g, '-')
  return getAudioPath('phrase', normalized, lessonId)
}

/**
 * Check if audio file exists (client-side check)
 * Note: This is a best-effort check. Actual 404 handling
 * should be done in the audio player component.
 */
export async function audioFileExists(url: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get all Georgian letters that should have audio files
 */
export const GEORGIAN_LETTERS = [
  'ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', 'ლ', 'მ', 'ნ', 'ო',
  'პ', 'ჟ', 'რ', 'ს', 'ტ', 'უ', 'ფ', 'ქ', 'ღ', 'ყ', 'შ', 'ჩ', 'ც', 'ძ',
  'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ'
]

/**
 * Common minimal pairs for Georgian pronunciation practice
 */
export const MINIMAL_PAIRS = [
  { id: 'b-p-p', letters: ['ბ', 'პ', 'პ'], description: 'Voiced vs Aspirated vs Ejective' },
  { id: 't-t-t', letters: ['თ', 'ტ', 'ტ'], description: 'Aspirated vs Voiced vs Ejective' },
  { id: 'k-k-k', letters: ['კ', 'ქ', 'კ'], description: 'Ejective vs Aspirated vs Ejective' },
  { id: 'p-p-p', letters: ['პ', 'ფ', 'პ'], description: 'Voiced vs Aspirated vs Ejective' },
  { id: 'g-k-k', letters: ['გ', 'კ', 'კ'], description: 'Voiced vs Ejective variants' },
]

/**
 * Audio manifest data structure
 * This will be populated as audio files are added
 */
export const audioManifest: AudioManifest = {
  letters: {},
  words: {},
  phrases: {},
  minPairs: {},
  ejectivePractice: [],
}

/**
 * Initialize letter entries in manifest
 */
export function initializeLetterManifest(): void {
  GEORGIAN_LETTERS.forEach((letter) => {
    audioManifest.letters[letter] = {
      id: letter,
      path: getLetterAudioUrl(letter),
      type: 'letter',
      description: `Pronunciation of the letter ${letter}`,
    }
  })
}

/**
 * Register a word audio file in the manifest
 */
export function registerWordAudio(
  word: string,
  lessonId: string,
  vocabularyId?: string
): void {
  const normalized = word.toLowerCase().replace(/\s+/g, '-')
  const entry: AudioManifestEntry = {
    id: normalized,
    path: getVocabularyAudioUrl(word, lessonId),
    type: 'word',
    lessonId,
    vocabularyId,
    description: `Pronunciation of ${word}`,
  }
  audioManifest.words[normalized] = entry
}

/**
 * Register a phrase audio file in the manifest
 */
export function registerPhraseAudio(
  phrase: string,
  lessonId: string
): void {
  const normalized = phrase.toLowerCase().replace(/\s+/g, '-')
  const entry: AudioManifestEntry = {
    id: normalized,
    path: getPhraseAudioUrl(phrase, lessonId),
    type: 'phrase',
    lessonId,
    description: `Pronunciation of phrase: ${phrase}`,
  }
  audioManifest.phrases[normalized] = entry
}

// Initialize manifest with letters
if (typeof window !== 'undefined') {
  initializeLetterManifest()
}

