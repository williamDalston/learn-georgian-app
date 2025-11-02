// Helper functions for checking achievement conditions that require course structure

import { courseStructure, type Lesson } from '@/lib/data/courseStructure'

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

