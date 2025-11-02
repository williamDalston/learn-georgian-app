'use client'

import { useState, useEffect } from 'react'

const BOOKMARKS_KEY = 'bookmarkedLessons'

export interface Bookmark {
  lessonId: string
  timestamp: number
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(BOOKMARKS_KEY)
        if (saved) {
          const bookmarkData: Bookmark[] = JSON.parse(saved)
          setBookmarks(bookmarkData.map(b => b.lessonId))
        }
      } catch (err) {
        console.error('Failed to load bookmarks:', err)
      }
    }
  }

  const toggleBookmark = (lessonId: string): boolean => {
    const isBookmarked = bookmarks.includes(lessonId)
    
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(BOOKMARKS_KEY)
        const bookmarkData: Bookmark[] = saved ? JSON.parse(saved) : []
        
        if (isBookmarked) {
          // Remove bookmark
          const updated = bookmarkData.filter(b => b.lessonId !== lessonId)
          localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
          setBookmarks(updated.map(b => b.lessonId))
          return false
        } else {
          // Add bookmark
          const updated = [...bookmarkData, { lessonId, timestamp: Date.now() }]
          localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
          setBookmarks(updated.map(b => b.lessonId))
          return true
        }
      } catch (err) {
        console.error('Failed to save bookmark:', err)
      }
    }
    
    return !isBookmarked
  }

  const isBookmarked = (lessonId: string): boolean => {
    return bookmarks.includes(lessonId)
  }

  const getBookmarks = (): Bookmark[] => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(BOOKMARKS_KEY)
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (err) {
        console.error('Failed to load bookmarks:', err)
      }
    }
    return []
  }

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    getBookmarks,
    loadBookmarks,
  }
}


