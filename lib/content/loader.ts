// Content loader system - loads real content from /content/lessons folders
// and merges with courseStructure.ts

import { courseStructure, type Lesson, type Level } from '@/lib/data/courseStructure'
import type { LessonContent } from './types'
import logger from '@/lib/utils/logger'

// Load content for a specific lesson
export async function loadLessonContent(lessonId: string): Promise<LessonContent | null> {
  try {
    const content: LessonContent = {}

    // Load video script
    try {
      const scriptModule = await import(`@/content/lessons/${getLessonPath(lessonId)}/video-script.md?raw`)
      content.videoScript = scriptModule.default
    } catch (e) {
      // Content not found yet - that's okay, agents will create it
      logger.debug(`Video script not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load exercises
    try {
      const exercisesModule = await import(`@/content/lessons/${getLessonPath(lessonId)}/exercises.json`)
      content.exercises = exercisesModule.default
    } catch (e) {
      logger.debug(`Exercises not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load vocabulary
    try {
      const vocabModule = await import(`@/content/lessons/${getLessonPath(lessonId)}/vocabulary.json`)
      content.vocabulary = vocabModule.default
    } catch (e) {
      logger.debug(`Vocabulary not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load worksheet
    try {
      const worksheetModule = await import(`@/content/lessons/${getLessonPath(lessonId)}/worksheet.md?raw`)
      content.worksheet = worksheetModule.default
    } catch (e) {
      logger.debug(`Worksheet not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load quiz
    try {
      const quizModule = await import(`@/content/lessons/${getLessonPath(lessonId)}/quiz.json`)
      content.quiz = quizModule.default
    } catch (e) {
      logger.debug(`Quiz not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    return content
  } catch (error) {
    logger.error(`Error loading content for lesson ${lessonId}`, {
      context: 'ContentLoader',
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return null
  }
}

// Helper to get lesson path from ID (e.g., 'a1-1' -> 'a1/a1-1')
function getLessonPath(lessonId: string): string {
  const level = lessonId.split('-')[0] // 'a1', 'a2', etc.
  return `${level}/${lessonId}`
}

// Enhance lesson with content from files
export async function getLessonWithContent(lessonId: string): Promise<Lesson | null> {
  const lesson = courseStructure
    .flatMap(level => level.lessons)
    .find(l => l.id === lessonId)

  if (!lesson) return null

  const content = await loadLessonContent(lessonId)
  
  // Merge content into lesson object
  return {
    ...lesson,
    // Content will be loaded dynamically in components
    contentLoaded: !!content,
    hasVideoScript: !!content?.videoScript,
    hasExercises: !!content?.exercises,
    hasVocabulary: !!content?.vocabulary,
    hasWorksheet: !!content?.worksheet,
    hasQuiz: !!content?.quiz,
  } as Lesson & {
    contentLoaded?: boolean
    hasVideoScript?: boolean
    hasExercises?: boolean
    hasVocabulary?: boolean
    hasWorksheet?: boolean
    hasQuiz?: boolean
  }
}

// Get content status for all lessons
export function getContentStatus(): Record<string, {
  hasVideo: boolean
  hasExercises: boolean
  hasVocabulary: boolean
  hasWorksheet: boolean
  hasQuiz: boolean
  completion: number
}> {
  // This would check file system in production
  // For now, return placeholder
  return {}
}

