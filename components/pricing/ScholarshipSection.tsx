'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import Link from 'next/link'
import { fadeInUp, getAnimationVariants } from '@/lib/utils/animations'

export default function ScholarshipSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <AnimatedSection direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 rounded-xl p-8 md:p-12 border-l-4 border-accent shadow-lg backdrop-blur-sm"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ 
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                scale: 1.01,
              }}
              transition={{ duration: 0.3 }}
            >
            <h3 className="text-2xl md:text-3xl font-serif text-primary-900 mb-4">
              Our Mission
            </h3>
            <p className="text-base md:text-lg font-sans text-gray-700 leading-relaxed mb-6">
              We believe everyone deserves access to quality language education, regardless of their financial situation. 
              Our mission is to make Georgian language learning accessible to all who are committed to learning.
            </p>
            <p className="text-base md:text-lg font-sans text-gray-700 leading-relaxed mb-4">
              If you genuinely cannot afford a subscription, please{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/scholarship"
                  className="text-accent hover:text-accent-dark underline font-semibold transition-colors inline-block"
                >
                  request a scholarship
                </Link>
              </motion.span>
              . We're committed to supporting your journey regardless of financial circumstances.
            </p>
            <p className="text-sm md:text-base font-sans text-gray-600 italic">
              "The best time to start your journey was yesterday. The second best time is now."
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  )
}
