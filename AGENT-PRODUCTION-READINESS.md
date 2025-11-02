# Agent Assignments: Production Readiness
**Date:** January 2025  
**Goal:** Get Learn Georgian app to production launch

---

## 🎯 Agent Overview

Six specialized agents to complete production readiness. Work can be done in parallel where possible.

---

## 🔴 AGENT 16: Database & Authentication Foundation
**Priority:** CRITICAL - BLOCKER  
**Status:** Not Started  
**Estimated Time:** 1-2 weeks

### Mission
Establish the database foundation and user authentication so real users can sign up and log in.

### Tasks

#### Phase 1: Database Setup
- [ ] Choose database solution (PostgreSQL, MongoDB, or Supabase)
- [ ] Set up database instance (local development + production)
- [ ] Create database schema:
  - [ ] Users table (id, email, password_hash, name, created_at, updated_at, email_verified)
  - [ ] Lessons table (id, title, description, level, module_number, lesson_number, duration, video_url, etc.)
  - [ ] User_Progress table (user_id, lesson_id, completed, score, time_spent, completed_at, attempts)
  - [ ] User_Achievements table (user_id, achievement_id, unlocked_at)
  - [ ] User_Subscriptions table (user_id, stripe_subscription_id, status, current_period_end, canceled_at)
  - [ ] User_Vocabulary table (user_id, word_id, learned, mastered, last_reviewed, review_count)
  - [ ] User_Audio_Recordings table (user_id, lesson_id, letter_id, audio_url, recorded_at)
- [ ] Create migration scripts
- [ ] Seed database with course content
- [ ] Set up connection pooling
- [ ] Create database utility functions in `lib/database/`

#### Phase 2: Authentication System
- [ ] Install NextAuth.js: `npm install next-auth`
- [ ] Configure NextAuth in `app/api/auth/[...nextauth]/route.ts`
- [ ] Set up credentials provider (email/password)
- [ ] Implement password hashing (bcrypt or argon2)
- [ ] Create registration flow in `app/api/auth/signup`
- [ ] Create login flow in `app/api/auth/login`
- [ ] Add email verification (optional but recommended)
- [ ] Implement password reset flow
- [ ] Add JWT token generation
- [ ] Configure session management
- [ ] Test all auth flows

#### Phase 3: Protected Routes & Middleware
- [ ] Create middleware for protected routes
- [ ] Protect `/dashboard/**` routes
- [ ] Add authentication check to API routes
- [ ] Update `SignupForm.tsx` to use real API
- [ ] Update dashboard to check auth state
- [ ] Add logout functionality
- [ ] Handle session expiration
- [ ] Test protected routes

#### Phase 4: API Integration
- [ ] Connect `/api/progress/sync` to database
- [ ] Connect `/api/lessons` to database
- [ ] Connect `/api/user` to database
- [ ] Implement progress tracking in database
- [ ] Add user profile management
- [ ] Test all API endpoints with database

#### Deliverables
- ✅ Working authentication system
- ✅ Users can register and log in
- ✅ All user data stored in database
- ✅ Protected routes working
- ✅ Session management working
- ✅ API routes connected to database

#### Files to Create/Modify
**New Files:**
- `lib/database/db.ts` - Database connection
- `lib/database/queries/` - Database queries
- `lib/database/migrations/` - Migration scripts
- `lib/database/seed.ts` - Seeding script
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config

**Modify Files:**
- `app/api/auth/signup/route.ts` - Real auth
- `app/api/auth/login/route.ts` - Real auth
- `components/shared/SignupForm.tsx` - Real registration
- `app/dashboard/**/*` - Auth checks
- `middleware.ts` - Protected routes

---

## 🔴 AGENT 17: Audio Production & Integration
**Priority:** CRITICAL - BLOCKER  
**Status:** Not Started  
**Estimated Time:** 2-4 weeks

### Mission
Source, produce, and integrate Georgian audio files for letters, vocabulary, and phrases.

### Tasks

#### Phase 1: Audio Sourcing Strategy
- [ ] Decide on audio production method:
  - [ ] Option A: Hire native Georgian speaker ($1,000-2,500)
  - [ ] Option B: Use Georgian TTS service ($100-500/year)
  - [ ] Option C: Source from existing resources ($200-1,000)
- [ ] Create audio production brief (pronunciation standards)
- [ ] Set up audio recording environment (if hiring speaker)
- [ ] Create audio recording checklist

