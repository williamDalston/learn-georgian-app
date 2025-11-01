'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { testimonials } from './testimonialsData'
import TestimonialCard from './TestimonialCard'
import { staggerContainer, staggerItem, getAnimationVariants } from '@/lib/utils/animations'

export default function TestimonialGrid() {
  return (
    <section className="section-padding bg-gradient-to-b from-neutral-100 to-white" aria-label="Testimonials">
      <Container>
        <AnimatedSection direction="up">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary-900 mb-3 sm:mb-4">
              What Our Students Are Saying
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-sans text-gray-700 max-w-2xl mx-auto">
              Real stories from people who have transformed their lives through this program
            </p>
          </div>
        </AnimatedSection>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-4 sm:px-0"
          variants={getAnimationVariants(staggerContainer)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={getAnimationVariants(staggerItem)}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
