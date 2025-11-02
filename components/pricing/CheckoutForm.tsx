'use client'

import { useState } from 'react'
import logger from '@/lib/utils/logger'
import CTAButton from '@/components/shared/CTAButton'
import TrustBadges from './TrustBadges'
import { MobileFormInput } from '@/components/shared/MobileFormField'

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'annual', // default to annual
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create Stripe checkout session via API
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: formData.plan,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout or dashboard
      if (data.url) {
        window.location.href = data.url
      } else {
        logger.debug('Checkout session created', {
          context: 'CheckoutForm',
          data: { sessionId: data.sessionId },
        })
        setIsSubmitting(false)
        // TODO: Handle successful session creation (e.g., show success message)
      }
    } catch (error) {
      logger.error('Checkout error', {
        context: 'CheckoutForm',
        error: error instanceof Error ? error : new Error(String(error)),
      })
      setIsSubmitting(false)
      setErrors({
        submit: error instanceof Error
          ? error.message
          : 'There was an error processing your payment. Please try again.',
      })
    }
  }

  const annualPrice = 199
  const monthlyPrice = 29
  const displayPrice = formData.plan === 'annual' ? annualPrice : monthlyPrice

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
      {/* Left Column: Account & Payment */}
      <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-serif text-primary-900 mb-4 sm:mb-6">Account & Payment</h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Email */}
          <MobileFormInput
            type="email"
            id="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />

          {/* Password */}
          <MobileFormInput
            type="password"
            id="password"
            name="password"
            label="Create Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Minimum 8 characters"
            required
            autoComplete="new-password"
            helperText="Must be at least 8 characters long"
          />

          {/* Confirm Password */}
          <MobileFormInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
          />

          {/* Payment Details */}
          <div>
            <label className="block text-sm font-sans font-semibold text-gray-700 mb-2">
              Payment Details
            </label>
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="text-sm font-sans text-gray-700">Secure payment processing</span>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs font-sans text-gray-600 text-center">
                  Your payment information will be securely processed by Stripe. We never store your card details.
                </p>
              </div>
              {/* Stripe Elements will be mounted here via @stripe/react-stripe-js */}
              <div id="stripe-card-element" className="mt-4">
                {/* Stripe CardElement component will be rendered here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 md:p-8 h-fit sticky top-4">
        <h2 className="text-xl sm:text-2xl font-serif text-primary-900 mb-4 sm:mb-6">Order Summary</h2>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-sans font-semibold text-gray-700 mb-3">
              Select Plan
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-accent active:border-accent transition-colors touch-manipulation min-h-[44px]">
                <input
                  type="radio"
                  name="plan"
                  value="monthly"
                  checked={formData.plan === 'monthly'}
                  onChange={handleChange}
                  className="mr-3 text-accent focus:ring-accent w-5 h-5 touch-manipulation"
                />
                <div className="flex-grow">
                  <div className="font-sans font-semibold text-gray-900 text-base sm:text-lg">Monthly Plan</div>
                  <div className="font-sans text-sm sm:text-base text-gray-600">${monthlyPrice}/month</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-accent rounded-lg cursor-pointer bg-accent-50 active:bg-accent-100 transition-colors touch-manipulation min-h-[44px]">
                <input
                  type="radio"
                  name="plan"
                  value="annual"
                  checked={formData.plan === 'annual'}
                  onChange={handleChange}
                  className="mr-3 text-accent focus:ring-accent w-5 h-5 touch-manipulation"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-semibold text-gray-900 text-base sm:text-lg">Annual Plan</span>
                    <span className="bg-accent text-white text-xs font-sans font-semibold px-2 py-1 rounded">
                      Best Value
                    </span>
                  </div>
                  <div className="font-sans text-sm sm:text-base text-gray-600">
                    ${annualPrice}/year <span className="text-accent font-semibold">Save 40%</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between font-sans">
              <span className="text-gray-700">
                {formData.plan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
              </span>
              <span className="font-semibold text-gray-900">${displayPrice}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-gray-600">
              <span>30-Day Money-Back Guarantee</span>
              <span className="text-green-600">Included</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-sans text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-900">${displayPrice}</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <CTAButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete Purchase & Start Learning'}
          </CTAButton>

          {/* Guarantee Reiteration */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 sm:p-5 border border-green-200">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-sans font-semibold text-gray-900 mb-1">
                  30-Day Money-Back Guarantee
                </p>
                <p className="text-xs font-sans text-gray-700 leading-relaxed">
                  If you're not completely satisfied with the program, contact us within 30 days for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </div>
    </form>
  )
}
