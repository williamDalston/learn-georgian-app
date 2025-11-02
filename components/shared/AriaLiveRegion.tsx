'use client'

import { useEffect, useState } from 'react'

interface AriaLiveRegionProps {
  /**
   * The message to announce
   */
  message: string
  /**
   * Priority level - 'polite' for non-urgent updates, 'assertive' for important/urgent updates
   */
  priority?: 'polite' | 'assertive'
  /**
   * Clear the message after this many milliseconds (0 = don't clear)
   */
  clearAfter?: number
  /**
   * ID for the live region (useful if you have multiple regions)
   */
  id?: string
}

/**
 * ARIA Live Region component for announcing dynamic updates to screen readers
 * 
 * Usage:
 * ```tsx
 * <AriaLiveRegion 
 *   message="Achievement unlocked: First Lesson!" 
 *   priority="assertive"
 * />
 * ```
 */
export default function AriaLiveRegion({
  message,
  priority = 'polite',
  clearAfter = 5000,
  id = 'aria-live-region',
}: AriaLiveRegionProps) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      setAnnouncement(message)
      
      // Clear message after delay if specified
      if (clearAfter > 0) {
        const timer = setTimeout(() => {
          setAnnouncement('')
        }, clearAfter)
        
        return () => clearTimeout(timer)
      }
    }
  }, [message, clearAfter])

  return (
    <div
      id={id}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      aria-relevant="additions text"
    >
      {announcement}
    </div>
  )
}

/**
 * Hook to use ARIA live region announcements
 */
export function useAriaLiveAnnouncement() {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = (
    text: string,
    announcePriority: 'polite' | 'assertive' = 'polite'
  ) => {
    setPriority(announcePriority)
    setMessage('') // Clear first to ensure re-announcement
    setTimeout(() => setMessage(text), 100)
  }

  return {
    announce,
    AriaLiveRegion: (
      <AriaLiveRegion message={message} priority={priority} />
    ),
  }
}

