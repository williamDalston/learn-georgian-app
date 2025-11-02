'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'
import GradientText from '@/components/shared/GradientText'
import LiveStudentCount from './LiveStudentCount'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { fadeInUp, textReveal, getAnimationVariants } from '@/lib/utils/animations'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section 
      ref={sectionRef}
      className="min-h-[85vh] flex items-center bg-gradient-animated pt-16 pb-24 sm:pt-20 sm:pb-16 lg:pb-16 relative overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Large gradient orbs with animation */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-40 h-40 bg-secondary-200/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <Container maxWidth="7xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Text Content */}
          <div 
            className={`text-center lg:text-left space-y-5 sm:space-y-6 lg:space-y-8 transition-all duration-1000 ${
              isVisible || prefersReducedMotion 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[1.1] tracking-tight px-4 sm:px-0"
              initial="hidden"
              animate={isVisible || prefersReducedMotion ? "visible" : "hidden"}
              variants={getAnimationVariants(textReveal)}
            >
              <motion.span 
                className="inline-block"
                variants={getAnimationVariants(fadeInUp)}
                transition={{ delay: 0.1 }}
              >
                <GradientText gradient="primary" className="font-bold">
                  Learn Georgian.
                </GradientText>
              </motion.span>{' '}
              <motion.span 
                className="inline-block mt-2 sm:mt-3"
                variants={getAnimationVariants(fadeInUp)}
                transition={{ delay: 0.3 }}
              >
                <GradientText gradient="accent" className="font-bold">
                  Speak with Confidence.
                </GradientText>
              </motion.span>
            </motion.h1>
            
            <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-2xl font-sans text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0 font-light transition-all duration-700 delay-300 ${
              isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Master Georgian from beginner to conversational level. An immersive, structured program that takes you step-by-step through real conversations, grammar, and cultural insights to help you speak Georgian with confidence.
            </h2>

            <div className={`space-y-4 transition-all duration-700 delay-500 ${
              isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2 sm:pt-4 px-4 sm:px-0">
                <CTAButton href="/dashboard/courses" variant="primary" size="lg" className="sm:w-auto group/cta">
                  <span className="flex items-center gap-2">
                    Start Learning Free
                    <svg 
                      className="w-5 h-5 transform group-hover/cta:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </CTAButton>
              </div>
              <motion.div 
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm sm:text-base font-sans text-gray-600 px-4 sm:px-0"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={isVisible || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {[
                  { text: '100% Free Forever', icon: 'check' },
                  { text: 'No Credit Card Required', icon: 'check' },
                  { text: 'Self-Paced Learning', icon: 'check' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 group/trust"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                    animate={isVisible || prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg 
                        className="w-5 h-5 text-accent flex-shrink-0 group-hover/trust:text-accent-dark transition-colors" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    <span className="group-hover/trust:text-primary-900 transition-colors">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Live Student Count */}
              <motion.div
                className="flex justify-center lg:justify-start px-4 sm:px-0 pt-2"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={isVisible || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <LiveStudentCount baseCount={1247} />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Hero Image/Video Placeholder */}
          <motion.div 
            className="relative w-full aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-200 flex items-center justify-center mx-4 sm:mx-0 group"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 40, scale: 0.95 }}
            animate={isVisible || prefersReducedMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          >
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary-200/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              aria-hidden="true"
            />
            
            {/* Animated mesh gradient pattern */}
            <div className="absolute inset-0 opacity-30" aria-hidden="true">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-300/20 via-transparent to-accent/10"></div>
              <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-secondary-300/20 via-transparent to-primary-300/10"></div>
            </div>
            
            {/* Floating geometric shapes */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute top-10 right-10 w-20 h-20 border-2 border-accent/20 rounded-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute bottom-10 left-10 w-16 h-16 border-2 border-primary-300/30 rounded-full"
                  animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  aria-hidden="true"
                />
              </>
            )}
            
            {/* Placeholder for hero image/video */}
            <div className="text-center p-4 sm:p-8 text-primary-900 relative z-10">
              <motion.div 
                className="relative inline-block"
                initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                animate={isVisible || prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {/* Pulsing glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-3xl"
                  animate={prefersReducedMotion ? {} : {
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  aria-hidden="true"
                />
                
                {/* Icon container with enhanced hover effect */}
                <motion.div 
                  className="relative"
                  whileHover={prefersReducedMotion ? {} : { 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 text-primary-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {/* Play button overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    aria-hidden="true"
                  >
                    <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-accent/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.p 
                className="font-serif text-sm sm:text-base text-primary-900 mb-2 font-medium"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={isVisible || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Begin Your Journey
              </motion.p>
              <motion.p 
                className="font-sans text-xs sm:text-sm text-primary-700"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={isVisible || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Start speaking Georgian today
              </motion.p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
