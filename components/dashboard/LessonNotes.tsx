'use client'

import { useState, useEffect } from 'react'

interface LessonNotesProps {
  lessonId: string
  className?: string
}

export default function LessonNotes({ lessonId, className = '' }: LessonNotesProps) {
  const [notes, setNotes] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load notes from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`lesson-notes-${lessonId}`)
      if (saved) {
        setNotes(saved)
      }
    }
  }, [lessonId])

  // Auto-save notes
  useEffect(() => {
    if (notes === '') return

    setIsSaving(true)
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lesson-notes-${lessonId}`, notes)
        setIsSaving(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [notes, lessonId])

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-primary-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="font-serif text-lg text-primary-900">Notes</h3>
          {isSaving && (
            <span className="font-sans text-xs text-gray-500">Saving...</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes as you watch the lesson..."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-sans text-xs text-gray-500">
              {notes.length} characters • Auto-saved
            </p>
            <button
              onClick={() => {
                setNotes('')
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(`lesson-notes-${lessonId}`)
                }
              }}
              className="font-sans text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear notes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