#### Phase 2: Letter Audio (33 files)
- [ ] Record/source all 33 Georgian letters:
  - [ ] Vowels (5): ა, ე, ი, ო, უ
  - [ ] Voiced (10): ბ, გ, დ, ვ, ზ, ლ, მ, ნ, რ, ჟ
  - [ ] Aspirated (8): ფ, თ, ს, შ, ხ, ჩ, ც, ჭ
  - [ ] Ejective (6): პ, ტ, კ, ყ, ძ, წ
  - [ ] Special (4): ღ, ჯ, ჰ
- [ ] Quality control: normalize all files
- [ ] Validate all files using `scripts/audio-validator.js`
- [ ] Upload to `public/audio/letters/` or CDN
- [ ] Test playback in app

#### Phase 3: Vocabulary Audio (~500 files)
- [ ] Prioritize A1 vocabulary (most common words)
- [ ] Record A1 vocabulary (~200 words from lessons a1-1 to a1-6)
- [ ] Quality control and normalization
- [ ] Organize by lesson: `public/audio/words/[lessonId]/`
- [ ] Upload and test playback
- [ ] Repeat for A2 vocabulary (~150 words)
- [ ] Repeat for B1+ vocabulary as time permits

#### Phase 4: Phrase Audio (~200 files)
- [ ] Record common phrases from lessons
- [ ] Focus on A1 phrases first
- [ ] Organize by lesson: `public/audio/phrases/[lessonId]/`
- [ ] Quality control and normalization
- [ ] Upload and test playback

#### Phase 5: Minimal Pairs Audio (~50 files)
- [ ] Record minimal pair exercises
- [ ] Include ejective/aspirated/voiced contrasts
- [ ] Organize in `public/audio/min-pairs/`
- [ ] Quality control
- [ ] Test in MinimalPairPractice component

#### Phase 6: Integration & Testing
- [ ] Update audio manifest: `public/audio/manifest.json`
- [ ] Test all audio playback in app
- [ ] Fix any path/naming issues
- [ ] Test fallback TTS for missing files
- [ ] Optimize audio file sizes
- [ ] Set up CDN if needed
- [ ] Test offline playback (PWA)
- [ ] Mobile testing

#### Deliverables
- ✅ All 33 letters have audio
- ✅ All A1 vocabulary has audio (minimum)
- ✅ Common phrases have audio
- ✅ Minimal pairs audio working
- ✅ All audio tested and validated
- ✅ Fallback TTS verified

#### Files to Modify
- `public/audio/letters/*.mp3` - Add audio files
- `public/audio/words/[lessonId]/*.mp3` - Add vocabulary audio
- `public/audio/phrases/[lessonId]/*.mp3` - Add phrase audio
- `public/audio/min-pairs/*.mp3` - Add minimal pairs
- `public/audio/manifest.json` - Update manifest

#### Resources
- Audio production guide: `docs/audio-production-guide.md`
- Validation script: `scripts/audio-validator.js`
- Normalization script: `scripts/audio-normalize.js`
- Audio README: `public/audio/README.md`

---

## 🔴 AGENT 18: Payment & Deployment Launch
**Priority:** CRITICAL - BLOCKER  
**Status:** Not Started  
**Estimated Time:** 1 week

### Mission
Connect Stripe payments fully and deploy to production.

### Tasks

#### Phase 1: Stripe Integration
- [ ] Install Stripe SDK: `npm install stripe`
- [ ] Create Stripe account (or use existing)
- [ ] Add Stripe keys to `.env.local`:
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Uncomment Stripe code in `app/api/checkout/create-session/route.ts`
- [ ] Uncomment Stripe code in `app/api/webhooks/stripe/route.ts`
- [ ] Test checkout flow in Stripe test mode
- [ ] Configure webhook endpoint in Stripe dashboard
- [ ] Test webhook delivery
- [ ] Handle subscription events (created, updated, canceled)
- [ ] Implement billing portal access

#### Phase 2: Subscription Management
- [ ] Create subscription status checks
- [ ] Update user subscription in database on webhook
- [ ] Add subscription renewal logic
- [ ] Handle payment failures
- [ ] Implement grace period for failed payments
- [ ] Test subscription lifecycle

#### Phase 3: Deployment Setup
- [ ] Create Vercel account (or use existing)
- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings:
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `.next`
  - [ ] Install command: `npm install`
- [ ] Set environment variables in Vercel:
  - [ ] Database connection string
  - [ ] NextAuth secret
  - [ ] Stripe keys
  - [ ] All other required env vars
- [ ] Deploy to production
- [ ] Test production build
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates

