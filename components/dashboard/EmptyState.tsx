'use client'

import { motion } from 'framer-motion'
import EmptyState from '@/components/shared/EmptyState'
import CTAButton from '@/components/shared/CTAButton'

interface DashboardEmptyStateProps {
  onStartLesson?: () => void
  onTakeTour?: () => void
}

export default function DashboardEmptyState({
  onStartLesson,
  onTakeTour,
}: DashboardEmptyStateProps) {
  const welcomeIcon = (
    <motion.div
      className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center mb-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      }}
    >
      <span className="text-5xl">🇬🇪</span>
    </motion.div>
  )

  return (
    <EmptyState
      icon={welcomeIcon}
      title="Welcome to Your Learning Journey!"
      message="You're ready to begin your adventure into the Georgian language. Start your first lesson to unlock amazing features and track your progress."
      action={
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <CTAButton
            onClick={onStartLesson}
            variant="primary"
            size="lg"
          >
            Start Your First Lesson →
          </CTAButton>
          {onTakeTour && (
            <CTAButton
              onClick={onTakeTour}
              variant="secondary"
              size="lg"
            >
              Take a Quick Tour
            </CTAButton>
          )}
        </div>
      }
      className="py-16"
    />
  )
}

