'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback'

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  label?: string
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'small' | 'medium' | 'large'
  className?: string
  hideOnScroll?: boolean // Hide FAB when scrolling down
}

export default function FloatingActionButton({
  onClick,
  icon,
  label,
  variant = 'primary',
  size = 'large',
  className = '',
  hideOnScroll = false,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const { success } = useHapticFeedback()

  useEffect(() => {
    if (!hideOnScroll) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Show when scrolling up, hide when scrolling down
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollTop(scrollTop)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hideOnScroll, lastScrollTop])

  const handleClick = () => {
    onClick()
    success()
  }

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    accent: 'bg-accent hover:bg-accent-dark text-white',
  }

  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
  }

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
  }

  const defaultIcon = (
    <svg
      className={iconSizes[size]}
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
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className={`
            fixed bottom-24 right-4 z-50 rounded-full shadow-lg
            flex items-center justify-center
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            ${variants[variant]}
            ${sizes[size]}
            ${className}
            pb-safe
          `}
          aria-label={label || 'Floating action button'}
        >
          {icon || defaultIcon}
        </motion.button>
      )}
    </AnimatePresence>
  )
}


