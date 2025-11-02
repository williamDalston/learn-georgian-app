import { useState, useEffect, useRef } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number // Distance to trigger refresh (default: 80)
  disabled?: boolean // Disable pull to refresh (default: false)
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (disabled) return

    const container = containerRef.current
    if (!container) return

    let touchStartY = 0
    let currentY = 0
    let isAtTop = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      currentY = touchStartY

      // Check if user is at the top of the scrollable area
      isAtTop = container.scrollTop === 0

      if (isAtTop) {
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return

      currentY = e.touches[0].clientY
      const deltaY = currentY - touchStartY

      // Only allow downward pull
      if (deltaY > 0 && isAtTop) {
        const distance = Math.min(deltaY, threshold * 1.5) // Allow slight overscroll
        setPullDistance(distance)

        // Prevent default scrolling when pulling
        if (distance > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return

      // Trigger refresh if threshold is met
      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        await onRefresh()
        setIsRefreshing(false)
      }

      // Reset state
      setIsPulling(false)
      setPullDistance(0)
    }

    const handleScroll = () => {
      // Reset pulling state if user scrolls
      if (container.scrollTop > 0) {
        setIsPulling(false)
        setPullDistance(0)
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [onRefresh, threshold, disabled, isPulling, pullDistance])

  const progress = pullDistance / threshold

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    progress: Math.min(progress, 1), // Cap at 1
    shouldTrigger: pullDistance >= threshold,
  }
}


