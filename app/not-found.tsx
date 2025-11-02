import Link from 'next/link'
import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Container>
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-primary-900 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-serif text-primary-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg font-sans text-gray-700 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on your path to learning Georgian.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/" variant="primary">
              Return Home
            </CTAButton>
            <CTAButton href="/subscribe" variant="secondary">
              Start Your Journey
            </CTAButton>
          </div>
        </div>
      </Container>
    </div>
  )
}

