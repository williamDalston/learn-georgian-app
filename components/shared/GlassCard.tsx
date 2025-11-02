'use client'

import { ReactNode } from 'react'
import { motion, type TargetAndTransition } from 'framer-motion'
import { hoverLift } from '@/lib/utils/animations'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  hoverable = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? (hoverLift as TargetAndTransition) : undefined}
      onClick={onClick}
      className={`
        backdrop-blur-lg bg-white/80 
        border border-white/20 
        rounded-xl shadow-xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

