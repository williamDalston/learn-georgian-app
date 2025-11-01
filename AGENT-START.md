# Quick Start Guide for Agents

## ✅ Foundation Complete

The project foundation is fully set up and ready for development. All agents can begin working immediately.

## 🚀 Getting Started

1. **Ensure dependencies are installed:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

## 📋 What's Already Set Up

- ✅ Next.js 16 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom brand system
- ✅ Project folder structure
- ✅ Base layout components (Container, Layout)
- ✅ Global styles with Google Fonts (Playfair Display, Inter)
- ✅ ESLint configuration

## 🎨 Brand System Quick Reference

### Colors (Use these Tailwind classes)
```tsx
// Primary (Blues)
bg-primary-900 text-primary-50  // Deep blue
bg-primary-200                  // Soft blue

// Secondary (Greens)
bg-secondary-900 text-secondary-50  // Deep green
bg-secondary-200                    // Sage green

// Neutral
bg-neutral-50 bg-neutral-200  // Warm whites/beiges

// Accent (Orange/Coral) - Use for CTAs
bg-accent hover:bg-accent-dark  // Orange button
```

### Typography
```tsx
// Headlines (Serif)
<h1 className="font-serif text-4xl">Headline</h1>

// Body (Sans-serif)
<p className="font-sans text-base">Body text</p>
```

### Common Utilities
```tsx
// Container wrapper
<Container maxWidth="7xl">
  Content here
</Container>

// Section padding
<section className="section-padding">

// Mobile-first breakpoints
<div className="flex-col lg:flex-row">
```

## 📁 Where to Create Components

- **Agent 2 (Homepage Hero)**: `components/homepage/`
- **Agent 3 (Teacher Bio)**: `components/homepage/` or `components/shared/`
- **Agent 4 (Testimonials)**: `components/testimonials/`
- **Agent 5 (Pricing)**: `components/pricing/` and `app/subscribe/`
- **Agent 6 (Mobile)**: Review and optimize existing components
- **Agent 7 (Dashboard)**: `components/dashboard/` and `app/dashboard/`
- **Agent 8 (Integration)**: Integrate all components in `app/page.tsx`

## 🎯 Component Development Checklist

When creating components:

- [ ] Use TypeScript with proper prop types
- [ ] Export as default export
- [ ] Use Tailwind utility classes (not custom CSS)
- [ ] Follow mobile-first design (base = mobile, then `md:`, `lg:`)
- [ ] Use brand colors from `tailwind.config.js`
- [ ] Test responsive breakpoints (sm, md, lg)
- [ ] Use semantic HTML elements
- [ ] Add proper TypeScript interfaces for props

## 📝 Example Component Template

```tsx
import Container from '@/components/shared/Container'

interface MyComponentProps {
  title: string
  description?: string
}

export default function MyComponent({ title, description }: MyComponentProps) {
  return (
    <section className="section-padding bg-neutral-100">
      <Container>
        <h2 className="text-3xl font-serif text-primary-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg font-sans text-gray-700">
            {description}
          </p>
        )}
      </Container>
    </section>
  )
}
```

## 🔗 Import Paths

Use the `@/` alias for imports:
- `@/components/` - Components
- `@/app/` - App Router pages
- `@/lib/` - Utilities
- `@/public/` - Public assets (use `/images/` in src, not `@/public`)

## 📚 Key Files to Reference

- `tailwind.config.js` - Brand colors, fonts, breakpoints
- `app/globals.css` - Global styles and utilities
- `components/shared/Container.tsx` - Container wrapper
- `plan.md` - Detailed UX/UI specifications
- `agent-plan.md` - Your specific agent tasks

## ✅ Testing Your Work

1. **Visual Testing:**
   - Open http://localhost:3000
   - Test on different screen sizes (use browser DevTools)
   - Check mobile (375px), tablet (768px), desktop (1024px+)

2. **Code Quality:**
   ```bash
   npm run lint
   ```

3. **Build Test:**
   ```bash
   npm run build
   ```

## 🚨 Common Issues

**Issue**: Styles not applying
- **Solution**: Make sure Tailwind classes are used, and run `npm run dev`

**Issue**: Import errors
- **Solution**: Check that you're using `@/` alias, restart dev server

**Issue**: TypeScript errors
- **Solution**: Define proper interfaces for all props

## 📞 Coordination Notes

- All components should be self-contained and reusable
- Use consistent naming: PascalCase for components (e.g., `HeroSection.tsx`)
- Share component APIs via JSDoc comments or TypeScript interfaces
- Update this file if you discover important patterns or utilities

## 🎉 Ready to Build!

Everything is set up. Start building your components according to `agent-plan.md`!

