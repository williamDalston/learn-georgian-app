import { Testimonial, SpotlightTestimonial } from './types'

// Regular testimonials for the grid
export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "I'd tried Calm and Headspace, but they felt too surface-level. This was the first program that actually helped me understand why I was feeling stuck and gave me real tools to break free.",
    author: 'Sarah M.',
    identifier: 'Sarah M., Corporate Lawyer',
    role: 'Corporate Lawyer',
    persona: 'skeptic',
    rating: 5,
  },
  {
    id: '2',
    quote: 'I was a total beginner to meditation and mindfulness. The step-by-step approach made it feel achievable, not overwhelming. Now I practice daily and feel more grounded than ever.',
    author: 'Michael R.',
    identifier: 'Michael R., Software Engineer',
    role: 'Software Engineer',
    persona: 'beginner',
    rating: 5,
  },
  {
    id: '3',
    quote: 'Before this program, I was constantly anxious and reactive. Six months later, I have clarity about my purpose, better relationships, and a sense of peace I never thought possible.',
    author: 'Jessica L.',
    identifier: 'Jessica L., Teacher',
    role: 'Teacher',
    persona: 'transformation',
    rating: 5,
  },
  {
    id: '4',
    quote: 'The science-backed approach was exactly what I needed. No fluff, no dogma—just practical frameworks that work. This program changed how I relate to my thoughts and emotions.',
    author: 'David K.',
    identifier: 'David K., Financial Analyst',
    role: 'Financial Analyst',
    persona: 'skeptic',
    rating: 5,
  },
  {
    id: '5',
    quote: 'I appreciated how accessible the content was. Even as someone new to inner work, I never felt lost. The teacher guides you with such warmth and clarity.',
    author: 'Emma T.',
    identifier: 'Emma T., Marketing Manager',
    role: 'Marketing Manager',
    persona: 'beginner',
    rating: 5,
  },
  {
    id: '6',
    quote: 'My relationships have transformed. I went from reacting to everything my partner said to truly listening and responding with intention. This program saved my marriage.',
    author: 'Robert C.',
    identifier: 'Robert C., Small Business Owner',
    role: 'Small Business Owner',
    persona: 'transformation',
    rating: 5,
  },
]

// Spotlight testimonial (featured, large format)
export const spotlightTestimonial: SpotlightTestimonial = {
  id: 'spotlight-1',
  quote: 'This program didn\'t just change my life—it gave me my life back.',
  author: 'Maria G.',
  identifier: 'Maria G., Therapist & Mother',
  role: 'Therapist',
  fullStory: 'After years of helping others navigate their trauma and anxiety, I realized I was living in a state of constant stress and emotional exhaustion. I had tried everything—therapy, medication, various meditation apps—but nothing truly shifted my internal experience. Then I found this program. The structured approach and the teacher\'s compassionate guidance helped me finally understand and heal the patterns that had kept me stuck for decades. Today, I\'m not just functioning—I\'m thriving. I have the emotional resilience to be fully present with my clients, my family, and most importantly, myself.',
  persona: 'transformation',
  rating: 5,
}

