'use client'

import { useEffect, useRef, useState } from 'react'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

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
      className="min-h-[85vh] flex items-center bg-gradient-to-b from-neutral-50 via-white to-white pt-16 pb-24 sm:pt-20 sm:pb-16 lg:pb-16 relative overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"></div>
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-primary-900 leading-[1.1] tracking-tight px-4 sm:px-0">
              <span className={`inline-block transition-all duration-700 delay-100 ${
                isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Stop Reacting.
              </span>{' '}
              <span className={`inline-block mt-2 sm:mt-3 transition-all duration-700 delay-200 ${
                isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Start Living.
              </span>
            </h1>
            
            <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-2xl font-sans text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0 font-light transition-all duration-700 delay-300 ${
              isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              The subscription program for inner freedom. A practical, step-by-step path from a trusted guide to help you move beyond temporary calm and build a life of lasting clarity and purpose.
            </h2>

            <div className={`space-y-4 transition-all duration-700 delay-500 ${
              isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2 sm:pt-4 px-4 sm:px-0">
                <CTAButton href="/subscribe" variant="primary" size="lg" className="sm:w-auto group/cta">
                  <span className="flex items-center gap-2">
                    Start Your Free Trial
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
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm sm:text-base font-sans text-gray-600 px-4 sm:px-0">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Self-Paced Learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image/Video Placeholder */}
          <div 
            className={`relative w-full aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-200 flex items-center justify-center mx-4 sm:mx-0 group transition-all duration-1000 delay-300 ${
              isVisible || prefersReducedMotion 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-8 scale-95'
            }`}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
            
            {/* Placeholder for hero image/video */}
            <div className="text-center p-4 sm:p-8 text-primary-900 relative z-10">
              <div className="relative inline-block">
                {/* Pulsing glow effect */}
                <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-3xl animate-pulse-slow" aria-hidden="true"></div>
                
                {/* Icon container with hover effect */}
                <div className="relative transform group-hover:scale-110 transition-transform duration-500 will-change-transform">
                  <svg
                    className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 opacity-60"
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
                </div>
              </div>
              <p className="font-serif text-sm sm:text-base opacity-90 mb-2 font-medium">Begin Your Journey</p>
              <p className="font-sans text-xs sm:text-sm opacity-75">Transform your life with inner freedom</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
