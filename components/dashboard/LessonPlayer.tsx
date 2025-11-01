'use client'

import { useState } from 'react'
import CTAButton from '@/components/shared/CTAButton'
import LessonControls from './LessonControls'
import LessonNotes from './LessonNotes'

interface Lesson {
  id: string
  title: string
  description: string
  videoUrl?: string
  duration?: number // in minutes
  exerciseMaterials?: {
    name: string
    url: string
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

  const handleMarkComplete = async () => {
    setIsCompleting(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsCompleted(true)
    setShowCompletion(true)
    setIsCompleting(false)
    onComplete?.(lesson.id)
    
    // Hide celebration after 4 seconds
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="aspect-video bg-gray-200" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
      {/* Video Player Section */}
      <div className="relative bg-black aspect-video">
        {lesson.videoUrl && !videoError ? (
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
              {videoError ? (
                <>
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
                </>
              ) : (
                <>
                  <svg
                    className="h-16 w-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-sans text-gray-400">Video Player</p>
                  {lesson.duration && (
                    <p className="font-sans text-sm text-gray-500 mt-2">
                      Duration: {formatDuration(lesson.duration)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="p-6">
        {/* Title and Duration */}
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-serif text-2xl text-primary-900 pr-4 flex-1 min-w-0">
            {lesson.title}
          </h2>
          <div className="flex items-center gap-4">
            {lesson.duration && (
              <span className="font-sans text-sm text-gray-500 whitespace-nowrap">
                {formatDuration(lesson.duration)}
              </span>
            )}
            <LessonControls
              currentSpeed={playbackSpeed}
              currentQuality={quality}
              onSpeedChange={setPlaybackSpeed}
              onQualityChange={setQuality}
            />
          </div>
        </div>

        {/* Description */}
        <p className="font-sans text-gray-700 mb-6 leading-relaxed">
          {lesson.description}
        </p>

        {/* Exercise Materials */}
        {lesson.exerciseMaterials && lesson.exerciseMaterials.length > 0 && (
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-sans font-semibold text-gray-900 mb-3">
              Exercise Materials
            </h3>
            <ul className="space-y-2">
              {lesson.exerciseMaterials.map((material, index) => (
                <li key={index}>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-accent hover:text-accent-dark flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {material.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
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
                className="px-4 py-2 border border-gray-300 rounded-lg font-sans font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {onNext && (
              <CTAButton
                onClick={onNext}
                variant="secondary"
                className="flex-1"
              >
                Next Lesson
              </CTAButton>
            )}
          </div>
        </div>

        {/* Completion Celebration */}
        {showCompletion && (
          <div className="mt-4 p-4 bg-accent bg-opacity-10 border border-accent border-opacity-30 rounded-lg animate-fade-in">
            <p className="font-sans text-center text-accent font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl animate-bounce">🎉</span>
              <span>Great job! You've completed this lesson. Keep going!</span>
            </p>
          </div>
        )}
      </div>

      {/* Lesson Notes */}
      <div className="mt-6">
        <LessonNotes lessonId={lesson.id} />
      </div>
    </div>
  )
}

