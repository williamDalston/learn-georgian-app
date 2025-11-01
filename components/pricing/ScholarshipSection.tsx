import Container from '@/components/shared/Container'
import Link from 'next/link'

export default function ScholarshipSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-neutral-100 rounded-lg p-8 md:p-12 border-l-4 border-accent">
            <h3 className="text-2xl md:text-3xl font-serif text-primary-900 mb-4">
              Our Mission
            </h3>
            <p className="text-base md:text-lg font-sans text-gray-700 leading-relaxed mb-6">
              We believe everyone deserves access to these transformative tools, regardless of their financial situation. 
              Our mission is to make inner freedom accessible to all who seek it.
            </p>
            <p className="text-base md:text-lg font-sans text-gray-700 leading-relaxed mb-4">
              If you genuinely cannot afford a subscription, please{' '}
              <Link
                href="/scholarship"
                className="text-accent hover:text-accent-dark underline font-semibold transition-colors"
              >
                request a scholarship
              </Link>
              . We're committed to supporting your journey regardless of financial circumstances.
            </p>
            <p className="text-sm md:text-base font-sans text-gray-600 italic">
              "The best time to start your journey was yesterday. The second best time is now."
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
