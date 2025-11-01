'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'
import AnimatedSection from '@/components/shared/AnimatedSection'
import BillingToggle from './BillingToggle'
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
    name: 'Monthly',
    priceMonthly: 29,
    priceAnnual: 29,
    description: 'Perfect for trying out the program',
    features: [
      'Full access to all video lessons',
      'Step-by-step exercises and practices',
      'Guided meditations and audio content',
      'Theory lectures and insights',
      'Email support',
      'Cancel anytime',
    ],
  },
  {
    name: 'Annual',
    priceMonthly: 19,
    priceAnnual: 199,
    description: 'Best value for committed seekers',
    popular: true,
    features: [
      'Everything in Monthly plan',
      'Save $149 per year (40% off)',
      'Priority email support',
      'Exclusive bonus content',
      'Early access to new materials',
      'Cancel anytime',
    ],
  },
]

export default function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const getDisplayPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual
  }

  const getDisplayPeriod = () => {
    return billingCycle === 'monthly' ? 'month' : 'year'
  }

  const getSavings = () => {
    if (billingCycle === 'annual') {
      return 29 * 12 - 199 // Calculate savings
    }
    return 0
  }

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-neutral-100 to-white">
      <Container>
        <AnimatedSection direction="up">
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4">
              Choose Your Path to Inner Freedom
            </h2>
            <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto">
              Simple, transparent pricing. Start your free trial today.
            </p>
          </div>
        </AnimatedSection>

        {/* Billing Toggle */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="px-4 sm:px-0">
            <BillingToggle billingCycle={billingCycle} onToggle={setBillingCycle} />
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0 mt-8 sm:mt-10"
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
                plan.popular && billingCycle === 'annual'
                  ? 'border-accent bg-gradient-to-br from-white to-accent/5'
                  : 'border-gray-200 hover:border-accent/40'
              }`}
              whileHover={{ 
                y: -8,
                boxShadow: plan.popular && billingCycle === 'annual' 
                  ? "0 25px 50px rgba(255,125,50,0.15)"
                  : "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Popular Badge */}
              {plan.popular && billingCycle === 'annual' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white text-sm font-sans font-semibold px-4 py-1 rounded-full">
                    Most Popular
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
                    ${getDisplayPrice(plan)}
                  </span>
                  <span className="text-base sm:text-lg font-sans text-gray-600">
                    /{getDisplayPeriod()}
                  </span>
                </div>
                {billingCycle === 'annual' && plan.name === 'Annual' && (
                  <p className="text-xs sm:text-sm font-sans text-accent font-semibold mt-2">
                    Save ${getSavings()} per year
                  </p>
                )}
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
                variant={plan.popular && billingCycle === 'annual' ? 'primary' : 'secondary'}
                fullWidth
                size="lg"
              >
                Start Your Free Trial
              </CTAButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee Text */}
        <div className="text-center mt-6 sm:mt-8 px-4 sm:px-0 space-y-2">
          <p className="text-sm sm:text-base font-sans text-gray-700">
            <span className="font-semibold">30-Day Money-Back Guarantee</span>
            <span className="hidden sm:inline"> • </span>
            <br className="sm:hidden" />
            <span className="sm:inline">Cancel anytime</span>
          </p>
          <p className="text-xs sm:text-sm font-sans text-gray-600 max-w-2xl mx-auto">
            Try risk-free. If you're not completely satisfied, we'll refund your payment within 30 days, no questions asked.
          </p>
        </div>
      </Container>
    </section>
  )
}
