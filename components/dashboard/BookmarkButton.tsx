'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBookmarks } from '@/lib/hooks/useBookmarks'

interface BookmarkButtonProps {
  lessonId: string
  className?: string
}

export default function BookmarkButton({ lessonId, className = '' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [bookmarked, setBookmarked] = useState(false)
  const [justToggled, setJustToggled] = useState(false)

  useEffect(() => {
    setBookmarked(isBookmarked(lessonId))
  }, [isBookmarked, lessonId])

  const handleToggle = () => {
    const newState = toggleBookmark(lessonId)
    setBookmarked(newState)
    setJustToggled(true)
    setTimeout(() => setJustToggled(false), 600)
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors relative ${
        bookmarked
          ? 'text-accent hover:bg-accent/10'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
    >
      <svg
        className="h-5 w-5 transition-all"
        fill={bookmarked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      
      {justToggled && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-sans">
            {bookmarked ? '✓ Bookmarked' : 'Removed'}
          </div>
        </motion.div>
      )}
    </motion.button>
  )
}


