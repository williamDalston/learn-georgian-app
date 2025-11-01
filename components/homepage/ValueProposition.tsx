'use client'

import { useEffect, useRef, useState } from 'react'
import Container from '@/components/shared/Container'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: (
      <svg
        className="w-12 h-12 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: '10+ Hours of Transformative Video Lessons',
    description: 'Deep-dive video content that goes beyond surface-level tips. Each lesson builds on the last, creating a complete framework for understanding your mind and achieving lasting change.',
  },
  {
    icon: (
      <svg
        className="w-12 h-12 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    title: 'Step-by-Step Exercises for Deep Healing',
    description: 'Hands-on practices and downloadable worksheets that help you integrate insights into daily life. These aren\'t just concepts—they\'re actionable tools for real transformation.',
  },
  {
    icon: (
      <svg
        className="w-12 h-12 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: 'Guidance from an Experienced Teacher',
    description: 'Learn from someone who\'s walked the path themselves. Our teacher combines decades of experience, scientific rigor, and genuine empathy to guide you every step of the way.',
  },
  {
    icon: (
      <svg
        className="w-12 h-12 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: 'Private Community Support',
    description: 'Join a community of serious seekers committed to growth. Share insights, ask questions, and find support from others who understand your journey.',
  },
]

export default function ValueProposition() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleItems(new Set(benefits.map((_, i) => i)))
      return
    }

    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((element, index) => {
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
            observer.unobserve(element)
          }
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [prefersReducedMotion])

  return (
    <section 
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-neutral-50 relative"
      aria-labelledby="value-prop-heading"
    >
      <Container maxWidth="7xl">
        <div className="text-center mb-12 lg:mb-20">
          <h2 
            id="value-prop-heading"
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-primary-900 mb-4 lg:mb-6 leading-tight"
          >
            What You'll Get
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Everything you need to transform your relationship with yourself and build lasting inner freedom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-0">
          {benefits.map((benefit, index) => {
            const isVisible = visibleItems.has(index) || prefersReducedMotion
            
            return (
              <motion.div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                className="group flex flex-col sm:flex-row gap-5 sm:gap-6 p-6 sm:p-8 rounded-xl bg-white border border-neutral-200 hover:border-accent/40 touch-manipulation cursor-pointer focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:outline-none backdrop-blur-sm"
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate={isVisible ? "visible" : "hidden"}
                variants={getAnimationVariants({
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: prefersReducedMotion ? 0 : index * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  }
                })}
                whileHover={prefersReducedMotion ? {} : { 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
                role="article"
                aria-labelledby={`benefit-title-${index}`}
                tabIndex={0}
              >
                <div className="flex-shrink-0 flex items-start justify-center sm:justify-start">
                  <motion.div 
                    className="relative w-12 h-12 sm:w-14 sm:h-14 p-2 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/25 group-hover:to-accent/15 transition-all duration-500"
                    whileHover={prefersReducedMotion ? {} : { 
                      scale: 1.1, 
                      rotate: 3,
                      boxShadow: "0 10px 20px rgba(255,125,50,0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center h-full">
                      {benefit.icon}
                    </div>
                  </motion.div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 
                    id={`benefit-title-${index}`}
                    className="text-xl sm:text-2xl lg:text-3xl font-serif text-primary-900 mb-3 sm:mb-4 leading-tight group-hover:text-accent transition-colors duration-300"
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-base sm:text-lg font-sans text-gray-700 leading-relaxed font-light">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
