'use client'

import { useState, useEffect, useCallback } from 'react'
import CTAButton from '@/components/shared/CTAButton'

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(false)

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return

    // Check if user has scrolled past hero section (approximately 85vh)
    const heroHeight = window.innerHeight * 0.85
    const scrollPosition = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const distanceFromBottom = scrollHeight - (scrollPosition + clientHeight)
    
    // Hide when near bottom (within 150px) to avoid conflict with mobile navigation
    const nearBottom = distanceFromBottom < 150
    
    // Only show on mobile screens and if scrolled past hero and not near bottom
    const shouldShow = window.innerWidth < 1024 && 
                      scrollPosition > heroHeight && 
                      !nearBottom

    setIsNearBottom(nearBottom)
    setIsVisible(shouldShow)
  }, [])

  // Debounced scroll handler for better performance
  const debouncedHandleScroll = useCallback(
    debounce(handleScroll, 100),
    [handleScroll]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial check
    handleScroll()

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [handleScroll, debouncedHandleScroll])

  // Don't render if not visible or on desktop
  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden slide-in-from-bottom duration-300">
      <div className="bg-white/95 backdrop-blur-sm border-t-2 border-neutral-200 shadow-2xl p-4">
        <div className="max-w-md mx-auto">
          <CTAButton href="/dashboard/courses" variant="primary" size="lg" fullWidth>
            Start Learning Free
          </CTAButton>
        </div>
      </div>
    </div>
  )
}
