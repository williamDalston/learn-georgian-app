'use client'

import { useEffect, useState } from 'react'
import CTAButton from '@/components/shared/CTAButton'

interface WelcomeModalProps {
  onStartLesson?: () => void
  onTakeTour?: () => void
  isFirstVisit?: boolean
}

export default function WelcomeModal({
  onStartLesson,
  onTakeTour,
  isFirstVisit = true,
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(isFirstVisit)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsAnimating(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Close modal when user clicks outside or on close button
  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsOpen(false)
      // Store that user has seen welcome in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasSeenWelcome', 'true')
      }
    }, 200)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleStartLesson = () => {
    handleClose()
    setTimeout(() => onStartLesson?.(), 250)
  }

  const handleTakeTour = () => {
    handleClose()
    setTimeout(() => onTakeTour?.(), 250)
  }

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div
        className={`relative w-full max-w-md rounded-lg bg-white shadow-2xl transform transition-all duration-300 ${
          isAnimating
            ? 'scale-95 opacity-0 translate-y-4'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-full p-1"
          aria-label="Close welcome modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Welcome Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-accent bg-opacity-10 p-4 animate-pulse">
              <svg
                className="h-12 w-12 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <h2
              id="welcome-modal-title"
              className="font-serif text-3xl text-primary-900 mb-3"
            >
              Welcome to Your Georgian Learning Journey
            </h2>
            <p className="font-sans text-lg text-gray-600 leading-relaxed">
              You're about to begin an exciting journey to master Georgian.
              Let's get you started.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              onClick={handleStartLesson}
              className="flex-1 sm:flex-none transform hover:scale-105 transition-transform"
            >
              Start Lesson 1
            </CTAButton>
            <CTAButton
              onClick={handleTakeTour}
              variant="secondary"
              className="flex-1 sm:flex-none transform hover:scale-105 transition-transform"
            >
              Take a Quick Tour
            </CTAButton>
          </div>

          <p className="mt-6 text-sm text-gray-500 font-sans">
            You can always access the tour from the dashboard later.
          </p>
        </div>
      </div>
    </div>
  )
}

