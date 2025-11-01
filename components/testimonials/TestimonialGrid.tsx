import Container from '@/components/shared/Container'
import { testimonials } from './testimonialsData'
import TestimonialCard from './TestimonialCard'

export default function TestimonialGrid() {
  return (
    <section className="section-padding bg-neutral-100" aria-label="Testimonials">
      <Container>
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary-900 mb-3 sm:mb-4">
            What Our Students Are Saying
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-sans text-gray-700 max-w-2xl mx-auto">
            Real stories from people who have transformed their lives through this program
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-4 sm:px-0">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="animate-fade-in animate-slide-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
