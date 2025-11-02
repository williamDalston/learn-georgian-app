// Types for lesson content loaded from /content/lessons folders

export interface LessonContent {
  videoScript?: string
  exercises?: ExerciseSet
  vocabulary?: VocabularyItem[]
  worksheet?: string
  quiz?: Quiz
  audioScript?: string
}

export interface ExerciseSet {
  lessonId: string
  lessonTitle: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'audio' | 'writing' | 'translation'
  title: string
  instructions: string
  points: number
  questions: Question[]
}

export interface Question {
  id: string
  question: string
  questionGeorgian?: string
  type: string
  options?: Option[]
  correctAnswer?: string | string[]
  alternatives?: string[]
  leftItems?: MatchItem[]
  rightItems?: MatchItem[]
  correctMatches?: { left: string; right: string }[]
  explanation?: string
  explanationGeorgian?: string
  audioUrl?: string
  responseType?: 'recording' | 'text'
}

export interface Option {
  id: string
  text: string
  textGeorgian?: string
}

export interface MatchItem {
  id: string
  text: string
  textGeorgian?: string
}

export interface VocabularyItem {
  id: string
  georgian: string
  transliteration: string
  translation: string
  ipa?: string
  partOfSpeech?: string
  exampleSentence?: {
    georgian: string
    transliteration: string
    translation: string
    audioUrl?: string
  }
  notes?: string
}

export interface Quiz {
  lessonId: string
  title: string
  questions: Question[]
  passingScore?: number
  timeLimit?: number
}

