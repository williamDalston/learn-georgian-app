'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { getAnimationVariants } from '@/lib/utils/animations'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

interface TimeCalculatorProps {
  /** Total lessons in the course */
  totalLessons?: number
  /** Average minutes per lesson */
  avgMinutesPerLesson?: number
}

const FREQUENCY_OPTIONS = ['Daily', '3x per week', '2x per week', 'Once per week'] as const
const TIME_OPTIONS = [15, 30, 45, 60, 90] as const

/**
 * Time Investment Calculator Component
 * 
 * Interactive calculator that helps users estimate how long it will take
 * them to complete the course based on their available time and frequency.
 */
export default function TimeCalculator({
  totalLessons = 33,
  avgMinutesPerLesson = 50,
}: TimeCalculatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [minutesPerSession, setMinutesPerSession] = useState(30)
  const [frequency, setFrequency] = useState<typeof FREQUENCY_OPTIONS[number]>('3x per week')

  // Calculate time estimates
  const totalMinutes = totalLessons * avgMinutesPerLesson
  const sessionsPerWeek = frequency === 'Daily' ? 7 : frequency === '3x per week' ? 3 : frequency === '2x per week' ? 2 : 1
  const minutesPerWeek = sessionsPerWeek * minutesPerSession
  const weeksNeeded = Math.ceil(totalMinutes / minutesPerWeek)
  const monthsNeeded = Math.ceil(weeksNeeded / 4.33) // Average weeks per month
  const totalHours = Math.ceil(totalMinutes / 60)

  const formatDuration = (weeks: number) => {
    if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
    if (weeks < 13) return `${Math.floor(weeks / 4)} ${Math.floor(weeks / 4) === 1 ? 'month' : 'months'}`
    const years = Math.floor(weeks / 52)
    const remainingMonths = Math.floor((weeks % 52) / 4.33)
    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
    return remainingMonths > 0
      ? `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
      : `${years} ${years === 1 ? 'year' : 'years'}`
  }

  return (
    <section className="section-padding bg-gradient-to-br from-white via-primary-50 to-white">
      <Container maxWidth="4xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
              Your Learning Journey
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Calculate how long it will take to complete the course based on your schedule
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-neutral-200"
          variants={getAnimationVariants({
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4 },
            },
          })}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              {/* Time per session */}
              <div>
                <label className="block text-sm font-sans font-semibold text-gray-900 mb-3">
                  How much time per session?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TIME_OPTIONS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setMinutesPerSession(time)}
                      className={`px-4 py-3 rounded-lg font-sans font-medium transition-all duration-300 ${
                        minutesPerSession === time
                          ? 'bg-accent text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-sans font-semibold text-gray-900 mb-3">
                  How often will you practice?
                </label>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`w-full px-4 py-3 rounded-lg font-sans font-medium transition-all duration-300 ${
                        frequency === freq
                          ? 'bg-accent text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-accent/5 to-accent-dark/5 rounded-xl p-6 border border-accent/20">
                <div className="text-center mb-4">
                  <p className="text-sm font-sans font-medium text-gray-700 mb-2">
                    Estimated completion time
                  </p>
                  <motion.p
                    className="text-4xl sm:text-5xl font-serif font-bold text-primary-900"
                    key={weeksNeeded}
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatDuration(weeksNeeded)}
                  </motion.p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-accent/20">
                  <div className="text-center">
                    <p className="text-xs font-sans text-gray-600 mb-1">
                      Total content
                    </p>
                    <p className="text-lg font-sans font-semibold text-gray-900">
                      {totalHours}h
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-sans text-gray-600 mb-1">
                      Your pace
                    </p>
                    <p className="text-lg font-sans font-semibold text-gray-900">
                      {minutesPerWeek}m/week
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar visualization */}
              <div>
                <p className="text-sm font-sans font-medium text-gray-900 mb-3">
                  Your weekly progress
                </p>
                <div className="space-y-3">
                  {[...Array(Math.min(4, Math.ceil(weeksNeeded / 4)))].map((_, week) => (
                    <div key={week} className="flex items-center gap-3">
                      <div className="w-16 flex-shrink-0">
                        <p className="text-xs font-sans text-gray-600">
                          Week {week + 1}
                        </p>
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent to-accent-dark"
                          initial={prefersReducedMotion ? {} : { width: 0 }}
                          animate={{ width: `${Math.min(100, (minutesPerWeek / totalMinutes) * 100 * 4)}%` }}
                          transition={{ duration: 0.6, delay: week * 0.1 }}
                        />
                      </div>
                      <div className="w-12 flex-shrink-0 text-right">
                        <p className="text-xs font-sans text-gray-600">
                          {Math.min(100, Math.round((minutesPerWeek / totalMinutes) * 100 * 4))}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational message */}
              <div className="bg-primary-900 rounded-lg p-4 text-center">
                <p className="text-sm font-sans text-white">
                  💪 You've got this! Consistency beats perfection.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}


