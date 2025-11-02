'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { getAnimationVariants } from '@/lib/utils/animations'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { testimonials } from '@/components/testimonials/testimonialsData'
import type { Testimonial } from '@/components/testimonials/types'

interface TestimonialCarouselProps {
  /** How often to auto-rotate to next testimonial (in milliseconds) */
  autoRotateInterval?: number
  /** Maximum number of testimonials to display */
  maxTestimonials?: number
  /** Show rating stars */
  showRating?: boolean
}

/**
 * Testimonial Carousel Component
 * 
 * Displays testimonials in a rotating carousel format with auto-rotation,
 * manual navigation, and pause on hover. Designed to build trust and social proof.
 */
export default function TestimonialCarousel({
  autoRotateInterval = 6000, // 6 seconds
  maxTestimonials = 6,
  showRating = true,
}: TestimonialCarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  // Limit testimonials
  const displayTestimonials = testimonials.slice(0, maxTestimonials)

  // Auto-rotate testimonials
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayTestimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, isHovered, prefersReducedMotion, displayTestimonials.length])

  const currentTestimonial = displayTestimonials[currentIndex]

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-neutral-50">
      <Container maxWidth="5xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
              Loved by Learners Worldwide
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              See what our community has to say about their learning journey
            </p>
          </div>
        </AnimatedSection>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          {/* Carousel Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-neutral-200 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Quote */}
                <svg
                  className="w-12 h-12 text-accent/20 mx-auto mb-6"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>

                <blockquote className="text-lg sm:text-xl md:text-2xl font-serif text-gray-900 mb-6 leading-relaxed px-4 sm:px-0">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Rating */}
                {showRating && currentTestimonial.rating && (
                  <div className="flex items-center justify-center gap-1 mb-4" role="img" aria-label={`${currentTestimonial.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating!
                            ? 'text-accent'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-serif font-bold text-lg">
                      {currentTestimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-sans font-semibold text-gray-900">
                      {currentTestimonial.author}
                    </p>
                    <p className="font-sans text-sm text-gray-600">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex items-center justify-center gap-2">
                  {displayTestimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToTestimonial(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-8 bg-accent'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === currentIndex ? 'true' : 'false'}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-accent hover:bg-accent/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-accent hover:bg-accent/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Next testimonial"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}


