# Testimonials Components

This directory contains all components related to testimonials and social proof, built according to Agent 4 specifications.

## Components

### TestimonialCard
Individual testimonial card component for use in grids.

**Props:**
- `testimonial: Testimonial` - Testimonial data object

**Usage:**
```tsx
import TestimonialCard from '@/components/testimonials/TestimonialCard'
import { testimonials } from '@/components/testimonials/testimonialsData'

<TestimonialCard testimonial={testimonials[0]} />
```

### TestimonialGrid
Responsive grid layout for displaying multiple testimonials.

**Props:**
- `testimonials: Testimonial[]` - Array of testimonial objects
- `title?: string` - Section title (default: "What Our Students Are Saying")
- `subtitle?: string` - Section subtitle

**Usage:**
```tsx
import TestimonialGrid from '@/components/testimonials/TestimonialGrid'
import { testimonials } from '@/components/testimonials/testimonialsData'

<TestimonialGrid 
  testimonials={testimonials}
  title="What Our Students Are Saying"
  subtitle="Real stories from people who've transformed their lives"
/>
```

### SpotlightTestimonial
Large, featured testimonial component for prominent placement (typically above pricing section).

**Props:**
- `testimonial: SpotlightTestimonial` - Spotlight testimonial with full story

**Usage:**
```tsx
import SpotlightTestimonial from '@/components/testimonials/SpotlightTestimonial'
import { spotlightTestimonial } from '@/components/testimonials/testimonialsData'

<SpotlightTestimonial testimonial={spotlightTestimonial} />
```

**Features:**
- Two-column layout (image/video on left, content on right)
- Supports video testimonials via `videoUrl`
- Supports image testimonials via `image`
- Falls back to gradient placeholder if no media provided

### SocialProof
Displays aggregate ratings, review counts, and trust badges.

**Props:**
- `rating?: number` - Average rating (default: 4.8)
- `reviewCount?: number` - Number of reviews (default: 200)
- `showBadges?: boolean` - Show trust badges (default: true)

**Usage:**
```tsx
import SocialProof from '@/components/testimonials/SocialProof'

<SocialProof rating={4.8} reviewCount={200} showBadges={true} />
```

## Data Structure

### Testimonial Type
```typescript
interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  location?: string
  identifier: string // e.g., "Jane D., Corporate Lawyer"
  photo?: string // Path to photo (future use)
  persona?: 'skeptic' | 'beginner' | 'transformation'
  rating?: number // 1-5 stars
}
```

### SpotlightTestimonial Type
Extends `Testimonial` with:
- `fullStory: string` - Complete testimonial story
- `videoUrl?: string` - Optional video testimonial URL
- `image?: string` - Optional large image URL

## Testimonials Data

The `testimonialsData.ts` file contains:
- 6 regular testimonials covering different personas:
  - **The Skeptic**: Addresses "I've tried other apps" objection
  - **The Beginner**: Addresses "Is this too advanced?" concern
  - **The Transformation**: Shows before/after results
- 1 spotlight testimonial with full transformation story

### Adding New Testimonials

To add testimonials, edit `testimonialsData.ts`:

```typescript
export const testimonials: Testimonial[] = [
  // ... existing testimonials
  {
    id: '7',
    quote: "Your testimonial quote here",
    author: 'Name',
    identifier: 'Name, Title',
    role: 'Title',
    persona: 'transformation', // or 'skeptic' or 'beginner'
    rating: 5,
  },
]
```

## Design Features

- **Responsive Grid**: Mobile-first design that adapts from 1 column (mobile) to 2 columns (tablet) to 3 columns (desktop)
- **Persona-Based**: Testimonials are categorized to address specific user objections
- **Star Ratings**: Visual 5-star rating display
- **Trust Signals**: Security badges, guarantee messaging, payment method indicators
- **Accessibility**: Proper semantic HTML, ARIA labels, and keyboard navigation support

## Placement Recommendations

According to the plan specifications:

1. **TestimonialGrid**: Place after the value proposition section, before teacher bio or pricing
2. **SpotlightTestimonial**: Place prominently above the pricing section
3. **SocialProof**: Can be placed near pricing/checkout areas or in footer

## Styling

All components use Tailwind CSS utility classes and follow the brand system:
- Primary colors for headings
- Neutral backgrounds for sections
- Accent color for star ratings and badges
- Serif fonts for headings, sans-serif for body text

