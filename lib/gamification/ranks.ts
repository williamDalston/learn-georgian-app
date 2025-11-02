// Learner Rank System
// Based on total lessons completed

export interface Rank {
  id: string
  name: string
  description: string
  icon: string
  minLessons: number
  color: string
}

export const ranks: Rank[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Getting started',
    icon: '🌱',
    minLessons: 0,
    color: '#4ECDC4',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Making progress',
    icon: '🌿',
    minLessons: 5,
    color: '#45B7D1',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Pretty good!',
    icon: '🌳',
    minLessons: 15,
    color: '#96CEB4',
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Master level',
    icon: '🏆',
    minLessons: 25,
    color: '#FFEAA7',
  },
]

export function getRankByLessons(completedLessons: number): Rank {
  // Find the highest rank the user qualifies for
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (completedLessons >= ranks[i].minLessons) {
      return ranks[i]
    }
  }
  
  // Fallback to first rank
  return ranks[0]
}

export function getNextRank(currentRank: Rank): Rank | null {
  const currentIndex = ranks.findIndex((r) => r.id === currentRank.id)
  
  if (currentIndex < ranks.length - 1) {
    return ranks[currentIndex + 1]
  }
  
  return null
}

export function getRankProgress(completedLessons: number, currentRank: Rank): {
  progress: number
  nextRank: Rank | null
  lessonsUntilNext: number
} {
  const nextRank = getNextRank(currentRank)
  
  if (!nextRank) {
    return {
      progress: 100,
      nextRank: null,
      lessonsUntilNext: 0,
    }
  }
  
  const lessonRange = nextRank.minLessons - currentRank.minLessons
  const progressInRange = completedLessons - currentRank.minLessons
  
  const progress = (progressInRange / lessonRange) * 100
  const lessonsUntilNext = Math.max(0, nextRank.minLessons - completedLessons)
  
  return {
    progress: Math.min(100, Math.max(0, progress)),
    nextRank,
    lessonsUntilNext,
  }
}



