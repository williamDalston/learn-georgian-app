'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import Image from 'next/image'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { SpotlightTestimonial as SpotlightTestimonialType } from './types'
import { spotlightTestimonial } from './testimonialsData'
import { slideInLeft, slideInRight, getAnimationVariants } from '@/lib/utils/animations'

export default function SpotlightTestimonial({
  testimonial = spotlightTestimonial,
}: {
  testimonial?: SpotlightTestimonialType
}) {
  return (
    <section className="section-padding bg-gradient-to-b from-neutral-50 via-white to-neutral-50 relative overflow-hidden" aria-label="Featured testimonial">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left Column - Image or Video */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={getAnimationVariants(slideInLeft)}
          >
            <motion.div 
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-200 to-secondary-200 group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Decorative overlay on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {testimonial.videoUrl ? (
                <video
                  src={testimonial.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  aria-label={`Video testimonial from ${testimonial.author}`}
                  preload="metadata"
                />
              ) : testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt={`${testimonial.author} sharing their transformation story`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center p-8 text-primary-900 relative z-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-secondary-100/50" />
                  <div className="relative z-10">
                    <svg
                      className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="font-sans text-sm sm:text-base font-medium opacity-90">Watch {testimonial.author.split(' ')[0]}'s Story</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column - Full Story */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={getAnimationVariants(slideInRight)}
          >
            <div className="space-y-6">
              {/* Header with Quote Icon and Rating */}
              <div className="flex items-start gap-4">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-primary-200 flex-shrink-0 mt-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-0.5 ml-auto" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 transition-colors duration-200 ${
                          i < testimonial.rating! ? 'text-accent' : 'text-gray-300'
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
              </div>

              {/* Quote */}
              <blockquote cite={testimonial.author} className="not-italic">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-primary-900 leading-tight mb-6">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Full Story */}
              <div className="prose prose-lg max-w-none">
                <p className="text-base sm:text-lg md:text-xl font-sans text-gray-700 leading-relaxed whitespace-pre-line">
                  {testimonial.fullStory}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 ring-2 ring-primary-100">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo}
                      alt={`${testimonial.author} profile picture`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 56px, 64px"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300 text-primary-900 font-sans font-semibold text-lg sm:text-xl">
                      {testimonial.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-sans font-semibold text-base sm:text-lg text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="font-sans text-sm sm:text-base text-gray-600">
                    {testimonial.identifier}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
