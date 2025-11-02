// Achievement definitions for the Georgian learning course

export type AchievementCategory = 'lessons' | 'streaks' | 'time' | 'milestones'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  condition: (progress: {
    completedLessons: number
    daysPracticed: number
    currentStreak: number
    totalTime: number
    level?: string
  }) => boolean
  unlockedAt?: Date
}

export const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🚀',
    category: 'lessons',
    condition: (progress) => progress.completedLessons >= 1,
  },
  {
    id: 'a1-complete',
    title: 'A1 Master',
    description: 'Complete all A1 level lessons',
    icon: '📚',
    category: 'lessons',
    condition: (progress) => {
      // This will be checked separately based on lesson completion
      // For now, we'll check this in the component that tracks level completion
      return false // Handled separately
    },
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: '🔥',
    category: 'streaks',
    condition: (progress) => progress.currentStreak >= 7,
  },
  {
    id: 'month-streak',
    title: 'Consistency Champion',
    description: 'Maintain a 30-day practice streak',
    icon: '⭐',
    category: 'streaks',
    condition: (progress) => progress.currentStreak >= 30,
  },
  {
    id: '10-hours',
    title: 'Dedicated Learner',
    description: 'Spend 10 hours learning',
    icon: '⏰',
    category: 'time',
    condition: (progress) => progress.totalTime >= 600,
  },
  {
    id: '50-hours',
    title: 'Serious Student',
    description: 'Spend 50 hours learning',
    icon: '💎',
    category: 'time',
    condition: (progress) => progress.totalTime >= 3000,
  },
  {
    id: 'first-week',
    title: 'First Week Complete',
    description: 'Practice for 7 days',
    icon: '📅',
    category: 'milestones',
    condition: (progress) => progress.daysPracticed >= 7,
  },
  {
    id: 'month-practiced',
    title: 'Monthly Milestone',
    description: 'Practice for 30 days',
    icon: '🗓️',
    category: 'milestones',
    condition: (progress) => progress.daysPracticed >= 30,
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    description: 'Complete 50% of the course',
    icon: '🎯',
    category: 'milestones',
    condition: (progress) => progress.completedLessons >= 16, // 33 total lessons
  },
  {
    id: 'almost-there',
    title: 'Almost There',
    description: 'Complete 75% of the course',
    icon: '🏆',
    category: 'milestones',
    condition: (progress) => progress.completedLessons >= 25,
  },
]

export function checkAchievements(progress: {
  completedLessons: number
  daysPracticed: number
  currentStreak: number
  totalTime: number
  level?: string
}): Achievement[] {
  return achievements.filter(achievement => achievement.condition(progress))
}

export function getUnlockedAchievements(): Achievement[] {
  if (typeof window === 'undefined') return []
  
  try {
    const unlocked = localStorage.getItem('unlockedAchievements')
    if (!unlocked) return []
    
    const unlockedIds = JSON.parse(unlocked) as string[]
    return achievements.filter(a => unlockedIds.includes(a.id))
  } catch {
    return []
  }
}

export function unlockAchievement(achievementId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const unlocked = localStorage.getItem('unlockedAchievements')
    const unlockedIds = unlocked ? (JSON.parse(unlocked) as string[]) : []
    
    if (!unlockedIds.includes(achievementId)) {
      unlockedIds.push(achievementId)
      localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedIds))
      
      // Store unlock timestamp
      const timestamps = localStorage.getItem('achievementTimestamps')
      const timestampMap = timestamps ? JSON.parse(timestamps) : {}
      timestampMap[achievementId] = new Date().toISOString()
      localStorage.setItem('achievementTimestamps', JSON.stringify(timestampMap))
    }
  } catch (err) {
    console.error('Failed to unlock achievement:', err)
  }
}

