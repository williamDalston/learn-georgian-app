'use client'

import { useState, useEffect } from 'react'
import logger from '@/lib/utils/logger'
import CTAButton from '@/components/shared/CTAButton'
import LessonControls from './LessonControls'
import LessonNotes from './LessonNotes'
import { AchievementCelebration } from './AchievementBadge'
import { checkAchievements, unlockAchievement, getUnlockedAchievements, type Achievement } from '@/lib/data/achievements'
import GlassCard from '@/components/shared/GlassCard'
import { motion } from 'framer-motion'
import { PointsManager } from '@/lib/gamification/points'
import { StreakManager } from '@/lib/gamification/streaks'
import { loadLessonContent } from '@/lib/content/loader'
import { speakGeorgian, isSpeaking, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'
import NativeAudioPlayer from '@/components/learning/NativeAudioPlayer'
import { ExercisePlayer } from '@/components/exercises'
import { saveExerciseResult } from '@/lib/utils/exerciseScoring'

interface Lesson {
  id: string
  title: string
  description: string
  detailedDescription?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  moduleNumber?: number
  lessonNumber?: number
  duration?: number // in minutes
  estimatedHours?: number
  keyConcepts?: string[]
  learningObjectives?: string[]
  prerequisites?: string[]
  videoUrl?: string
  exerciseMaterials?: {
    name: string
    url: string
    type?: 'pdf' | 'audio' | 'interactive' | 'worksheet'
  }[]
  vocabulary?: {
    georgian: string
    transliteration: string
    translation: string
    ipa?: string
    example?: string
    exampleSentence?: {
      georgian: string
      transliteration: string
      translation: string
    }
    partOfSpeech?: string
    notes?: string
  }[]
  isCompleted?: boolean
}

interface LessonPlayerProps {
  lesson: Lesson
  onComplete?: (lessonId: string) => void
  onNext?: () => void
  onPrevious?: () => void
  isLoading?: boolean
}

const levelColors = {
  A1: 'bg-blue-100 text-blue-800 border-blue-200',
  A2: 'bg-green-100 text-green-800 border-green-200',
  B1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  B2: 'bg-orange-100 text-orange-800 border-orange-200',
  C1: 'bg-purple-100 text-purple-800 border-purple-200',
}

export default function LessonPlayer({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  isLoading = false,
}: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted || false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [quality, setQuality] = useState('auto')
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary' | 'materials' | 'exercises'>('overview')
  const [loadedVocabulary, setLoadedVocabulary] = useState(lesson.vocabulary || [])
  const [loadedExercises, setLoadedExercises] = useState<any>(null)
  const [speakingWordIndex, setSpeakingWordIndex] = useState<number | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)

  // Check speech support on mount
  useEffect(() => {
    setSpeechSupported(isSpeechSupported())
  }, [])

  // Load vocabulary and exercises from JSON files if available
  useEffect(() => {
    async function loadContent() {
      try {
        const content = await loadLessonContent(lesson.id)
        if (content?.vocabulary) {
          setLoadedVocabulary(content.vocabulary)
        }
        if (content?.exercises) {
          setLoadedExercises(content.exercises)
        }
      } catch (err) {
        logger.debug(`Content not loaded for ${lesson.id}`, {
          context: 'LessonPlayer',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
    loadContent()
  }, [lesson.id])

  // Handle audio playback for vocabulary words
  const handlePlayAudio = (word: any, index: number) => {
    if (speakingWordIndex === index && isSpeaking()) {
      // If already speaking this word, stop it
      stopSpeaking()
      setSpeakingWordIndex(null)
    } else {
      // Stop any current speech
      stopSpeaking()
      // Speak the Georgian word
      speakGeorgian(word.georgian, {
        rate: 0.75,
        onEnd: () => setSpeakingWordIndex(null),
        onError: () => setSpeakingWordIndex(null)
      })
      setSpeakingWordIndex(index)
    }
  }

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  // Load progress to check achievements
  const getProgress = () => {
    try {
      if (typeof window !== 'undefined') {
        const progress = localStorage.getItem('userProgress')
        const completed = localStorage.getItem('completedLessons')
        
        if (progress && completed) {
          const progressData = JSON.parse(progress)
          const completedIds = JSON.parse(completed) as string[]
          
          return {
            completedLessons: completedIds.length + (isCompleted ? 0 : 1),
            daysPracticed: progressData.daysPracticed || 0,
            currentStreak: progressData.currentStreak || 0,
            totalTime: progressData.totalTime || 0,
          }
        }
      }
    } catch (err) {
      logger.error('Failed to load progress', {
        context: 'LessonPlayer',
        error: err instanceof Error ? err : new Error(String(err)),
      })
    }
    
    return {
      completedLessons: isCompleted ? 0 : 1,
      daysPracticed: 0,
      currentStreak: 0,
      totalTime: 0,
    }
  }

  const handleMarkComplete = async () => {
    setIsCompleting(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsCompleted(true)
    setShowCompletion(true)
    setIsCompleting(false)
    onComplete?.(lesson.id)
    
    // Award points and update streak
    PointsManager.addPoints('lesson_completed', `Completed lesson: ${lesson.title}`)
    const streakUpdate = StreakManager.updateStreak()
    if (streakUpdate.updated && streakUpdate.isNewRecord) {
      PointsManager.addPoints('streak_milestone', `New streak record: ${streakUpdate.streak.current} days!`)
    }
    
    setTimeout(() => {
      const progress = getProgress()
      const newlyUnlocked = checkAchievements(progress)
      const alreadyUnlocked = getUnlockedAchievements().map(a => a.id)
      
      const newAchievements = newlyUnlocked.filter(a => !alreadyUnlocked.includes(a.id))
      
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          unlockAchievement(achievement.id)
          PointsManager.addPoints('achievement_unlocked', `Achievement: ${achievement.title}`)
        })
        
        setNewAchievement(newAchievements[0])
        setShowAchievementModal(true)
        
        setTimeout(() => {
          setShowAchievementModal(false)
          setNewAchievement(null)
        }, 5000)
      }
    }, 1000)
    
    setTimeout(() => {
      setShowCompletion(false)
    }, 4000)
  }

  const handleVideoLoad = () => {
    setVideoLoading(false)
    setVideoError(false)
  }

  const handleVideoError = () => {
    setVideoLoading(false)
    setVideoError(true)
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getMaterialIcon = (type?: string) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case 'audio':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )
      case 'interactive':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300" />
        <div className="p-8 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-12 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {lesson.level && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 shadow-sm ${levelColors[lesson.level]}`}>
                  {lesson.level}
                </span>
              )}
              {lesson.moduleNumber && lesson.lessonNumber && (
                <span className="px-3 py-1.5 bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-800 rounded-full text-xs font-semibold border border-neutral-300 shadow-sm">
                  Module {lesson.moduleNumber} • Lesson {lesson.lessonNumber}
                </span>
              )}
              {lesson.duration && (
                <span className="px-3 py-1.5 bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-800 rounded-full text-xs font-semibold border border-neutral-300 shadow-sm flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(lesson.duration)}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-primary-900 mb-4 leading-tight">
              {lesson.title}
            </h1>
            <p className="font-sans text-lg text-gray-700 leading-relaxed mb-4">
              {lesson.description}
            </p>
            {lesson.detailedDescription && (
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                {lesson.detailedDescription}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LessonControls
              currentSpeed={playbackSpeed}
              currentQuality={quality}
              onSpeedChange={setPlaybackSpeed}
              onQualityChange={setQuality}
            />
          </div>
        </div>

        {/* Key Concepts Tags */}
        {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {lesson.keyConcepts.map((concept, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 rounded-lg text-sm font-semibold border border-primary-300 shadow-sm hover:shadow-md transition-shadow"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <div className="bg-gradient-to-br from-accent-50 via-accent-100/50 to-accent-50 border border-accent-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="font-serif text-xl text-primary-900 mb-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-accent-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-bold">Learning Objectives</span>
            </h3>
            <ul className="space-y-3 ml-13">
              {lesson.learningObjectives.map((objective, index) => (
                <li key={index} className="font-sans text-base text-gray-800 leading-relaxed flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-accent-400 flex items-center justify-center mt-0.5 group-hover:bg-accent-100 transition-colors">
                    <span className="text-accent-700 font-bold text-sm">{index + 1}</span>
                  </span>
                  <span className="flex-1">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 rounded-xl p-5 mb-6 shadow-sm">
            <h3 className="font-sans font-semibold text-blue-900 mb-3 flex items-center gap-2 text-base uppercase tracking-wide">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Prerequisites
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.prerequisites.map((prereq, index) => (
                <span key={index} className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-800 shadow-sm">
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Optional Video Section - Only show if videoUrl exists */}
      {lesson.videoUrl && (
        <GlassCard className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-gray-900 to-black aspect-video">
            {!videoError ? (
              <>
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="font-sans text-white text-sm">Loading video...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={lesson.videoUrl}
                  className={`w-full h-full ${videoLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                  onLoad={handleVideoLoad}
                  onError={handleVideoError}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center p-8">
                  <svg
                    className="h-16 w-16 mx-auto mb-4 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-sans text-red-400 mb-2">Video failed to load</p>
                  <button
                    onClick={() => {
                      setVideoError(false)
                      setVideoLoading(true)
                    }}
                    className="font-sans text-sm text-white underline hover:text-gray-300"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Tabs for Additional Content */}
      {(loadedVocabulary && loadedVocabulary.length > 0) || 
       (loadedExercises && loadedExercises.exercises && loadedExercises.exercises.length > 0) ||
       (lesson.exerciseMaterials && lesson.exerciseMaterials.length > 0) ? (
        <GlassCard className="p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-4 flex-wrap">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-sans text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              {loadedVocabulary && loadedVocabulary.length > 0 && (
                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className={`px-4 py-2 font-sans text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'vocabulary'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vocabulary
                </button>
              )}
              {loadedExercises && loadedExercises.exercises && loadedExercises.exercises.length > 0 && (
                <button
                  onClick={() => setActiveTab('exercises')}
                  className={`px-4 py-2 font-sans text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'exercises'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Exercises ({loadedExercises.exercises.length})
                </button>
              )}
              {lesson.exerciseMaterials && lesson.exerciseMaterials.length > 0 && (
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-4 py-2 font-sans text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'materials'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Materials ({lesson.exerciseMaterials.length})
                </button>
              )}
            </nav>
          </div>

          {/* Vocabulary Tab */}
          {activeTab === 'vocabulary' && loadedVocabulary && (
            <div className="space-y-4">
              {loadedVocabulary.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    {/* Main Word Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-2xl font-serif text-primary-900 dark:text-primary-100 font-bold">
                            {word.georgian}
                          </h4>
                          {word.partOfSpeech && (
                            <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-semibold uppercase tracking-wide border border-primary-200">
                              {word.partOfSpeech}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                            <span className="text-accent-600 dark:text-accent-400">{word.transliteration}</span>
                            <NativeAudioPlayer
                              text={word.georgian}
                              type="word"
                              lessonId={lesson.id}
                              fallbackToTTS={true}
                              size="sm"
                            />
                          </p>
                          <p className="text-base text-primary-900 dark:text-primary-100 font-semibold">
                            {word.translation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* IPA Pronunciation */}
                    {word.ipa && (
                      <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                        <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">
                          /{word.ipa}/
                        </span>
                      </div>
                    )}

                    {/* Example Sentence or Simple Example */}
                    {(word.exampleSentence || word.example) && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-900/20 dark:to-accent-900/10 rounded-lg border border-accent-200 dark:border-accent-800 shadow-sm">
                        <p className="font-sans text-xs text-accent-700 dark:text-accent-400 font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Example
                        </p>
                        {word.exampleSentence ? (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <p className="text-base font-serif text-primary-900 dark:text-primary-100 font-medium leading-relaxed flex-1">
                                {word.exampleSentence.georgian}
                              </p>
                              <NativeAudioPlayer
                                text={word.exampleSentence.georgian}
                                type="phrase"
                                lessonId={lesson.id}
                                fallbackToTTS={true}
                                size="sm"
                              />
                            </div>
                            <p className="text-sm text-accent-700 dark:text-accent-400 font-medium">
                              {word.exampleSentence.transliteration}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic border-t border-accent-200 dark:border-accent-800 pt-2">
                              "{word.exampleSentence.translation}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic">
                            {word.example}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Notes/Usage Tips */}
                    {word.notes && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="font-sans text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Usage Tips
                        </p>
                        <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed">
                          {word.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && lesson.exerciseMaterials && (
            <div className="space-y-3">
              {lesson.exerciseMaterials.map((material, index) => (
                <motion.a
                  key={index}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 text-accent group-hover:text-accent-dark">
                    {getMaterialIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-gray-900 group-hover:text-accent transition-colors">
                      {material.name}
                    </h4>
                    {material.type && (
                      <p className="font-sans text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        {material.type}
                      </p>
                    )}
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              ))}
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && loadedExercises && loadedExercises.exercises && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="font-serif text-xl text-primary-900 mb-2">
                  Practice Exercises
                </h3>
                <p className="font-sans text-sm text-gray-600">
                  Complete these exercises to reinforce what you've learned in this lesson.
                </p>
              </div>
              {loadedExercises.exercises.map((exercise: any, index: number) => (
                <ExercisePlayer
                  key={exercise.id || index}
                  exercise={exercise}
                  onQuestionComplete={(questionId: string, isCorrect: boolean) => {
                    // Track individual question completion
                    logger.debug(`Question ${questionId} completed: ${isCorrect}`, {
                      context: 'LessonPlayer',
                    })
                  }}
                  onExerciseComplete={(exerciseId: string, earnedPoints: number, totalPoints: number) => {
                    // Save exercise result
                    const result = {
                      exerciseId: `${lesson.id}_${exerciseId}`,
                      questionResults: [] as any[],
                      totalPoints,
                      earnedPoints,
                      percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
                      completedAt: new Date(),
                    }
                    saveExerciseResult(result)
                    
                    // Award points for completing exercises
                    PointsManager.addPoints('exercise_completed', `Completed exercise: ${exercise.title}`)
                  }}
                  showResults={false}
                />
              ))}
            </div>
          )}

          {/* Overview Tab (Exercise Materials displayed here too) */}
          {activeTab === 'overview' && lesson.exerciseMaterials && lesson.exerciseMaterials.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-primary-900 mb-4">
                Exercise Materials
              </h3>
              {lesson.exerciseMaterials.map((material, index) => (
                <a
                  key={index}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 text-accent group-hover:text-accent-dark">
                    {getMaterialIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-gray-900 group-hover:text-accent transition-colors">
                      {material.name}
                    </h4>
                    {material.type && (
                      <p className="font-sans text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        {material.type}
                      </p>
                    )}
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </GlassCard>
      ) : (
        // Fallback: Exercise Materials without tabs if no vocabulary
        lesson.exerciseMaterials && lesson.exerciseMaterials.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="font-serif text-xl text-primary-900 mb-4">
              Exercise Materials
            </h3>
            <div className="space-y-3">
              {lesson.exerciseMaterials.map((material, index) => (
                <a
                  key={index}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 text-accent group-hover:text-accent-dark">
                    {getMaterialIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-gray-900 group-hover:text-accent transition-colors">
                      {material.name}
                    </h4>
                    {material.type && (
                      <p className="font-sans text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        {material.type}
                      </p>
                    )}
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-accent transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </GlassCard>
        )
      )}

      {/* Action Buttons */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted ? (
            <CTAButton
              onClick={handleMarkComplete}
              className="flex-1"
              disabled={isCompleting}
            >
              {isCompleting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Completing...
                </span>
              ) : (
                'Mark as Complete'
              )}
            </CTAButton>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg font-sans font-semibold border border-green-200">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-sans font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
            {onNext && (
              <CTAButton
                onClick={onNext}
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                Next Lesson
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </CTAButton>
            )}
          </div>
        </div>

        {/* Completion Celebration */}
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200 rounded-xl"
          >
            <p className="font-sans text-center text-accent-700 font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl animate-bounce">🎉</span>
              <span>Great job! You've completed this lesson. Keep going!</span>
            </p>
          </motion.div>
        )}
      </GlassCard>

      {/* Lesson Notes */}
      <div className="mt-6">
        <LessonNotes lessonId={lesson.id} />
      </div>

      {/* Achievement Celebration Modal */}
      {showAchievementModal && newAchievement && (
        <AchievementCelebration achievement={newAchievement} />
      )}
    </div>
  )
}
