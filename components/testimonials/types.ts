export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  location?: string
  identifier: string // e.g., "Jane D., Corporate Lawyer"
  photo?: string // Path to photo
  persona?: 'skeptic' | 'beginner' | 'transformation'
  rating?: number // 1-5 stars
}

export interface SpotlightTestimonial extends Testimonial {
  fullStory: string
  videoUrl?: string
  image?: string // Large image if no video
}

