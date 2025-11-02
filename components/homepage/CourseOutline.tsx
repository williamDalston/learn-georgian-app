'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { staggerContainer, staggerItem, getAnimationVariants } from '@/lib/utils/animations'
import { courseStructure } from '@/lib/data/courseStructure'

interface Module {
  level: string
  name: string
  description: string
  estimatedHours: { min: number; max: number }
  lessonCount: number
  focus: string
}

// Transform course structure into display modules
const modules: Module[] = courseStructure.map((level) => ({
  level: level.code,
  name: level.name,
  description: level.description,
  estimatedHours: level.estimatedHours,
  lessonCount: level.lessons.length,
  focus: level.focus,
}))

export default function CourseOutline() {
  return (
    <section id="course-outline" className="section-padding bg-gradient-to-b from-neutral-50 to-neutral-100">
      <Container>
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
              Your Path to Georgian Fluency
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              A structured, self-paced program that takes you from complete beginner to conversational fluency
            </p>
          </div>
        </AnimatedSection>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto"
          variants={getAnimationVariants(staggerContainer)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {modules.map((module, index) => (
            <motion.div
              key={index}
              variants={getAnimationVariants(staggerItem)}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 sm:p-6 border border-neutral-100 hover:border-accent/40 relative overflow-hidden group"
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Decorative gradient on hover */}
              <motion.div 
                className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12 blur-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center shadow-lg ring-2 ring-accent/20"
                    whileHover={{ 
                      scale: 1.15,
                      rotate: 5,
                      boxShadow: "0 10px 25px rgba(255,125,50,0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white font-sans font-bold text-base sm:text-lg">
                      {module.level}
                    </span>
                  </motion.div>
                  <div>
                    <span className="text-xs sm:text-sm font-sans font-semibold text-accent uppercase tracking-wide">
                      {module.name}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {module.lessonCount} lessons • {module.estimatedHours.min}-{module.estimatedHours.max} hrs
                    </p>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-serif text-primary-900 mb-2 sm:mb-3 leading-tight font-semibold group-hover:text-primary-800 transition-colors">
                  Level {module.level}: {module.focus}
                </h3>
                <p className="text-sm sm:text-base font-sans text-gray-700 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10 sm:mt-12 px-4 sm:px-0">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-neutral-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-base sm:text-lg font-sans text-gray-700">
                <span className="font-semibold text-primary-900">Self-paced learning:</span> Progress at your own rhythm. 
                All content is available immediately upon enrollment.
              </p>
            </div>
            <p className="text-sm sm:text-base font-sans text-gray-600">
              Plus bonus cultural content, pronunciation guides, and new lessons added regularly.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
