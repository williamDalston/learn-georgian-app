'use client'

import { ReactNode } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showSpinner?: boolean
  children?: ReactNode
}

export default function LoadingState({
  message = "Loading...",
  size = 'md',
  className = '',
  showSpinner = true,
  children,
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {showSpinner && <LoadingSpinner size={size} className="mb-4" />}
      <p className="font-sans text-base text-gray-600 animate-pulse" role="status" aria-live="polite">
        {message}
      </p>
      {children}
    </div>
  )
}


