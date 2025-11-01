'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, getAnimationVariants } from '@/lib/utils/animations'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

const directionVariants = {
  up: fadeInUp,
  down: fadeInUp, // Can be customized
  left: fadeInUp, // Can be customized
  right: fadeInUp, // Can be customized
  fade: fadeInUp, // Can be customized
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const variants = getAnimationVariants(directionVariants[direction])

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

