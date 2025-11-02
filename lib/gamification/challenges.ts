// Daily Challenge System
'use client'

export type ChallengeType = 'complete_exercises' | 'practice_time' | 'review_vocabulary'

export interface DailyChallenge {
  id: string
  type: ChallengeType
  title: string
  description: string
  icon: string
  target: number
  current: number
  pointsReward: number
  completed: boolean
  date: string // YYYY-MM-DD
}

const CHALLENGE_STORAGE_KEY = 'dailyChallenges'
const CHALLENGES_DATE_KEY = 'dailyChallengesDate'

// Predefined challenge templates
const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'current' | 'completed' | 'date'>[] = [
  {
    id: 'complete_exercises',
    type: 'complete_exercises',
    title: 'Complete Exercises',
    description: 'Complete 3 exercises today',
    icon: '📝',
    target: 3,
    pointsReward: 50,
  },
  {
    id: 'practice_time',
    type: 'practice_time',
    title: 'Practice Time',
    description: 'Practice for 15 minutes',
    icon: '⏰',
    target: 15,
    pointsReward: 50,
  },
  {
    id: 'review_vocabulary',
    type: 'review_vocabulary',
    title: 'Review Vocabulary',
    description: 'Review 10 vocabulary words',
    icon: '📖',
    target: 10,
    pointsReward: 50,
  },
]

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get or create today's daily challenges
 */
export function getDailyChallenges(): DailyChallenge[] {
  if (typeof window === 'undefined') {
    return createNewChallenges()
  }

  try {
    const storedDate = localStorage.getItem(CHALLENGES_DATE_KEY)
    const today = getTodayDate()

    // If challenges are from a different day, create new ones
    if (storedDate !== today) {
      const newChallenges = createNewChallenges()
      saveDailyChallenges(newChallenges)
      return newChallenges
    }

    // Load existing challenges
    const stored = localStorage.getItem(CHALLENGE_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as DailyChallenge[]
    }

    // Create new challenges if none exist
    const challenges = createNewChallenges()
    saveDailyChallenges(challenges)
    return challenges
  } catch (error) {
    console.error('Failed to get daily challenges', error)
    return createNewChallenges()
  }
}

/**
 * Create new daily challenges
 */
function createNewChallenges(): DailyChallenge[] {
  return CHALLENGE_TEMPLATES.map((template) => ({
    ...template,
    current: 0,
    completed: false,
    date: getTodayDate(),
  }))
}

/**
 * Save daily challenges to localStorage
 */
function saveDailyChallenges(challenges: DailyChallenge[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(challenges))
    localStorage.setItem(CHALLENGES_DATE_KEY, getTodayDate())
  } catch (error) {
    console.error('Failed to save daily challenges', error)
  }
}

/**
 * Update challenge progress
 */
export function updateChallengeProgress(
  type: ChallengeType,
  progress: number
): DailyChallenge[] {
  const challenges = getDailyChallenges()
  const updated = challenges.map((challenge) => {
    if (challenge.type === type) {
      const newCurrent = challenge.current + progress
      const completed = newCurrent >= challenge.target
      
      return {
        ...challenge,
        current: Math.min(newCurrent, challenge.target),
        completed,
      }
    }
    return challenge
  })

  saveDailyChallenges(updated)
  return updated
}

/**
 * Complete a challenge
 */
export function completeChallenge(challengeId: string): DailyChallenge[] {
  const challenges = getDailyChallenges()
  const updated = challenges.map((challenge) => {
    if (challenge.id === challengeId && !challenge.completed) {
      return {
        ...challenge,
        current: challenge.target,
        completed: true,
      }
    }
    return challenge
  })

  saveDailyChallenges(updated)
  return updated
}

/**
 * Get challenge progress percentage
 */
export function getChallengeProgress(challenge: DailyChallenge): number {
  return challenge.target > 0
    ? Math.min(100, (challenge.current / challenge.target) * 100)
    : 0
}

/**
 * Get total completed challenges today
 */
export function getCompletedChallengesCount(): number {
  const challenges = getDailyChallenges()
  return challenges.filter((c) => c.completed).length
}

/**
 * Get total challenge points earned today
 */
export function getTotalChallengePoints(): number {
  const challenges = getDailyChallenges()
  return challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.pointsReward, 0)
}

/**
 * Reset daily challenges (for testing)
 */
export function resetDailyChallenges(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(CHALLENGE_STORAGE_KEY)
  localStorage.removeItem(CHALLENGES_DATE_KEY)
}


