import Container from '@/components/shared/Container'
import { testimonials } from './testimonialsData'

export default function SocialProof() {
  // Calculate average rating
  const ratings = testimonials.filter((t) => t.rating).map((t) => t.rating!)
  const averageRatingNum = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 5.0
  const averageRating = averageRatingNum.toFixed(1)
  const fullStars = Math.floor(averageRatingNum)
  const hasHalfStar = averageRatingNum % 1 >= 0.5
  const totalReviews = testimonials.length

  return (
    <section className="section-padding bg-primary-900 text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Star Rating Display */}
            <div className="flex gap-1" role="img" aria-label={`${averageRating} out of 5 stars`}>
              {[...Array(fullStars)].map((_, i) => (
                <svg
                  key={`full-${i}`}
                  className="w-8 h-8 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {hasHalfStar && (
                <div className="relative w-8 h-8">
                  <svg
                    className="w-8 h-8 text-neutral-600 absolute"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="w-8 h-8 text-accent absolute overflow-hidden"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ clipPath: 'inset(0 50% 0 0)' }}
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
              {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <svg
                  key={`empty-${i}`}
                  className="w-8 h-8 text-neutral-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-4xl font-serif font-bold">{averageRating}</span>
          </div>
          <p className="text-lg md:text-xl font-sans text-neutral-200 mb-2">
            Rated {averageRating} out of 5 by {totalReviews}+ participants
          </p>
          <p className="text-base md:text-lg font-sans text-neutral-300">
            Join thousands who have transformed their lives through inner freedom
          </p>
          <p className="text-sm md:text-base font-sans text-neutral-400 mt-4">
            Trusted by professionals, parents, students, and seekers worldwide
          </p>
        </div>
      </Container>
    </section>
  )
}
