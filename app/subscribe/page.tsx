import SignupForm from '@/components/shared/SignupForm'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Distraction-free layout - no header/footer */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-primary-900 mb-2">
              Start Learning Georgian Today
            </h1>
            <p className="text-lg font-sans text-gray-700">
              Create your free account to begin your journey to Georgian fluency
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Footer Links */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-sans text-gray-600 mb-4">
              <a href="/terms" className="hover:text-primary-900 underline transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-400">•</span>
              <a href="/privacy" className="hover:text-primary-900 underline transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-400">•</span>
              <a href="/contact" className="hover:text-primary-900 underline transition-colors">
                Contact Support
              </a>
            </div>
            <p className="text-xs font-sans text-gray-500">
              Need help? Our support team is here for you. Contact us at{' '}
              <a href="mailto:support@learntogeorgian.com" className="text-accent hover:text-accent-dark underline">
                support@learntogeorgian.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
