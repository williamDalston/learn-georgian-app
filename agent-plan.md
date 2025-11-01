# 8-Agent Build Plan: Inner Freedom Program Website

## Overview
This document breaks down the development of the Inner Freedom subscription website into 8 parallel agent tasks. Each agent will work on distinct, modular components that can be developed simultaneously.

---

## Agent 1: Foundation & Brand System Setup
**Primary Focus:** Project initialization, Tailwind configuration, design system setup

### Tasks:
1. **Project Setup**
   - Initialize Next.js project with TypeScript
   - Install and configure Tailwind CSS
   - Set up project structure (components, pages, styles, public assets)

2. **Tailwind Configuration (`tailwind.config.js`)**
   - Configure custom color palette:
     - Primary: Soft/deep blues (#b8c7cb, #082434)
     - Secondary: Sage/deep greens (#a4a6a0, #254B5A)
     - Neutral: Warm whites (#eef0f0), beiges, soft grays
     - Accent: Warm orange/coral for CTAs
   - Configure typography:
     - Serif for headlines (Playfair Display or Lora)
     - Sans-serif for body (Inter or Karla)
   - Set up responsive breakpoints (sm, md, lg)

3. **Template Integration**
   - Purchase/obtain "Compass - Course Template" or "Primer - Info Product Template"
   - Integrate base template structure
   - Set up MDX for lesson content

4. **Global Styles & Utilities**
   - Create base layout components (Layout, Container)
   - Set up reusable utility classes
   - Configure font loading (Google Fonts or self-hosted)

5. **Asset Structure**
   - Set up `/public` folder structure (images, icons, logos)
   - Create placeholder assets or reference requirements

### Deliverables:
- Working Next.js project with Tailwind
- Complete `tailwind.config.js` with brand colors/fonts
- Base layout components
- Project documentation (README, setup instructions)

---

## Agent 2: Homepage Hero & Value Proposition
**Primary Focus:** Above-the-fold hero section and primary conversion elements

### Tasks:
1. **Hero Section Component**
   - Build hero with H1: "Stop Reacting. Start Living."
   - Add H2 sub-headline explaining the program
   - Implement primary CTA button: "Start Your Free Trial"
   - Ensure above-the-fold visibility on all devices
   - Add hero image/video placeholder area

2. **Value Proposition Section**
   - Create benefits grid/list component
   - Icons or visual elements for key benefits:
     - "10+ hours of transformative video lessons"
     - "Step-by-step exercises for deep healing"
     - "Guidance from an experienced teacher"
     - "Private community support" (if applicable)

3. **CTA Button Component (Reusable)**
   - Create styled button component with accent color
   - Hover states and transitions
   - Variants (primary, secondary)
   - Mobile-optimized sizing

4. **Mobile Sticky CTA**
   - Implement sticky bottom banner for mobile
   - Conditional rendering based on scroll position
   - Only appears after scrolling past hero

### Deliverables:
- `HeroSection.jsx` component
- `ValueProposition.jsx` component
- `CTAButton.jsx` reusable component
- `StickyMobileCTA.jsx` component
- Fully responsive mobile-first design

---

## Agent 3: About Teacher & Credibility Components
**Primary Focus:** Teacher bio, credentials, and authority-building sections

### Tasks:
1. **Teacher Bio Component**
   - Two-column layout (lg:flex)
   - Left column:
     - Professional teacher photo
     - Bulleted credentials list
     - "Author of..." 
     - "PhD in..." / certifications
     - "20+ Years Guiding..."
     - "Featured in [Media Outlet]"
   - Right column:
     - H3: "My journey to inner freedom wasn't a straight line."
     - Personal narrative (100-150 words)
     - Philosophy statement reinforcing "no-fluff" positioning

2. **Credentials/Authority Display**
   - Modular credential card components
   - Logo cloud component ("As Seen In")
   - Media mentions section

3. **Course Content Outline Component**
   - Module/week breakdown display
   - "Week 1: Understanding Your Inner Self"
   - "Week 2: Healing Past Wounds"
   - Accordion or list format
   - Self-paced messaging

### Deliverables:
- `TeacherBio.jsx` component
- `Credentials.jsx` component
- `CourseOutline.jsx` component
- `LogoCloud.jsx` component (if needed)

---

## Agent 4: Testimonials & Social Proof
**Primary Focus:** Social proof components to build trust and handle objections

### Tasks:
1. **Testimonial Grid Component**
   - Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
   - Testimonial cards with:
     - Pull quote (specific, objection-handling)
     - Customer photo
     - Name and identifier (e.g., "Jane D., Corporate Lawyer")
   - Curated testimonials for personas:
     - The Skeptic
     - The Beginner
     - The Transformation (before/after stories)

2. **Spotlight Case Study Component**
   - Large, prominent testimonial
   - Two-column layout (lg:flex)
   - Video testimonial or large image
   - Full transformation story
   - Place above pricing section

3. **Social Proof Display**
   - Star ratings display (4.8/5 by 200 participants)
   - Trust badges component
   - Review aggregator display (if applicable)

4. **Testimonial Data Structure**
   - Create JSON/data structure for testimonials
   - Make it easy to add/edit testimonials

### Deliverables:
- `TestimonialGrid.jsx` component
- `TestimonialCard.jsx` component
- `SpotlightTestimonial.jsx` component
- `SocialProof.jsx` component
- Testimonial data structure/JSON file

---

## Agent 5: Pricing & Checkout Flow
**Primary Focus:** Pricing display and conversion-optimized checkout process

### Tasks:
1. **Pricing Table Component**
   - Two-tier pricing layout:
     - Monthly Plan (anchor price)
     - Annual Plan (highlighted as "Best Value")
   - Monthly/Annual toggle
   - Visual highlighting for annual plan:
     - "Most Popular" badge
     - Accent border
     - Savings calculation display ("Save 40%" or "Get 2 Months Free")

2. **Objection Handlers Section**
   - "30-Day Money-Back Guarantee" display
   - "Cancel anytime" messaging
   - Scholarship model component:
     - "Our Mission" section
     - Link to scholarship request

3. **Checkout Page (`/subscribe`)**
   - Distraction-free layout (no header/footer)
   - Two-column form layout:
     - Left: Account & Payment
       - Email field
       - Password field
       - Payment details (Stripe Elements integration)
     - Right: Order Summary
       - Plan details
       - Price display
       - Guarantee reiteration
   - Primary CTA: "Complete Purchase & Start Learning"

4. **Stripe Integration**
   - Set up Stripe Elements
   - Payment form component
   - Secure payment handling
   - Localized payment options

5. **Trust Signals in Checkout**
   - "Guaranteed Safe Checkout" badges
   - Payment method logos (Visa, Mastercard, PayPal)
   - SSL/security indicators
   - Privacy policy and terms links

### Deliverables:
- `PricingTable.jsx` component
- `BillingToggle.jsx` component
- `ScholarshipSection.jsx` component
- `/pages/subscribe.jsx` or `/app/subscribe/page.jsx`
- `CheckoutForm.jsx` component
- Stripe integration setup
- `TrustBadges.jsx` component

---

## Agent 6: Mobile Optimization & Responsive Design
**Primary Focus:** Mobile-first responsive design across all components

### Tasks:
1. **Mobile-First Audit**
   - Review all components from Agents 2-5
   - Ensure mobile-first utility classes (unprefixed = mobile)
   - Test breakpoints: sm, md, lg

2. **Thumb-Friendly Navigation**
   - Bottom navigation bar component (mobile)
   - Links: "Home," "The Teacher," "Login," "Start Trial"
   - Replace top hamburger menu on mobile

3. **Form Optimization**
   - Single-column forms on mobile
   - Full-width buttons at bottom of screen
   - Large touch targets (min 44x44px)
   - Proper input sizing and spacing

4. **Mobile Image/Video Handling**
   - Responsive image components
   - Lazy loading implementation
   - Optimized video embedding
   - Proper aspect ratios on all devices

5. **Responsive Typography**
   - Mobile-optimized font sizes
   - Readable line heights
   - Proper text scaling across breakpoints

6. **Touch Interactions**
   - Remove hover-only interactions
   - Add touch-friendly feedback
   - Test all interactive elements on mobile

### Deliverables:
- Mobile-responsive versions of all components
- `MobileNavigation.jsx` component
- Responsive utilities/helpers
- Mobile testing checklist
- Documentation of mobile breakpoints

---

## Agent 7: Member Dashboard & Post-Conversion UX
**Primary Focus:** User dashboard and retention-focused member experience

### Tasks:
1. **First Login Experience**
   - Welcome modal/overlay component
   - "Start Lesson 1" or "Take a Quick Tour" options
   - Onboarding flow component

2. **Dashboard Layout (`/app`)**
   - Modular grid layout: `grid-cols-1 lg:grid-cols-3`
   - Component 1 (Main - lg:col-span-2):
     - "Continue Your Path" module
     - Next video/exercise display
     - Single-click action to continue
   - Component 2 (Habit Module):
     - "Your Progress" display
     - Days Practiced counter
     - Total Time tracker
     - Current Streak display
   - Component 3 (Intellect Module):
     - "Discover More" recommendations
     - Theory lectures suggestions
     - Guest expert conversations
     - Related exercises

3. **Lesson/Video Player Components**
   - Video player component (responsive)
   - Lesson description section
   - Downloadable exercise materials
   - "Mark as Complete" functionality
   - Progress indicators

4. **Progress Tracking**
   - Progress bars
   - Checkmarks for completed lessons
   - Visual progress indicators
   - Achievement/celebration components

5. **Member Navigation**
   - Dashboard sidebar/navigation
   - Course outline navigation
   - Search functionality (if applicable)
   - User profile/settings access

6. **Consistency with Marketing Site**
   - Same color scheme and typography
   - Branded member area
   - Smooth transition from marketing to app

### Deliverables:
- `/app/dashboard` page or component
- `WelcomeModal.jsx` component
- `ProgressTracker.jsx` component
- `LessonPlayer.jsx` component
- `MemberNavigation.jsx` component
- Dashboard module components (Continue, Progress, Discover)

---

## Agent 8: Integration, Testing & Final Polish
**Primary Focus:** Integration of all components, testing, and optimization

### Tasks:
1. **Component Integration**
   - Integrate all components from Agents 2-7
   - Create main homepage (`index.js` or `/app/page.jsx`)
   - Assemble full page layouts
   - Connect routing between pages

2. **Performance Optimization**
   - Image optimization (next/image)
   - Code splitting and lazy loading
   - CSS purging verification
   - Bundle size optimization
   - CDN setup considerations

3. **Accessibility Audit**
   - WCAG compliance checking
   - Color contrast validation
   - Keyboard navigation testing
   - Screen reader compatibility
   - Alt text for all images
   - Form label associations

4. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)
   - Responsive design validation
   - Touch interaction testing

5. **SEO Optimization**
   - Meta tags setup
   - Open Graph tags
   - Structured data (Schema.org)
   - Sitemap generation
   - robots.txt configuration

6. **Error Handling & Loading States**
   - Loading spinners/skeletons
   - Error boundary components
   - Form validation and error messages
   - 404 page
   - Payment error handling

7. **Analytics & Tracking Setup**
   - Google Analytics or similar
   - Conversion tracking
   - Event tracking for CTAs
   - User behavior tracking setup

8. **Documentation**
   - Component documentation
   - Setup/deployment instructions
   - Environment variables documentation
   - API/stripe keys configuration guide

### Deliverables:
- Fully integrated website
- `ErrorBoundary.jsx` component
- Loading state components
- SEO meta components
- Analytics setup
- Complete project documentation
- Testing report/checklist

---

## Coordination & Integration Points

### Shared Dependencies:
- **Agent 1** provides foundation for all other agents
- **Agent 2-5** can work in parallel after Agent 1 completes base setup
- **Agent 6** reviews and optimizes work from Agents 2-5
- **Agent 7** may depend on Agent 1's template integration
- **Agent 8** integrates everything after Agents 2-7 are complete

### File Structure Suggestions:
```
/project-root
  /app (or /pages)
    /subscribe (checkout)
    /app (member dashboard)
    /api
  /components
    /homepage (Hero, ValueProp, etc.)
    /shared (CTAButton, etc.)
    /testimonials
    /pricing
    /dashboard
  /styles
  /public
    /images
    /icons
  /lib
    /stripe
    /utils
  tailwind.config.js
  next.config.js
```

### Communication Protocol:
- All agents should use consistent naming conventions
- Components should be exported as default exports
- Use TypeScript interfaces for prop types (if using TypeScript)
- Document any breaking changes or API requirements
- Share component API/props via comments or JSDoc

### Testing Strategy:
- Each agent should include basic prop validation
- Agent 8 will conduct comprehensive integration testing
- Mobile testing should be done on real devices when possible

---

## Success Criteria

1. **Functional Requirements:**
   - All pages render correctly
   - Stripe checkout works end-to-end
   - Member dashboard displays content
   - Mobile-responsive on all devices

2. **Performance:**
   - Lighthouse score > 90
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3.5s
   - Mobile-friendly score > 95

3. **Design Fidelity:**
   - Matches brand colors and typography
   - Consistent spacing and layout
   - Proper use of Tailwind utilities
   - Matches plan.md specifications

4. **User Experience:**
   - Clear conversion path
   - Intuitive navigation
   - Accessible to all users
   - Smooth transitions between pages

---

## Timeline Estimate

- **Agent 1:** 2-3 hours (foundation)
- **Agents 2-5:** 4-6 hours each (parallel development)
- **Agent 6:** 3-4 hours (optimization pass)
- **Agent 7:** 4-5 hours (dashboard)
- **Agent 8:** 4-6 hours (integration & polish)

**Total Estimated Time:** ~35-45 hours of development time

---

## Next Steps After Completion

1. User acceptance testing
2. A/B testing setup (headlines, CTAs)
3. Content population (real testimonials, teacher bio)
4. Payment processing testing (Stripe test mode → live)
5. Analytics validation
6. Launch checklist completion
