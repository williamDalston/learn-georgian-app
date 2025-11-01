'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { hoverLift } from '@/lib/utils/animations'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
}

export default function GlassCard({
  children,
  className = '',
  hoverable = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? hoverLift : undefined}
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

