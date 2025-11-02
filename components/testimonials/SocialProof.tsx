'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { testimonials } from './testimonialsData'
import { staggerContainer, staggerItem, fadeInUp, getAnimationVariants } from '@/lib/utils/animations'

export default function SocialProof() {
  // Calculate average rating
  const ratings = testimonials.filter((t) => t.rating).map((t) => t.rating!)
  const averageRatingNum = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 5.0
  const averageRating = averageRatingNum.toFixed(1)
  const fullStars = Math.floor(averageRatingNum)
  const hasHalfStar = averageRatingNum % 1 >= 0.5
  const totalReviews = testimonials.length

  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <Container className="relative z-10">
        <AnimatedSection direction="up">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              variants={getAnimationVariants({
                hidden: { opacity: 0, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                  }
                }
              })}
            >
              {/* Star Rating Display */}
              <div className="flex gap-1" role="img" aria-label={`${averageRating} out of 5 stars`}>
                {[...Array(fullStars)].map((_, i) => (
                  <motion.svg
                    key={`full-${i}`}
                    className="w-8 h-8 text-accent drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 10,
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
                {hasHalfStar && (
                  <div className="relative w-8 h-8">
                    <svg
                      className="w-8 h-8 text-neutral-600 absolute"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      className="w-8 h-8 text-accent absolute overflow-hidden"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ clipPath: 'inset(0 50% 0 0)' }}
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
                {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                  <svg
                    key={`empty-${i}`}
                    className="w-8 h-8 text-neutral-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
            </div>
            <motion.span 
              className="text-4xl font-serif font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 10,
                delay: 0.6,
              }}
            >
              {averageRating}
            </motion.span>
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl font-sans text-neutral-200 mb-2"
            variants={getAnimationVariants(fadeInUp)}
            transition={{ delay: 0.3 }}
          >
            Rated {averageRating} out of 5 by {totalReviews}+ participants
          </motion.p>
          <motion.p 
            className="text-base md:text-lg font-sans text-neutral-300"
            variants={getAnimationVariants(fadeInUp)}
            transition={{ delay: 0.4 }}
          >
            Join thousands who are mastering the Georgian language
          </motion.p>
          <motion.p 
            className="text-sm md:text-base font-sans text-neutral-400 mt-4"
            variants={getAnimationVariants(fadeInUp)}
            transition={{ delay: 0.5 }}
          >
            Trusted by language learners, travelers, students, and professionals worldwide
          </motion.p>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
