'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion'
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  maxHeight?: string // e.g., '80vh'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  className?: string
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  maxHeight = '80vh',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
}: BottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const { trigger } = useHapticFeedback()

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
      trigger('light')
    }
  }

  const handleClose = () => {
    onClose()
    trigger('light')
  }

  // Handle drag to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const touchY = touch.clientY
    const contentElement = contentRef.current
    if (!contentElement) return

    const rect = contentElement.getBoundingClientRect()
    // Only allow drag from top of bottom sheet
    if (touchY - rect.top > 50) return // Only drag from top 50px

    setIsDragging(true)
    setDragY(0)
    trigger('light')
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - (e.currentTarget as any).startY

    // Only allow downward dragging
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = 100 // pixels to dismiss
    if (dragY > threshold) {
      handleClose()
    }

    setIsDragging(false)
    setDragY(0)
  }

  // Store touch start position
  const contentRefWithTouch = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = contentRefWithTouch.current
    if (!element) return

    const handleTouchStartForMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        (e.currentTarget as any).startY = e.touches[0].clientY
      }
    }

    element.addEventListener('touchstart', handleTouchStartForMove, { passive: true })
    return () => element.removeEventListener('touchstart', handleTouchStartForMove)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const SHEET_TRANSITION: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  }

  const sheetVariants = {
    hidden: {
      y: '100%',
      transition: SHEET_TRANSITION,
    },
    visible: {
      y: 0,
      transition: SHEET_TRANSITION,
    },
  } satisfies Variants

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleBackdropClick}
            style={{ backdropFilter: 'blur(4px)' }}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={contentRefWithTouch}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl ${className}`}
            style={{
              maxHeight,
              transform: isDragging ? `translateY(${dragY}px)` : undefined,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
                {title && (
                  <h2
                    id="bottom-sheet-title"
                    className="font-serif text-xl text-primary-900"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="ml-auto p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
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
                )}
              </div>
            )}

            {/* Content */}
            <div
              ref={contentRef}
              className="overflow-y-auto"
              style={{ maxHeight: `calc(${maxHeight} - ${title || showCloseButton ? '80px' : '40px'})` }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


