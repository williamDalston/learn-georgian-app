# Inner Freedom Program - Subscription Website

A high-conversion subscription website built with Next.js, TypeScript, and Tailwind CSS for an "Inner Freedom" wellness program.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles & Tailwind imports
│   ├── subscribe/         # Checkout page (Agent 5)
│   └── dashboard/         # Member dashboard (Agent 7)
│
├── components/            # React components
│   ├── shared/           # Reusable components
│   │   ├── Container.tsx # Container wrapper
│   │   └── Layout.tsx    # Layout wrapper
│   ├── homepage/         # Homepage components (Agent 2)
│   ├── testimonials/     # Social proof (Agent 4)
│   ├── pricing/          # Pricing & checkout (Agent 5)
│   └── dashboard/        # Member area (Agent 7)
│
├── lib/                   # Utilities & helpers
│   ├── stripe/           # Stripe integration (Agent 5)
│   └── utils/            # General utilities
│
├── public/                # Static assets
│   ├── images/           # Images (teacher, testimonials, etc.)
│   ├── icons/            # Icons
│   └── logos/            # Brand logos
│
├── tailwind.config.js    # Tailwind configuration with brand system
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

## 🎨 Brand System

The design system is configured in `tailwind.config.js`:

### Colors
- **Primary (Blues)**: Trust & calm (#082434, #b8c7cb)
- **Secondary (Greens)**: Growth & balance (#254B5A, #a4a6a0)
- **Neutral**: Warm whites, beiges (#eef0f0)
- **Accent (Orange/Coral)**: Energy & action (#ff7d32) - for CTAs

### Typography
- **Headlines**: Playfair Display (serif) - Authority & trust
- **Body**: Inter (sans-serif) - Readability

### Usage
```tsx
// Use brand colors
<div className="bg-primary-900 text-neutral-50">
  <h1 className="font-serif">Headline</h1>
  <p className="font-sans">Body text</p>
  <button className="bg-accent hover:bg-accent-dark">CTA Button</button>
</div>
```

## 👥 8-Agent Development Plan

This project is built following a modular 8-agent plan:

1. **Agent 1: Foundation** ✅ (Complete)
   - Next.js setup with TypeScript
   - Tailwind configuration with brand system
   - Base components and structure

2. **Agent 2: Homepage Hero & Value Proposition**
   - Hero section with headline "Stop Reacting. Start Living."
   - Value proposition components
   - CTA buttons and sticky mobile CTA

3. **Agent 3: About Teacher & Credibility**
   - Teacher bio component
   - Credentials display
   - Course outline component

4. **Agent 4: Testimonials & Social Proof**
   - Testimonial grid
   - Spotlight case study
   - Social proof displays

5. **Agent 5: Pricing & Checkout**
   - Pricing table with monthly/annual toggle
   - Checkout page with Stripe integration
   - Trust badges and guarantees

6. **Agent 6: Mobile Optimization**
   - Mobile-first responsive design pass
   - Thumb-friendly navigation
   - Mobile-specific optimizations

7. **Agent 7: Member Dashboard**
   - Dashboard layout
   - Progress tracking
   - Lesson player and navigation

8. **Agent 8: Integration & Polish**
   - Component integration
   - Performance optimization
   - Accessibility audit
   - SEO setup

See `agent-plan.md` for detailed specifications.

## 🛠️ Development Guidelines

### Component Structure
- Use TypeScript for all components
- Export as default exports
- Place shared components in `components/shared/`
- Use Tailwind utility classes for styling
- Mobile-first responsive design

### Styling Guidelines
- Use the brand color palette from `tailwind.config.js`
- Follow mobile-first approach (base styles = mobile, then `md:`, `lg:`)
- Use `Container` component for consistent spacing
- Use `section-padding` utility class for section spacing

### Example Component
```tsx
import Container from '@/components/shared/Container'

export default function MyComponent() {
  return (
    <section className="section-padding bg-neutral-100">
      <Container>
        <h2 className="text-3xl font-serif text-primary-900 mb-4">
          My Section
        </h2>
        <p className="text-lg font-sans text-gray-700">
          Content goes here
        </p>
      </Container>
    </section>
  )
}
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

Create a `.env.local` file for:
- Stripe keys (for Agent 5)
- Any API keys
- Database URLs (if needed)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🚢 Deployment

The project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any Node.js hosting platform

Build command: `npm run build`
Start command: `npm start`

## 📝 Notes

- All agents should work with the established folder structure
- Components should be modular and reusable
- Follow the mobile-first responsive strategy
- Maintain consistency with the brand system
- Test on real devices when possible

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- See `plan.md` for comprehensive UX/UI strategy

## ✅ Foundation Checklist

- [x] Next.js project initialized
- [x] TypeScript configured
- [x] Tailwind CSS installed and configured
- [x] Brand color palette defined
- [x] Typography system configured
- [x] Base layout components created
- [x] Project folder structure established
- [x] Global styles configured
- [x] README documentation

**Foundation is complete! All agents can now begin development.**

