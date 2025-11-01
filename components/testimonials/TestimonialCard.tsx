import Image from 'next/image'
import { Testimonial } from './types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // Persona badge colors and labels
  const personaConfig = {
    skeptic: { label: 'The Skeptic', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    beginner: { label: 'The Beginner', color: 'bg-green-50 text-green-700 border-green-200' },
    transformation: { label: 'Transformation', color: 'bg-accent/10 text-accent border-accent/20' },
  }
  const persona = testimonial.persona ? personaConfig[testimonial.persona] : null

  return (
    <article className="group bg-white rounded-lg shadow-md p-5 sm:p-6 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
      {/* Persona Badge */}
      {persona && (
        <div className="mb-3">
          <span className={`inline-block px-2.5 py-1 text-xs font-sans font-semibold rounded-full border ${persona.color}`}>
            {persona.label}
          </span>
        </div>
      )}

      {/* Rating Stars */}
      {testimonial.rating && (
        <div className="flex gap-0.5 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 transition-colors duration-200 ${
                i < testimonial.rating! ? 'text-accent' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="flex-grow mb-6" cite={testimonial.author}>
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-primary-200 mb-3 group-hover:text-primary-300 transition-colors duration-200"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-sm sm:text-base md:text-lg font-sans text-gray-700 leading-relaxed italic line-clamp-4">
          "{testimonial.quote}"
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-4 border-t border-gray-100">
        {/* Photo */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all duration-200">
          {testimonial.photo ? (
            <Image
              src={testimonial.photo}
              alt={`${testimonial.author} profile picture`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 44px, 48px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300 text-primary-900 font-sans font-semibold text-sm sm:text-base">
              {testimonial.author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and Identifier */}
        <div className="min-w-0 flex-1">
          <p className="font-sans font-semibold text-gray-900 text-sm sm:text-base truncate">
            {testimonial.author}
          </p>
          <p className="font-sans text-xs sm:text-sm text-gray-600 truncate" title={testimonial.identifier}>
            {testimonial.identifier}
          </p>
        </div>
      </div>
    </article>
  )
}