#### Phase 4: Production Configuration
- [ ] Configure production database
- [ ] Set up database backups
- [ ] Configure CDN for audio files (Cloudflare or AWS)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure error tracking (see Agent 21)
- [ ] Test production site thoroughly
- [ ] Fix any production-only issues

#### Phase 5: Launch Checklist
- [ ] All features tested in production
- [ ] SSL working correctly
- [ ] Payment processing verified
- [ ] Webhooks delivering correctly
- [ ] Email system working (see Agent 19)
- [ ] Analytics tracking (see Agent 21)
- [ ] Error monitoring (see Agent 21)
- [ ] Documentation updated

#### Deliverables
- ✅ Stripe payments working end-to-end
- ✅ Website deployed to production
- ✅ All environment variables configured
- ✅ Monitoring and logging set up
- ✅ Production tested and verified

#### Files to Modify
- `app/api/checkout/create-session/route.ts` - Uncomment Stripe
- `app/api/webhooks/stripe/route.ts` - Uncomment Stripe
- `.env.local` - Add Stripe keys
- `lib/config.ts` - Verify config
- Deployment platform configuration

#### Resources
- Stripe docs: https://stripe.com/docs
- Vercel docs: https://vercel.com/docs

---

## 🟡 AGENT 19: Email & Communication System
**Priority:** HIGH  
**Status:** Not Started  
**Estimated Time:** 3-5 days

### Mission
Set up email communication for user onboarding, receipts, and notifications.

### Tasks

#### Phase 1: Email Service Setup
- [ ] Choose email service:
  - [ ] Resend (recommended, easy Next.js integration)
  - [ ] SendGrid
  - [ ] Postmark
  - [ ] AWS SES
- [ ] Create account and verify domain
- [ ] Install email SDK (e.g., `npm install resend`)
- [ ] Configure SMTP/API in `.env.local`
- [ ] Test email delivery

#### Phase 2: Email Templates
- [ ] Welcome email (on user registration)
- [ ] Email verification email
- [ ] Password reset email
- [ ] Payment receipt email
- [ ] Subscription confirmation email
- [ ] Subscription cancelation email
- [ ] Lesson completion celebration
- [ ] Weekly progress summary (future)

#### Phase 3: Email Integration
- [ ] Create email utility in `lib/utils/email.ts`
- [ ] Integrate with registration flow
- [ ] Integrate with password reset flow
- [ ] Integrate with Stripe webhooks
- [ ] Add email preferences to user model
- [ ] Test all email flows

#### Phase 4: Notification System (Optional)
- [ ] Browser push notifications
- [ ] In-app notification system
- [ ] Email digest preferences

#### Deliverables
- ✅ Email service configured
- ✅ Email templates created
- ✅ Welcome emails sending
- ✅ Receipt emails working
- ✅ Password reset working

#### Files to Create/Modify
**New Files:**
- `lib/utils/email.ts` - Email utilities
- `lib/utils/email-templates/` - Email templates
- `components/emails/` - React email templates (if using React Email)

**Modify Files:**
- `app/api/auth/signup/route.ts` - Send welcome email
- `app/api/webhooks/stripe/route.ts` - Send receipts
- `app/dashboard/page.tsx` - Email preferences

---

## 🟡 AGENT 20: Content Completion & QA
**Priority:** HIGH  
**Status:** Not Started  
**Estimated Time:** 2-3 weeks

### Mission
Complete missing content, standardize quality, and ensure content consistency.

### Tasks

#### Phase 1: Audio Scripts
- [ ] Create audio scripts for all missing lessons
- [ ] Use existing templates from A1 lessons
- [ ] Standardize format across all scripts
- [ ] Add pronunciation emphasis notes
- [ ] Add common mistakes sections
- [ ] Include cultural context

#### Phase 2: Lesson Content Review
- [ ] Review all lessons for completeness
- [ ] Ensure all lessons have:
  - [ ] Video script
  - [ ] Audio script
  - [ ] Vocabulary file
  - [ ] Exercises file
  - [ ] Quiz file
  - [ ] Worksheet (where appropriate)
- [ ] Fix incomplete lessons (C1-4, C1-5, C1-6)
- [ ] Standardize vocabulary format
- [ ] Standardize exercise format

#### Phase 3: Content Quality Assurance
- [ ] Review pronunciation notes consistency
- [ ] Check transliteration accuracy
- [ ] Verify IPA notation accuracy
- [ ] Review example sentences
- [ ] Check cultural context accuracy
- [ ] Proofread all content
- [ ] Native speaker review (recommended)

