# MVP Agent Assignment Plan
**Goal:** Beautiful, functional MVP - NOT commercial ready  
**Time:** 2-3 weeks  
**Focus:** Remove critical blockers only

---

## 🎯 **MVP Definition**

Your app should be:
- ✅ Users can sign up and log in
- ✅ Users can take lessons
- ✅ Audio works (preferably native, TTS acceptable as fallback)
- ✅ Exercises are interactive and functional
- ✅ Looks beautiful and professional
- ✅ Works on mobile and desktop

NOT required for MVP:
- ❌ Real payment processing (can use demo mode)
- ❌ Perfect audio quality (TTS fallback acceptable)
- ❌ Complete all lessons (sample lessons sufficient)
- ❌ Email system (nice to have)
- ❌ Advanced analytics
- ❌ Deployment to production (localhost acceptable)

---

## 🔴 **REQUIRED AGENTS FOR MVP**

### **AGENT 16: Database & Authentication**
**Priority:** 🔴 CRITICAL - MUST HAVE  
**Time:** 3-5 days  
**Why:** Without this, you can't have real users

**Simplified Scope for MVP:**
- [ ] Set up database (Supabase recommended - easiest setup)
- [ ] Create minimal schema:
  - [ ] Users table
  - [ ] User progress table
  - [ ] Lessons table (can start with sample lessons)
- [ ] Install NextAuth.js
- [ ] Set up basic email/password auth
- [ ] Make dashboard protected
- [ ] Test signup and login flow

**Skip for MVP:**
- Email verification (optional)
- Password reset (can add later)
- Complex user profiles
- Subscription tables (not needed for MVP)

**Key Files:**
- Set up Supabase account (5 minutes)
- `lib/database/db.ts` - Database connection
- `app/api/auth/[...nextauth]/route.ts` - Auth config
- Update `SignupForm.tsx` to use real auth

---

### **AGENT 17: Audio System**
**Priority:** 🔴 CRITICAL - MUST HAVE  
**Time:** 3-7 days  
**Why:** Core feature of your app

**Simplified Scope for MVP:**
**Option A: Quick TTS Solution (RECOMMENDED for MVP)**
- [ ] Keep existing TTS fallback system (already works!)
- [ ] Ensure all audio buttons trigger TTS correctly
- [ ] Test that audio playback works in all components:
  - LetterAudioPlayer
  - NativeAudioPlayer
  - MinimalPairPractice
  - Flashcards
  - Lesson vocabulary
- [ ] Polish audio player UI
- [ ] Test mobile audio playback

**Option B: Add Real Audio (Better Quality)**
If you have 1-2 days extra:
- [ ] Record/source just 33 Georgian letters
- [ ] Record 50 most common words
- [ ] Record 20 common phrases
- [ ] Upload to `public/audio/`
- [ ] Test playback

**Skip for MVP:**
- All vocabulary audio (TTS is fine)
- All phrase audio (TTS is fine)
- Minimal pair audio (TTS is fine)
- Perfect audio quality

**Key Insight:** Your TTS fallback already works! You can launch MVP with TTS and add native audio later.

---

### **AGENT 20: Content Quality**
**Priority:** 🟡 IMPORTANT  
**Time:** 2-3 days  
**Why:** Need working lessons to demo

**Simplified Scope for MVP:**
- [ ] Ensure 3-5 sample lessons are complete and functional:
  - [ ] A1-1 (Alphabet)
  - [ ] A1-2 (Stop consonants)
  - [ ] Pronunciation Bootcamp
  - [ ] Any 2 more A1 lessons
- [ ] Verify all lesson data loads correctly:
  - [ ] Video scripts render
  - [ ] Vocabulary displays
  - [ ] Exercises work
  - [ ] Quizzes work
- [ ] Test lesson completion flow
- [ ] Fix any broken content

**Skip for MVP:**
- Complete all 33 lessons
- Perfect all audio scripts
- Standardize everything
- Complete C1 lessons

**Key Insight:** You only need enough lessons to demonstrate the platform works. 3-5 good lessons > 33 incomplete lessons.

---

### **Optional: AGENT 21 Lite**
**Priority:** 🟢 NICE TO HAVE  
**Time:** 1 day  
**Why:** Help catch bugs

**Simplified Scope for MVP:**
- [ ] Install Sentry (5 minutes)
- [ ] Uncomment in logger.ts
- [ ] Add basic error tracking
- [ ] Test error logging works

**Skip for MVP:**
- Google Analytics
- Custom events
- Performance monitoring
- Complex dashboards

---

## 🎯 **MVP Launch Plan**

### **Week 1: Foundation**
**Days 1-3:** Agent 16 (Database + Auth)
- Set up Supabase
- Install NextAuth
- Get authentication working
- Test signup/login

**Days 4-5:** Agent 17 Option A (Audio TTS)
- Test all audio components with TTS
- Fix any broken audio buttons
- Polish audio player UI
- Mobile testing

**Weekend:** Agent 20 (Content)
- Pick 3-5 best lessons
- Ensure they load correctly
- Test lesson flow end-to-end
- Fix any bugs

### **Week 2: Polish**
**Days 1-2:** Fix bugs
- Fix any issues discovered
- Improve UX based on testing
- Add nice-to-have features if time

**Days 3-4:** Agent 21 Lite
- Set up Sentry
- Add error tracking
- Test everything again

