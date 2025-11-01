'use client'

import { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: 'primary' | 'accent' | 'secondary'
}

const gradients = {
  primary: 'from-primary-700 via-primary-600 to-primary-900',
  accent: 'from-accent via-accent-dark to-accent',
  secondary: 'from-secondary-700 via-secondary-600 to-secondary-900',
}

export default function GradientText({
  children,
  className = '',
  gradient = 'primary',
}: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r ${gradients[gradient]} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  )
}