#### Phase 4: Testing & Validation
- [ ] Load all lessons in app
- [ ] Test all exercise types render correctly
- [ ] Verify all audio references work
- [ ] Check vocabulary displays correctly
- [ ] Test quiz functionality
- [ ] Mobile content testing
- [ ] Fix any rendering issues

#### Deliverables
- ✅ All lessons have complete content
- ✅ All audio scripts created
- ✅ Content standardized and consistent
- ✅ All content tested and validated

#### Files to Create/Modify
**Create:**
- Audio scripts for remaining lessons
- Missing lesson content
- Completed C1 lessons 4-6

**Review/Modify:**
- All lesson content files
- Vocabulary files
- Exercise files
- Quiz files

---

## 🟡 AGENT 21: Analytics & Monitoring
**Priority:** HIGH  
**Status:** Not Started  
**Estimated Time:** 2-3 days

### Mission
Set up analytics, error tracking, and performance monitoring.

### Tasks

#### Phase 1: Error Tracking (Sentry)
- [ ] Create Sentry account
- [ ] Install Sentry: `npm install @sentry/nextjs`
- [ ] Initialize Sentry in `next.config.js`
- [ ] Configure Sentry in `sentry.client.config.ts` and `sentry.server.config.ts`
- [ ] Uncomment Sentry integration in `lib/utils/logger.ts`
- [ ] Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables
- [ ] Test error tracking
- [ ] Set up error alerts
- [ ] Configure error grouping

#### Phase 2: Analytics (Google Analytics or Plausible)
- [ ] Choose analytics:
  - [ ] Google Analytics 4 (free, comprehensive)
  - [ ] Plausible (privacy-focused, paid)
- [ ] Create account
- [ ] Install analytics SDK
- [ ] Add tracking code to `app/layout.tsx`
- [ ] Set up custom events:
  - [ ] User registration
  - [ ] Lesson completion
  - [ ] Payment conversion
  - [ ] Feature usage
- [ ] Test analytics tracking

#### Phase 3: Performance Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up Core Web Vitals tracking
- [ ] Monitor bundle sizes
- [ ] Track API performance
- [ ] Set up performance alerts
- [ ] Dashboard for key metrics

#### Phase 4: Custom Metrics
- [ ] Track lesson completion rates
- [ ] Track user engagement metrics
- [ ] Track conversion funnels
- [ ] Track feature adoption
- [ ] Create analytics dashboard

#### Deliverables
- ✅ Error tracking working
- ✅ Analytics tracking installed
- ✅ Performance monitoring active
- ✅ Custom events tracked
- ✅ Dashboards configured

#### Files to Create/Modify
**Create:**
- `sentry.client.config.ts` - Sentry client config
- `sentry.server.config.ts` - Sentry server config

**Modify:**
- `next.config.js` - Sentry initialization
- `app/layout.tsx` - Analytics code
- `lib/utils/logger.ts` - Uncomment Sentry
- `.env.local` - Add Sentry DSN

---

## 📊 Agent Priority Summary

### Critical Path to Launch (Do First):
1. **Agent 16** (Database + Auth) - Week 1
2. **Agent 17** (Audio) - Week 2-4 (can run parallel)
3. **Agent 18** (Payment + Deploy) - Week 3-4

### High Priority (Do Before Public Launch):
4. **Agent 19** (Email) - Week 3
5. **Agent 20** (Content) - Week 2-5 (on-going)
6. **Agent 21** (Analytics) - Week 4

### Recommended Order:
1. **Week 1:** Agent 16 (Database + Auth) - Must complete first
2. **Week 2:** Agent 17 (Audio - Start sourcing)
3. **Week 2:** Agent 20 (Content - Start on audio scripts)
4. **Week 3:** Agent 18 (Deploy) - Do in parallel with audio
5. **Week 3:** Agent 19 (Email) - Do in parallel
6. **Week 4:** Agent 21 (Analytics) - Final setup
7. **Week 4:** Launch! 🚀

---

## 📋 Success Criteria

Each agent is complete when:
- ✅ All tasks checked off
- ✅ No blocking bugs
- ✅ Tested in production
- ✅ Documentation updated
- ✅ Handoff to next agent clear

---

## 🤝 Agent Coordination

### Communication:
- Update status in this document as tasks complete
- Mark blockers clearly
- Document any approach changes

### Handoff Checklist:
- [ ] All code committed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Status noted in this file
- [ ] Next agent notified

---

Good luck agents! Let's ship this! 🚀🇬🇪
