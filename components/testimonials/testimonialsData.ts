import { Testimonial, SpotlightTestimonial } from './types'

// Regular testimonials for the grid
export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "I'd tried Duolingo and other apps, but they didn't cover Georgian properly. This program actually taught me the alphabet, grammar, and real conversation skills. Now I can have basic conversations with my Georgian friends!",
    author: 'Sarah M.',
    identifier: 'Sarah M., Language Enthusiast',
    role: 'Language Enthusiast',
    persona: 'skeptic',
    rating: 5,
  },
  {
    id: '2',
    quote: 'I was a total beginner with zero knowledge of Georgian. The step-by-step approach made learning the unique alphabet and complex grammar feel achievable. Now I can read and speak basic Georgian!',
    author: 'Michael R.',
    identifier: 'Michael R., Software Engineer',
    role: 'Software Engineer',
    persona: 'beginner',
    rating: 5,
  },
  {
    id: '3',
    quote: 'Before this program, I could barely say hello in Georgian. Six months later, I can have conversations about daily topics, express my opinions, and understand Georgian culture much better.',
    author: 'Jessica L.',
    identifier: 'Jessica L., Travel Blogger',
    role: 'Travel Blogger',
    persona: 'transformation',
    rating: 5,
  },
  {
    id: '4',
    quote: 'The structured grammar lessons were exactly what I needed. The teacher breaks down complex Georgian grammar in a way that makes sense. No other course does this so well.',
    author: 'David K.',
    identifier: 'David K., Linguistics Student',
    role: 'Linguistics Student',
    persona: 'skeptic',
    rating: 5,
  },
  {
    id: '5',
    quote: 'I appreciated how accessible the content was. Even as someone new to language learning, I never felt lost. The native speakers guide you with such clarity and patience.',
    author: 'Emma T.',
    identifier: 'Emma T., Expat Living in Georgia',
    role: 'Expat Living in Georgia',
    persona: 'beginner',
    rating: 5,
  },
  {
    id: '6',
    quote: 'My experience in Georgia transformed completely. I went from struggling with basic phrases to having meaningful conversations with locals. This program changed my relationship with the country and its people.',
    author: 'Robert C.',
    identifier: 'Robert C., International Business',
    role: 'International Business',
    persona: 'transformation',
    rating: 5,
  },
]

// Spotlight testimonial (featured, large format)
export const spotlightTestimonial: SpotlightTestimonial = {
  id: 'spotlight-1',
  quote: 'This program didn\'t just teach me Georgian—it opened up a whole new world.',
  author: 'Maria G.',
  identifier: 'Maria G., Cultural Anthropologist',
  role: 'Cultural Anthropologist',
  fullStory: 'As someone studying Georgian culture, I knew I needed to learn the language properly. Other programs I tried felt superficial and didn\'t cover the grammar and cultural nuances I needed. Then I found this program. The comprehensive approach, from the unique alphabet to advanced conversational skills, gave me the tools to truly engage with Georgian culture. The teacher\'s insights into cultural context and language use were invaluable. Today, I can conduct interviews in Georgian, understand historical texts, and have deep conversations with Georgian colleagues. This program didn\'t just teach me a language—it gave me access to a rich cultural heritage.',
  persona: 'transformation',
  rating: 5,
}

