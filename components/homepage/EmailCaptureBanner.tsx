'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/shared/Container'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

export default function EmailCaptureBanner() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setIsSubmitted(true)
      setEmail('')
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't show if already submitted (optional - remove this if you want it always visible)
  if (isSubmitted) {
    return null
  }

  return (
    <section 
      className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-700 text-white py-4 sm:py-5 shadow-lg relative overflow-hidden"
      aria-label="Email capture for updates"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <Container maxWidth="7xl" className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm sm:text-base font-sans font-medium">
              🎓 <span className="hidden sm:inline">We're launching the full version soon! </span>
              Get notified when audio features are ready
            </p>
          </div>

          {/* Email Form */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:min-w-[320px]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm sm:text-base"
              required
              aria-label="Email address"
              disabled={isSubmitting}
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-white text-primary-700 rounded-lg font-sans font-semibold hover:bg-white/90 active:scale-95 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Notify Me'}
            </motion.button>
          </form>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center sm:text-left"
            >
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center sm:text-left"
            >
              <p className="text-sm font-medium text-green-200">
                ✅ Thanks! We'll email you when the full version is ready.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}

