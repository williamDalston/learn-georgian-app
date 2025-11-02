'use client'

import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { staggerContainer, staggerItem, getAnimationVariants } from '@/lib/utils/animations'

interface PricingPlan {
  name: string
  priceMonthly: number
  priceAnnual: number
  description: string
  features: string[]
  popular?: boolean
}

const plans: PricingPlan[] = [
  {
    name: 'Free Course',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Complete Georgian language course - 100% free',
    popular: true,
    features: [
      'Full access to all 33+ video lessons (A1-C1)',
      'Interactive exercises and quizzes',
      'Pronunciation guides and audio content',
      'Grammar explanations and cultural insights',
      'Progress tracking and certificates',
      'Self-paced learning - start anytime',
    ],
  },
]

export default function PricingTable() {

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-neutral-100 to-white">
      <Container>
        <AnimatedSection direction="up">
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4">
              Start Learning Georgian Today
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto">
              Complete course from beginner to conversational - 100% free, no credit card required.
            </p>
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 max-w-2xl mx-auto px-4 sm:px-0 mt-8 sm:mt-10"
          variants={getAnimationVariants(staggerContainer)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={getAnimationVariants(staggerItem)}
              className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 relative backdrop-blur-sm border-2 transition-all ${
                plan.popular
                  ? 'border-accent bg-gradient-to-br from-white to-accent/5'
                  : 'border-gray-200 hover:border-accent/40'
              }`}
              whileHover={{ 
                y: -8,
                boxShadow: plan.popular
                  ? "0 25px 50px rgba(255,125,50,0.15)"
                  : "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white text-sm font-sans font-semibold px-4 py-1 rounded-full">
                    Start Here
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl sm:text-2xl font-serif text-primary-900 mb-2">{plan.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 font-sans mb-4 sm:mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif text-primary-900">
                    Free
                  </span>
                </div>
                <p className="text-sm sm:text-base font-sans text-gray-600 mt-2">
                  Complete access to all course materials
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-2 sm:mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-sans text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <CTAButton
                href="/subscribe"
                variant="primary"
                fullWidth
                size="lg"
              >
                Start Learning Free
              </CTAButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Free Course Info */}
        <div className="text-center mt-6 sm:mt-8 px-4 sm:px-0 space-y-2">
          <p className="text-sm sm:text-base font-sans text-gray-700">
            <span className="font-semibold">No credit card required</span>
            <span className="hidden sm:inline"> • </span>
            <br className="sm:hidden" />
            <span className="sm:inline">Start learning immediately</span>
          </p>
          <p className="text-xs sm:text-sm font-sans text-gray-600 max-w-2xl mx-auto">
            Create a free account to track your progress and unlock all course materials instantly.
          </p>
        </div>
      </Container>
    </section>
  )
}
