# Mobile Optimization Guide

## Overview

This document outlines the mobile-first optimizations implemented for the Inner Freedom Program website. All components have been designed and optimized for mobile devices first, then enhanced for larger screens.

## Key Principles

### 1. Mobile-First Design
- All base styles target mobile devices (< 640px)
- Progressive enhancement for tablets (sm: 640px+) and desktops (md: 768px+, lg: 1024px+)
- Unprefixed Tailwind classes = mobile styles
- Prefixed classes (sm:, md:, lg:) = larger screen enhancements

### 2. Touch-Friendly Interactions
- Minimum touch target size: **44x44px** (Apple HIG standard)
- All interactive elements use `touch-manipulation` utility class
- Removed hover-only interactions (mobile doesn't have hover)
- Added `active:` states for tactile feedback

### 3. Thumb-Friendly Navigation
- Bottom navigation bar on mobile (not top hamburger menu)
- Primary CTAs positioned in "thumb zone" (bottom-center of screen)
- Full-width buttons on mobile for easier tapping

### 4. Responsive Typography
- Font sizes scale appropriately across breakpoints
- Minimum readable size: 16px on mobile
- Line height optimized for readability
- Use responsive typography utilities (`.text-responsive-*`)

## Components Created/Updated

### MobileNavigation Component
**Location:** `components/shared/MobileNavigation.tsx`

Bottom navigation bar for mobile devices:
- Fixed position at bottom of screen
- Only visible on screens < 1024px (`lg:hidden`)
- Includes safe area padding for devices with notches
- Links: Home, The Teacher, Login
- Prominent "Start Trial" CTA button

**Usage:**
```tsx
import MobileNavigation from '@/components/shared/MobileNavigation'

// Automatically included in Layout component
// Or use directly:
<MobileNavigation />
```

### Enhanced CTAButton
**Location:** `components/shared/CTAButton.tsx`

**Improvements:**
- Minimum height: 44px for touch targets
- Full-width on mobile by default (`w-full sm:w-auto`)
- Size variants: `sm`, `md`, `lg`
- `fullWidth` prop for consistent mobile buttons
- Active states for touch feedback
- Touch manipulation CSS

**Usage:**
```tsx
<CTAButton 
  href="/subscribe" 
  variant="primary" 
  size="lg"
  fullWidth  // Full width on all screens
>
  Start Your Free Trial
</CTAButton>
```

### MobileFormField Components
**Location:** `components/shared/MobileFormField.tsx`

Mobile-optimized form inputs:
- `MobileFormInput` - Text, email, password inputs
- `MobileFormTextarea` - Textarea inputs
- Large touch targets (min-height: 44px)
- Proper label associations for accessibility
- Error state handling
- Helper text support

**Usage:**
```tsx
import { MobileFormInput, MobileFormTextarea } from '@/components/shared/MobileFormField'

<MobileFormInput
  label="Email Address"
  type="email"
  name="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### ResponsiveImage Component
**Location:** `components/shared/ResponsiveImage.tsx`

Wrapper around Next.js Image with mobile-optimized defaults:
- Automatic responsive sizes
- Lazy loading by default
- Priority loading option
- Proper aspect ratios

**Usage:**
```tsx
import ResponsiveImage from '@/components/shared/ResponsiveImage'

<ResponsiveImage
  src="/images/hero.jpg"
  alt="Hero image"
  priority={true}
  mobileSize="100vw"
  tabletSize="50vw"
  desktopSize="33vw"
/>
```

### StickyMobileCTA Component
**Location:** `components/homepage/StickyMobileCTA.tsx`

Sticky call-to-action that appears after scrolling past hero:
- Only shows on mobile/tablet
- Appears after scrolling past hero section (~85vh)
- Fixed to bottom (with safe area padding)
- Uses z-index 40 (below mobile nav's 50)

## CSS Utilities Added

**Location:** `app/globals.css`

### Responsive Typography Utilities
```css
.text-responsive-xs    /* text-xs sm:text-sm */
.text-responsive-sm    /* text-sm sm:text-base */
.text-responsive-base  /* text-base sm:text-lg */
.text-responsive-lg    /* text-lg sm:text-xl */
.text-responsive-xl    /* text-xl sm:text-2xl */
.text-responsive-2xl   /* text-2xl sm:text-3xl */
.text-responsive-3xl   /* text-3xl sm:text-4xl */
.text-responsive-4xl   /* text-4xl sm:text-5xl */
```

### Touch & Interaction Utilities
```css
.touch-manipulation  /* Optimizes touch events, removes tap highlight */
.pb-safe            /* Padding bottom with safe area inset */
.pt-safe            /* Padding top with safe area inset */
.mobile-padding     /* px-4 sm:px-6 lg:px-8 */
```

## Component Optimizations

### HeroSection
- Mobile-optimized text sizes
- Responsive padding and spacing
- Full-width CTA button on mobile
- Proper safe area handling

### ValueProposition
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Touch-friendly cards with active states
- Optimized icon sizes
- Mobile padding adjustments

### TeacherBio
- Stacked layout on mobile (flex-col)
- Responsive image sizes
- Proper text scaling
- Mobile-friendly credential lists

## Breakpoints

The project uses Tailwind's default breakpoints:

```javascript
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Laptops/Desktops
xl:  1280px  // Large desktops
2xl: 1536px  // Extra large desktops
```

## Testing Checklist

### Mobile Devices (< 640px)
- [ ] All text is readable (minimum 16px)
- [ ] Buttons are at least 44x44px
- [ ] Navigation is accessible at bottom
- [ ] Forms are single-column
- [ ] Images load properly
- [ ] Touch interactions work smoothly
- [ ] No horizontal scrolling

### Tablet Devices (640px - 1024px)
- [ ] Layout adapts to wider screen
- [ ] Multi-column layouts work
- [ ] Navigation transitions smoothly
- [ ] Forms can be multi-column if needed

### Desktop (> 1024px)
- [ ] Mobile navigation hidden
- [ ] Full desktop layouts displayed
- [ ] Hover states work
- [ ] All features accessible

## Performance Considerations

1. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Provide proper sizes attribute
   - Use priority only for above-fold images

2. **Touch Performance**
   - Use `touch-manipulation` CSS
   - Minimize reflows/repaints
   - Debounce scroll events

3. **Loading Strategy**
   - Mobile-first means smaller initial CSS
   - Tailwind purges unused styles
   - Code splitting for large components

## Browser Support

- iOS Safari 12+
- Chrome Mobile (Android)
- Samsung Internet
- Mobile Firefox

All modern mobile browsers are supported. Polyfills may be needed for:
- `env(safe-area-inset-*)` for older iOS versions

## Common Patterns

### Mobile-First Spacing
```tsx
// ❌ Desktop-first (bad)
<div className="px-8 sm:px-4">

// ✅ Mobile-first (good)
<div className="px-4 sm:px-8">
```

### Touch Targets
```tsx
// ✅ Minimum 44px height
<button className="min-h-[44px] py-3 px-6 touch-manipulation">
  Tap Me
</button>
```

### Responsive Text
```tsx
// ✅ Mobile-first text sizing
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
  Title
</h1>
```

### Conditional Mobile Navigation
```tsx
// ✅ Hide on desktop, show on mobile
<nav className="lg:hidden fixed bottom-0 ...">
```

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Google Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

## Mobile Utility Functions

A utility library has been created at `lib/utils/mobile.ts` with helper functions:

- `debounce()` - Debounce function for scroll/resize events
- `throttle()` - Throttle function for frequent events
- `isMobile()` - Check if device is mobile
- `isTablet()` - Check if device is tablet
- `isDesktop()` - Check if device is desktop
- `getViewportHeight()` - Get viewport height accounting for mobile browser bars
- `isNearBottom()` - Check if user is near bottom of page
- `smoothScrollTo()` - Smooth scroll to element with mobile-safe behavior

**Usage:**
```tsx
import { isMobile, debounce } from '@/lib/utils/mobile'

const handleScroll = debounce(() => {
  if (isMobile()) {
    // Mobile-specific logic
  }
}, 100)
```

## Recent Refinements

### StickyMobileCTA Coordination
- Now hides when user scrolls near bottom (within 150px) to avoid conflict with MobileNavigation
- Uses debounced scroll handler for better performance
- Detects when user is near page bottom and auto-hides

### Form Optimizations
- CheckoutForm now uses MobileFormField components
- All inputs have proper mobile sizing (16px minimum on iOS)
- Touch-friendly radio buttons with min-height 44px
- Improved spacing and padding on mobile

### PricingTable Mobile Improvements
- Better spacing and padding for mobile
- Responsive text sizes
- Touch-friendly cards
- Improved guarantee text layout on mobile

### Testimonial Components
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Optimized image sizes and lazy loading
- Better text truncation for long names/identifiers
- Improved spacing on mobile

## Notes

- Mobile navigation z-index: 50
- Sticky CTA z-index: 40
- All modals/overlays should use z-index > 50
- Safe area insets only apply on iOS devices with notches
- Test on real devices when possible (simulators may not accurately represent touch behavior)
- iOS automatically zooms if input font-size < 16px - all inputs use 16px minimum
- Scroll events are debounced/throttled for better performance

