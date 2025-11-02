/**
 * Spaced Repetition System (SRS) for Phonology
 * 
 * Applies spaced repetition algorithms to help learners master
 * Georgian letters, sounds, and phonological distinctions.
 */

export interface PhonologyCard {
  id: string
  georgian: string
  ipa: string
  type: 'letter' | 'minimal-pair' | 'phonological-rule'
  nextReview: number // timestamp
  easeFactor: number // 2.5 default, adjusts based on performance
  interval: number // days until next review
  repetitions: number // number of successful reviews
}

export interface ReviewResult {
  cardId: string
  grade: 0 | 1 | 2 | 3 | 4 | 5 // 0 = incorrect, 5 = perfect
  timestamp: number
}

/**
 * Calculate next review interval using modified SM-2 algorithm
 */
export function calculateNextInterval(
  currentInterval: number,
  easeFactor: number,
  grade: number,
  repetitions: number
): { interval: number; easeFactor: number; repetitions: number } {
  // SM-2 algorithm adapted for phonology practice
  
  if (grade < 3) {
    // Incorrect or barely remembered - reset
    return {
      interval: 0,
      easeFactor: Math.max(1.3, easeFactor - 0.15),
      repetitions: 0,
    }
  }

  // Successful recall
  if (repetitions === 0) {
    return {
      interval: 1, // 1 day
      easeFactor: easeFactor,
      repetitions: 1,
    }
  }

  if (repetitions === 1) {
    return {
      interval: 6, // 6 days
      easeFactor: easeFactor,
      repetitions: 2,
    }
  }

  // Update ease factor based on performance
  let newEaseFactor = easeFactor
  if (grade === 5) {
    newEaseFactor = Math.min(2.5, easeFactor + 0.1)
  } else if (grade === 4) {
    newEaseFactor = easeFactor
  } else if (grade === 3) {
    newEaseFactor = Math.max(1.3, easeFactor - 0.15)
  }

  const newInterval = Math.round(currentInterval * newEaseFactor)
  const newRepetitions = repetitions + 1

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
  }
}

/**
 * Get cards due for review
 */
export function getCardsDueForReview(cards: PhonologyCard[]): PhonologyCard[] {
  const now = Date.now()
  const oneDayInMs = 24 * 60 * 60 * 1000

  return cards.filter((card) => {
    const daysSinceReview = (now - card.nextReview) / oneDayInMs
    return daysSinceReview >= card.interval
  })
}

/**
 * Update card after review
 */
export function updateCardAfterReview(
  card: PhonologyCard,
  grade: number
): PhonologyCard {
  const updates = calculateNextInterval(
    card.interval,
    card.easeFactor,
    grade,
    card.repetitions
  )

  const now = Date.now()
  const oneDayInMs = 24 * 60 * 60 * 1000
  const nextReview = now + updates.interval * oneDayInMs

  return {
    ...card,
    interval: updates.interval,
    easeFactor: updates.easeFactor,
    repetitions: updates.repetitions,
    nextReview: nextReview,
  }
}

/**
 * Initialize phonology cards for all Georgian letters
 */
