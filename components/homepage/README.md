# Homepage Components (Agent 3)

This directory contains the Teacher Bio, Credentials, Course Outline, and Logo Cloud components built by Agent 3.

## Components

### TeacherBio
Two-column responsive layout showcasing the teacher's credentials, photo, personal narrative, and philosophy.

**Features:**
- Mobile-first responsive design (stacks vertically on mobile, side-by-side on desktop)
- Optimized image loading with Next.js Image component
- Fully customizable via props with sensible defaults
- Smooth responsive typography scaling

**Props:**
- `photo?: string` - Path to teacher photo (default: `/images/teacher-photo.jpg`)
- `photoAlt?: string` - Alt text for photo
- `credentials?: object` - Credentials object with `author`, `degree`, `experience`, `featuredIn[]`
- `personalNarrative?: string` - Personal story (100-150 words recommended)
- `philosophy?: string` - Philosophy statement reinforcing "no-fluff" positioning

**Usage:**
```tsx
import { TeacherBio } from '@/components/homepage'

<TeacherBio
  photo="/images/teacher-photo.jpg"
  credentials={{
    author: 'The Path to Inner Freedom',
    degree: 'PhD in Psychology',
    experience: '20+ Years Guiding Individuals to Inner Freedom',
    featuredIn: ['New York Times', 'Psychology Today']
  }}
/>
```

### Credentials
Modular credential cards displaying authority and expertise in a responsive grid.

**Features:**
- 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Hover effects with subtle lift animation
- Clean card design with consistent spacing

**Props:**
- `credentials?: Credential[]` - Array of credential objects with `title`, `description`, `icon`

**Usage:**
```tsx
import { Credentials } from '@/components/homepage'

<Credentials
  credentials={[
    { title: 'PhD in Psychology', description: 'Specialized in...' }
  ]}
/>
```

### CourseOutline
Simple grid layout displaying course modules in a clean, scannable format.

**Features:**
- 6-week course structure (default)
- Grid layout: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Numbered module indicators with accent color
- Hover effects with subtle lift animation
- Self-paced learning messaging

**Note:** This is a simplified, non-interactive version. Modules are displayed as cards in a grid.

**Usage:**
```tsx
import { CourseOutline } from '@/components/homepage'

<CourseOutline />
```

The component uses a predefined `modules` array. To customize, edit the `modules` constant in the component file.

### LogoCloud
Display logos from media mentions ("As Seen In" section) with graceful fallbacks.

**Features:**
- Responsive grid: 2 columns (mobile) → 4 columns (desktop)
- Grayscale to color hover effect
- Image error handling with text fallback
- Optional clickable logos with proper accessibility
- Lazy loading for performance

**Props:**
- `title?: string` - Section title (default: "As Seen In")
- `logos?: LogoItem[]` - Array of logo objects with `name`, `logo` (path), `alt`, `url?`

**Usage:**
```tsx
import { LogoCloud } from '@/components/homepage'

<LogoCloud
  logos={[
    {
      name: 'New York Times',
      logo: '/logos/nyt-logo.png',
      alt: 'New York Times',
      url: 'https://...' // optional - makes logo clickable
    }
  ]}
/>
```

## Required Assets

### Images
- `/public/images/teacher-photo.jpg` - Professional teacher photo (recommended: 600x800px, aspect ratio 3:4)

### Logos
- `/public/logos/nyt-logo.png` - New York Times logo
- `/public/logos/psychology-today-logo.png` - Psychology Today logo
- `/public/logos/mindful-logo.png` - Mindful Magazine logo
- `/public/logos/hbr-logo.png` - Harvard Business Review logo (or other media outlets)

**Note:** All components include default placeholder data. Replace with actual content and assets when available.

## Design Notes

### Responsive Design
- **Mobile-first approach:** All components use unprefixed classes (mobile) with `sm:`, `md:`, `lg:` breakpoints
- **Consistent spacing:** Uses `px-4 sm:px-0` pattern for mobile padding, `mb-10 sm:mb-12` for section spacing
- **Typography scaling:** Responsive text sizes (`text-base sm:text-lg`, `text-xl sm:text-2xl md:text-3xl`)
- **Touch-friendly:** Proper spacing and sizing for mobile interactions

### Brand System
- **Colors:** Uses brand colors from `tailwind.config.js` (primary blues, secondary greens, accent orange, neutral palette)
- **Typography:** Serif (Playfair Display) for headlines, Sans-serif (Inter) for body text
- **Backgrounds:** Alternating white and neutral-100 backgrounds for visual separation
- **Accents:** Orange accent color (#ff7d32) used for CTAs, highlights, and numbered indicators

### Interactions
- **Hover effects:** Subtle lift animation (`hover:-translate-y-1`) on cards
- **Shadow transitions:** Cards have `hover:shadow-lg` for depth
- **Smooth transitions:** All interactive elements use `transition-all duration-300`

### Accessibility
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Focus states with visible rings
- Screen reader support (sr-only classes for fallback text)
- Image alt text requirements

## Integration

These components should be integrated into the main homepage (`app/page.tsx`) by Agent 8 during final integration.

Suggested order on homepage:
1. Hero Section (Agent 2)
2. Value Proposition (Agent 2)
3. TeacherBio
4. Credentials (optional, can be integrated into TeacherBio if preferred)
5. CourseOutline
6. LogoCloud
7. Testimonials (Agent 4)
8. Pricing (Agent 5)

