'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SuccessStateProps {
  title?: string
  message?: string
  icon?: ReactNode
  className?: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export default function SuccessState({
  title = "Success!",
  message,
  icon,
  className = '',
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
}: SuccessStateProps) {
  // Auto-close after delay if enabled
  if (autoClose && onClose) {
    setTimeout(() => {
      onClose()
    }, autoCloseDelay)
  }

  const defaultIcon = (
    <motion.div
      className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <motion.svg
        className="w-10 h-10 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </motion.svg>
    </motion.div>
  )

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {icon || defaultIcon}
      
      <motion.h3
        className="font-serif text-2xl text-primary-900 mt-4 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      {message && (
        <motion.p
          className="font-sans text-base text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

