// Helper functions for checking achievement conditions that require course structure

import { courseStructure, type Lesson } from '@/lib/data/courseStructure'
import { achievements, getUnlockedAchievements, type Achievement } from '@/lib/data/achievements'

export function checkLevelCompletion(levelCode: string, completedLessonIds: string[]): boolean {
  const level = courseStructure.find(l => l.code === levelCode)
  if (!level) return false
  
  return level.lessons.every(lesson => completedLessonIds.includes(lesson.id))
}

export function getLevelProgress(levelCode: string, completedLessonIds: string[]) {
  const level = courseStructure.find(l => l.code === levelCode)
  if (!level) return { completed: 0, total: 0, percentage: 0 }
  
  const completed = level.lessons.filter(l => completedLessonIds.includes(l.id)).length
  const total = level.lessons.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

export function checkAllLevelCompletions(completedLessonIds: string[]): string[] {
  return courseStructure
    .filter(level => checkLevelCompletion(level.code, completedLessonIds))
    .map(level => level.code)
}

interface GetNextAchievementParams {
  completedLessons: number
  daysPracticed: number
  currentStreak: number
  totalTime: number
  completedLessonIds?: string[]
}

interface NextAchievementResult {
  achievement: Achievement
  progress: number
  remaining: number
  message: string
}

export function getNextAchievement(params: GetNextAchievementParams): NextAchievementResult | null {
  const { completedLessons, daysPracticed, currentStreak, totalTime, completedLessonIds = [] } = params
  
  // Get unlocked achievements (server-safe)
  let unlockedIds: string[] = []
  if (typeof window !== 'undefined') {
    try {
      const unlocked = getUnlockedAchievements()
      unlockedIds = unlocked.map(a => a.id)
    } catch {
      unlockedIds = []
    }
  }
  
  // Find the first achievement that isn't unlocked
  const nextAchievement = achievements.find(achievement => !unlockedIds.includes(achievement.id))
  
  if (!nextAchievement) {
    return null // All achievements unlocked
  }
  
  let progress = 0
  let remaining = 0
  let message = ''
  
  // Special handling for level completion achievements
  if (nextAchievement.id === 'a1-complete') {
    const levelProgress = getLevelProgress('A1', completedLessonIds)
    progress = levelProgress.percentage
    remaining = levelProgress.total - levelProgress.completed
    message = remaining > 0 
      ? `${remaining} more lesson${remaining !== 1 ? 's' : ''} to complete A1 level!`
      : 'Almost there! Complete the remaining A1 lessons.'
  } else {
    // Calculate progress based on achievement type
    const progressData = {
      completedLessons,
      daysPracticed,
      currentStreak,
      totalTime,
    }
    
    // Determine target value and current value based on achievement ID
    let target = 0
    let current = 0
    
    switch (nextAchievement.id) {
      case 'first-lesson':
        target = 1
        current = completedLessons
        message = current === 0 ? 'Complete your first lesson to unlock this achievement!' : 'Keep going!'
        break
      
      case 'week-streak':
        target = 7
        current = currentStreak
        message = `${7 - currentStreak} more day${7 - currentStreak !== 1 ? 's' : ''} to reach your 7-day streak!`
        break
      
      case 'month-streak':
        target = 30
        current = currentStreak
        message = `${30 - currentStreak} more day${30 - currentStreak !== 1 ? 's' : ''} to become a Consistency Champion!`
        break
      
      case '10-hours':
        target = 600 // minutes
        current = totalTime
        const remainingMinutes = 600 - totalTime
        const remainingHours = Math.floor(remainingMinutes / 60)
        const remainingMins = remainingMinutes % 60
        message = remainingHours > 0
          ? `${remainingHours} hour${remainingHours !== 1 ? 's' : ''} and ${remainingMins} minute${remainingMins !== 1 ? 's' : ''} to go!`
          : `${remainingMins} more minute${remainingMins !== 1 ? 's' : ''} to reach 10 hours!`
        break
      
      case '50-hours':
        target = 3000 // minutes
        current = totalTime
        const remaining50Mins = 3000 - totalTime
        const remaining50Hours = Math.floor(remaining50Mins / 60)
        message = `${remaining50Hours} more hour${remaining50Hours !== 1 ? 's' : ''} to reach 50 hours of learning!`
        break
      
      case 'first-week':
        target = 7
        current = daysPracticed
        message = `${7 - daysPracticed} more day${7 - daysPracticed !== 1 ? 's' : ''} of practice to complete your first week!`
        break
      
      case 'month-practiced':
        target = 30
        current = daysPracticed
        message = `${30 - daysPracticed} more day${30 - daysPracticed !== 1 ? 's' : ''} of practice to reach your monthly milestone!`
        break
      
      case 'halfway':
        target = 16
        current = completedLessons
        message = `${16 - completedLessons} more lesson${16 - completedLessons !== 1 ? 's' : ''} to reach the halfway point!`
        break
      
      case 'almost-there':
        target = 25
        current = completedLessons
        message = `${25 - completedLessons} more lesson${25 - completedLessons !== 1 ? 's' : ''} to reach 75% completion!`
        break
      
      default:
        // Fallback: check condition to see if already met
        const isMet = nextAchievement.condition(progressData)
        target = 1
        current = isMet ? 1 : 0
        message = isMet ? 'Achievement ready to unlock!' : 'Keep progressing toward this achievement!'
    }
    
    remaining = Math.max(0, target - current)
    progress = target > 0 ? Math.round((current / target) * 100) : 0
    progress = Math.min(100, Math.max(0, progress)) // Clamp between 0 and 100
  }
  
  return {
    achievement: nextAchievement,
    progress,
    remaining,
    message,
  }
}

