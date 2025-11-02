import { useState, useEffect, useRef } from 'react'

interface SwipeDirection {
  horizontal: 'left' | 'right' | null
  vertical: 'up' | 'down' | null
}

interface SwipeState {
  isSwiping: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  direction: SwipeDirection
}

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number // Minimum distance to trigger swipe (default: 50)
  preventScroll?: boolean // Prevent scrolling while swiping (default: false)
  allowVertical?: boolean // Allow vertical swipes (default: true)
  allowHorizontal?: boolean // Allow horizontal swipes (default: true)
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false,
  allowVertical = true,
  allowHorizontal = true,
}: UseSwipeGestureOptions = {}) {
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let touchStartX = 0
    let touchStartY = 0
    let touchCurrentX = 0
    let touchCurrentY = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchCurrentX = touch.clientX
      touchCurrentY = touch.clientY

      setSwipeState({
        isSwiping: true,
        startX: touchStartX,
        startY: touchStartY,
        currentX: touchCurrentX,
        currentY: touchCurrentY,
        deltaX: 0,
        deltaY: 0,
        direction: { horizontal: null, vertical: null },
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchCurrentX = touch.clientX
      touchCurrentY = touch.clientY

      const deltaX = touchCurrentX - touchStartX
      const deltaY = touchCurrentY - touchStartY

      // Determine direction
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      let horizontal: 'left' | 'right' | null = null
      let vertical: 'up' | 'down' | null = null

      if (allowHorizontal && absDeltaX > Math.abs(deltaY)) {
        horizontal = deltaX > 0 ? 'right' : 'left'
      } else if (allowVertical && absDeltaY > absDeltaX) {
        vertical = deltaY > 0 ? 'down' : 'up'
      }

      // Prevent scrolling if configured
      if (preventScroll && (horizontal || vertical)) {
        e.preventDefault()
      }

      setSwipeState({
        isSwiping: true,
        startX: touchStartX,
        startY: touchStartY,
        currentX: touchCurrentX,
        currentY: touchCurrentY,
        deltaX,
        deltaY,
        direction: { horizontal, vertical },
      })
    }

    const handleTouchEnd = () => {
      if (!swipeState) {
        setSwipeState(null)
        return
      }

      const { deltaX, deltaY, direction } = swipeState

      // Only trigger if threshold is met
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (direction.horizontal && absDeltaX >= threshold) {
        if (direction.horizontal === 'left' && onSwipeLeft) {
          onSwipeLeft()
        } else if (direction.horizontal === 'right' && onSwipeRight) {
          onSwipeRight()
        }
      }

      if (direction.vertical && absDeltaY >= threshold) {
        if (direction.vertical === 'up' && onSwipeUp) {
          onSwipeUp()
        } else if (direction.vertical === 'down' && onSwipeDown) {
          onSwipeDown()
        }
      }

      setSwipeState(null)
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [swipeState, threshold, preventScroll, allowVertical, allowHorizontal, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return { elementRef, swipeState }
}

