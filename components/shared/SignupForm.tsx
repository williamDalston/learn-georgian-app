'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTotalLessonCount } from '@/lib/data/courseStructure'
import logger from '@/lib/utils/logger'
import CTAButton from '@/components/shared/CTAButton'
import { MobileFormInput } from '@/components/shared/MobileFormField'

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // In production, this would create a user account via API
      // For now, we'll just save to localStorage and redirect
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Save user info (in production, this would be handled by backend)
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('isAuthenticated', 'true')
        // Initialize user progress
        localStorage.setItem('userProgress', JSON.stringify({
          daysPracticed: 0,
          totalTime: 0,
          currentStreak: 0,
          totalLessons: getTotalLessonCount(), // Dynamically calculated from course structure
          completedLessons: 0,
        }))
        localStorage.setItem('completedLessons', JSON.stringify([]))
      }

      // Redirect to dashboard to start the course
      router.push('/dashboard')
    } catch (error) {
      logger.error('Signup error', {
        context: 'SignupForm',
        error: error instanceof Error ? error : new Error(String(error)),
      })
      setIsSubmitting(false)
      setErrors({ submit: 'There was an error creating your account. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-serif text-primary-900 mb-6 text-center">
          Create Your Free Account
        </h2>
        <p className="text-center text-gray-600 mb-6 font-sans">
          Start learning Georgian right away - no payment required!
        </p>

        <div className="space-y-4 sm:space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

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

          {/* CTA Button */}
          <CTAButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Start Learning Free'}
          </CTAButton>

          {/* Free Course Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mt-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-sans font-semibold text-gray-900 mb-1">
                  Completely Free Forever
                </p>
                <p className="text-xs font-sans text-gray-700 leading-relaxed">
                  All course materials are 100% free. No credit card required, no hidden fees, no subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