**Days 5-7:** Final polish
- Desktop testing (all browsers)
- Mobile testing (iOS + Android)
- Fix any visual issues
- Improve animations
- Prepare demo video/notes

### **Weekend:** Demo Ready! 🎉

---

## 📋 **MVP Success Criteria**

App is MVP ready when you can demonstrate:
- ✅ User can visit homepage
- ✅ User can click "Sign Up" and create account
- ✅ User can log in
- ✅ User lands on dashboard
- ✅ User can navigate to lessons
- ✅ User can take a lesson from start to finish:
  - Video/script loads
  - Vocabulary displays
  - Audio buttons work (TTS is fine)
  - Exercises are interactive
  - Quiz functions
  - Lesson marks as complete
- ✅ Progress tracking updates
- ✅ Pronunciation practice works
- ✅ Mobile experience is smooth
- ✅ No critical bugs visible
- ✅ UI looks polished and professional

---

## 🚫 **What to SKIP for MVP**

### Not needed for MVP:
- ❌ Stripe payment integration
- ❌ Real email system
- ❌ Complete audio library
- ❌ All 33 lessons complete
- ❌ Production deployment
- ❌ Advanced analytics
- ❌ Email notifications
- ❌ Subscription management
- ❌ Performance optimization (beyond basics)
- ❌ SEO perfection
- ❌ Accessibility audit
- ❌ Multi-language support
- ❌ Advanced gamification
- ❌ Complex reporting

### Add later when commercializing:
- Payment processing
- Production hosting
- Full audio production
- Complete lesson library
- Email automation
- Marketing features
- Advanced analytics
- Performance optimization

---

## 💡 **MVP Strategy Recommendation**

### **Recommended Approach:**

1. **Week 1:** Get core functionality working
   - Agent 16: Auth
   - Agent 17: Audio (TTS only)
   - Agent 20: 3-5 complete lessons

2. **Week 2:** Polish and test
   - Fix bugs
   - Improve UX
   - Add error tracking
   - Mobile testing

3. **Demo + Feedback:** 
   - Show to 5-10 potential users
   - Collect feedback
   - Identify must-have features

4. **Then iterate based on feedback:**
   - Add features users request
   - Fix pain points
   - Improve based on real usage

### **Why This Works:**
- You validate the concept quickly
- You get user feedback before over-engineering
- You avoid spending time on unused features
- You can prove value to stakeholders
- You decide what to build next based on data

---

## 🎯 **Specific Agent Assignments**

### AGENT 16: Database + Auth (3-5 days)
**Start here!** Without this, nothing else matters.

**Tasks:**
1. Create Supabase account (free tier is fine)
2. Create database tables
3. Install NextAuth.js
4. Configure authentication
5. Test signup and login
6. Protect dashboard routes

**Files:**
- New: `lib/database/db.ts`
- New: `app/api/auth/[...nextauth]/route.ts`
- Modify: `SignupForm.tsx`, `app/dashboard/**`

---

### AGENT 17: Audio (1-3 days)
**Recommendation:** Use TTS fallback for MVP

**Tasks:**
1. Test all audio components with TTS
2. Fix any broken buttons
3. Ensure mobile works
4. Optional: Add 33 letter audio files

**Files:**
- Test: `components/learning/*Audio*.tsx`
- Test: `components/dashboard/LessonPlayer.tsx`
- Optional: Add files to `public/audio/letters/`

---

### AGENT 20: Content (2-3 days)
**Focus:** Make 3-5 lessons perfect

**Tasks:**
1. Pick best 3-5 lessons to showcase
2. Ensure they load correctly
3. Test all components work
4. Fix any broken content
5. Polish UX

**Files:**
- Review: `content/lessons/a1/*`
- Test: LessonPlayer component
- Fix: Any broken lesson data

---

### AGENT 21 Lite (1 day)
**Optional but recommended**

**Tasks:**
1. Install Sentry
2. Configure error tracking
3. Test error logging

**Files:**
- Modify: `lib/utils/logger.ts`
- New: Sentry config files

---

## 📊 **Time Estimate**

**Minimum MVP (just functional):**
- Agent 16: 3 days
- Agent 17 (TTS): 1 day
- Agent 20: 2 days
- **Total: 6 days of focused work**

**Nice MVP (polished):**
- Agent 16: 5 days
- Agent 17 (real audio): 3 days
- Agent 20: 3 days
- Agent 21 Lite: 1 day
- **Total: 12 days of focused work**

---

## 🎯 **My Recommendation**

**Do this for MVP:**
1. ✅ **Agent 16** (Auth) - MUST DO
2. ✅ **Agent 17** (TTS only) - Already works, just test
3. ✅ **Agent 20** (3-5 lessons) - Pick your best
4. ✅ **Agent 21 Lite** (Sentry) - 1 hour setup

**Skip for now:**
- ❌ Stripe/Commercial features
- ❌ Production deployment
- ❌ Full audio library
- ❌ All 33 lessons
- ❌ Email automation
- ❌ Advanced features

**Total time: 1-2 weeks for beautiful, functional MVP**

---

## 🚀 **After MVP**

Once MVP is working and you have user feedback:
1. Add what users actually want
2. Add payment processing when ready to monetize
3. Record native audio based on user demand
4. Complete remaining lessons based on usage data
5. Deploy to production when you have revenue

**This is the lean startup approach: MVP → Feedback → Iterate → Scale**

---

Good luck! Focus on Agent 16 first, then worry about the rest. 🎯🇬🇪
