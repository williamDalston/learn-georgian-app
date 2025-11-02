'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'
import AnimatedSection from '@/components/shared/AnimatedSection'
import GradientText from '@/components/shared/GradientText'
import { fadeInUp, getAnimationVariants } from '@/lib/utils/animations'

export default function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-0">
          <AnimatedSection direction="up">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight"
              variants={getAnimationVariants(fadeInUp)}
            >
              Ready to <GradientText gradient="accent" className="text-white bg-gradient-to-r from-accent via-accent-dark to-accent bg-clip-text text-transparent">Speak Georgian</GradientText> with Confidence?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl font-sans text-neutral-200 mb-8 leading-relaxed font-light max-w-2xl mx-auto"
              variants={getAnimationVariants(fadeInUp)}
              transition={{ delay: 0.2 }}
            >
              Join thousands who are mastering Georgian. Start your journey from beginner to conversational fluency today with a risk-free trial.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              variants={getAnimationVariants(fadeInUp)}
              transition={{ delay: 0.3 }}
            >
              <CTAButton href="/subscribe" variant="primary" size="lg" className="sm:w-auto bg-accent hover:bg-accent-dark text-white border-2 border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl">
                Start Your Free Trial
              </CTAButton>
            </motion.div>
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 text-sm font-sans text-neutral-300"
              variants={getAnimationVariants(fadeInUp)}
              transition={{ delay: 0.4 }}
            >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime Access</span>
            </motion.div>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  )
}

