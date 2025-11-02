// Content loader system - loads real content from /content/lessons folders
// and merges with courseStructure.ts

import { courseStructure, type Lesson, type Level } from '@/lib/data/courseStructure'
import type { LessonContent } from './types'
import logger from '@/lib/utils/logger'

// Helper to fetch markdown files via API route (works with Turbopack)
async function fetchMarkdownContent(path: string): Promise<string | undefined> {
  try {
    const response = await fetch(`/api/content/${path}`)
    if (response.ok) {
      return await response.text()
    }
    return undefined
  } catch (e) {
    return undefined
  }
}

// Load content for a specific lesson
export async function loadLessonContent(lessonId: string): Promise<LessonContent | null> {
  try {
    const content: LessonContent = {}
    const lessonPath = getLessonPath(lessonId)

    // Load video script (markdown - use API route)
    try {
      const videoScript = await fetchMarkdownContent(`${lessonPath}/video-script.md`)
      if (videoScript) {
        content.videoScript = videoScript
      } else {
        logger.debug(`Video script not found for ${lessonId}`, { context: 'ContentLoader' })
      }
    } catch (e) {
      logger.debug(`Video script not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load exercises (JSON - dynamic import works fine)
    try {
      const exercisesModule = await import(`@/content/lessons/${lessonPath}/exercises.json`)
      content.exercises = exercisesModule.default
    } catch (e) {
      logger.debug(`Exercises not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load vocabulary (JSON - dynamic import works fine)
    try {
      const vocabModule = await import(`@/content/lessons/${lessonPath}/vocabulary.json`)
      content.vocabulary = vocabModule.default
    } catch (e) {
      logger.debug(`Vocabulary not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load worksheet (markdown - use API route)
    try {
      const worksheet = await fetchMarkdownContent(`${lessonPath}/worksheet.md`)
      if (worksheet) {
        content.worksheet = worksheet
      } else {
        logger.debug(`Worksheet not found for ${lessonId}`, { context: 'ContentLoader' })
      }
    } catch (e) {
      logger.debug(`Worksheet not found for ${lessonId}`, { context: 'ContentLoader' })
    }

    // Load quiz (JSON - dynamic import works fine)
    try {
      const quizModule = await import(`@/content/lessons/${lessonPath}/quiz.json`)
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