export function initializeLetterCards(): PhonologyCard[] {
  const letters = [
    // Vowels
    { georgian: 'ა', ipa: '/ɑ/' },
    { georgian: 'ე', ipa: '/ɛ/' },
    { georgian: 'ი', ipa: '/i/' },
    { georgian: 'ო', ipa: '/ɔ/' },
    { georgian: 'უ', ipa: '/u/' },
    
    // Familiar consonants
    { georgian: 'ბ', ipa: '/b/' },
    { georgian: 'გ', ipa: '/ɡ/' },
    { georgian: 'დ', ipa: '/d/' },
    { georgian: 'ვ', ipa: '/v/' },
    { georgian: 'ზ', ipa: '/z/' },
    { georgian: 'ლ', ipa: '/l/' },
    { georgian: 'მ', ipa: '/m/' },
    { georgian: 'ნ', ipa: '/n/' },
    { georgian: 'რ', ipa: '/r/' },
    { georgian: 'ს', ipa: '/s/' },
    { georgian: 'ფ', ipa: '/pʰ/' },
    { georgian: 'ქ', ipa: '/kʰ/' },
    { georgian: 'ჰ', ipa: '/h/' },
    
    // Aspirated
    { georgian: 'თ', ipa: '/tʰ/' },
    { georgian: 'ჩ', ipa: '/tʃʰ/' },
    
    // Ejectives
    { georgian: 'კ', ipa: '/kʼ/' },
    { georgian: 'პ', ipa: '/pʼ/' },
    { georgian: 'ტ', ipa: '/tʼ/' },
    { georgian: 'წ', ipa: '/tsʼ/' },
    { georgian: 'ჭ', ipa: '/tʃʼ/' },
    { georgian: 'ყ', ipa: '/qʼ/' },
    
    // Other
    { georgian: 'ჟ', ipa: '/ʒ/' },
    { georgian: 'რ', ipa: '/r/' },
    { georgian: 'შ', ipa: '/ʃ/' },
    { georgian: 'ც', ipa: '/ts/' },
    { georgian: 'ძ', ipa: '/dz/' },
    { georgian: 'ღ', ipa: '/ɣ/' },
    { georgian: 'ხ', ipa: '/x/' },
    { georgian: 'ჯ', ipa: '/dʒ/' },
  ]

  const now = Date.now()

  return letters.map((letter, index) => ({
    id: `letter-${index}`,
    georgian: letter.georgian,
    ipa: letter.ipa,
    type: 'letter' as const,
    nextReview: now,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  }))
}

/**
 * Calculate mastery statistics
 */
export function calculateMasteryStats(cards: PhonologyCard[]): {
  total: number
  mastered: number
  learning: number
  new: number
  averageEaseFactor: number
} {
  const mastered = cards.filter((card) => card.repetitions >= 5 && card.easeFactor >= 2.0)
  const learning = cards.filter((card) => card.repetitions > 0 && card.repetitions < 5)
  const new = cards.filter((card) => card.repetitions === 0)
  const averageEaseFactor = cards.reduce((sum, card) => sum + card.easeFactor, 0) / cards.length

  return {
    total: cards.length,
    mastered: mastered.length,
    learning: learning.length,
    new: new.length,
    averageEaseFactor,
  }
}

/**
 * Generate review session
 */
export function generateReviewSession(
  cards: PhonologyCard[],
  maxCards: number = 20
): PhonologyCard[] {
  const dueCards = getCardsDueForReview(cards)
  
  // Sort by priority (overdue first, then by ease factor)
  const sorted = dueCards.sort((a, b) => {
    const aOverdue = Math.max(0, Date.now() - a.nextReview)
    const bOverdue = Math.max(0, Date.now() - b.nextReview)
    
    if (aOverdue !== bOverdue) {
      return bOverdue - aOverdue
    }
    
    // Lower ease factor = needs more practice
    return a.easeFactor - b.easeFactor
  })

  return sorted.slice(0, maxCards)
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(cards: PhonologyCard[]): number {
  const stats = calculateMasteryStats(cards)
  const mastered = stats.mastered
  const total = stats.total

  if (total === 0) return 0

  // Consider a card "mastered" at 5+ repetitions
  return Math.round((mastered / total) * 100)
}

/**
 * Save cards to localStorage
 */
export function savePhonologyCards(cards: PhonologyCard[]): void {
  try {
    localStorage.setItem('phonology_srs_cards', JSON.stringify(cards))
  } catch (error) {
    console.error('Failed to save phonology cards:', error)
  }
}

/**
 * Load cards from localStorage
 */
export function loadPhonologyCards(): PhonologyCard[] | null {
  try {
    const stored = localStorage.getItem('phonology_srs_cards')
    if (!stored) return null
    
    return JSON.parse(stored) as PhonologyCard[]
  } catch (error) {
    console.error('Failed to load phonology cards:', error)
    return null
  }
}

