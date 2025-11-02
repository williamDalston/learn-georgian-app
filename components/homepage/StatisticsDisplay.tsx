'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { staggerContainer, staggerItem, getAnimationVariants } from '@/lib/utils/animations'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

interface Stat {
  value: string
  label: string
  icon: React.ReactNode
  description?: string
}

interface StatisticsDisplayProps {
  /** Title for the statistics section */
  title?: string
  /** Subtitle/description for the statistics section */
  subtitle?: string
  /** Custom statistics to display */
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  {
    value: '2.3',
    label: 'Lessons per Week',
    description: 'Average completion rate',
    icon: (
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: '4.9',
    label: 'Star Rating',
    description: 'Based on 500+ reviews',
    icon: (
      <svg
        className="w-8 h-8 text-accent"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    value: '87%',
    label: 'Completion Rate',
    description: 'Students finish A1 level',
    icon: (
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: '6 months',
    label: 'To Conversational',
    description: 'With 3-5 hrs/week',
    icon: (
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
]

/**
 * Statistics Display Component
 * 
 * Shows key statistics and metrics to build trust and provide
 * social proof. Displays average completion rates, ratings, and
 * expected outcomes.
 */
export default function StatisticsDisplay({
  title = 'Proven Results',
  subtitle = 'Real outcomes from our community of learners',
  stats = defaultStats,
}: StatisticsDisplayProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="section-padding bg-gradient-to-br from-neutral-50 to-white">
      <Container maxWidth="6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
              {title}
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={getAnimationVariants(staggerContainer)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={getAnimationVariants(staggerItem)}
              className="bg-white rounded-xl shadow-md p-6 border border-neutral-100 hover:border-accent/40 relative overflow-hidden group transition-all duration-300"
              whileHover={prefersReducedMotion ? {} : {
                y: -8,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            >
              {/* Gradient decoration */}
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={prefersReducedMotion ? {} : {
                    rotate: [0, -5, 5, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.icon}
                </motion.div>

                {/* Value */}
                <motion.div
                  className="mb-2"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <p className="text-3xl sm:text-4xl font-serif text-primary-900 font-bold">
                    {stat.value}
                  </p>
                </motion.div>

                {/* Label */}
                <p className="text-base font-sans font-semibold text-gray-900 mb-1">
                  {stat.label}
                </p>

                {/* Description */}
                {stat.description && (
                  <p className="text-sm font-sans text-gray-600">
                    {stat.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}


