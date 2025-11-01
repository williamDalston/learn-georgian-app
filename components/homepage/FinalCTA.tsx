import Container from '@/components/shared/Container'
import CTAButton from '@/components/shared/CTAButton'

export default function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-sans text-neutral-200 mb-8 leading-relaxed font-light max-w-2xl mx-auto">
            Join thousands who have discovered lasting inner freedom. Start your journey today with a risk-free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <CTAButton href="/subscribe" variant="primary" size="lg" className="sm:w-auto bg-accent hover:bg-accent-dark text-white border-2 border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              Start Your Free Trial
            </CTAButton>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-sans text-neutral-300">
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
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

