# Agent Content: Critical Pronunciation & Interactive Learning Fixes

## 🚨 Critical Issue Identified

**Problem:** Users learning Georgian cannot effectively master pronunciation, letter sounds, or practical language skills despite having lesson content.

**Root Causes:**
1. **NO audio files** - Scripts exist but no actual audio recordings
2. **NO interactive pronunciation practice** - Text-to-speech only, no recording/comparison features
3. **NO letter-by-letter pronunciation drills** - Alphabet lessons lack hands-on practice
4. **NO minimal pair exercises** - Critical for mastering ejectives vs aspirated vs voiced
5. **Lack of phonological awareness training** - Jumping straight to words without sound mastery
6. **No production practice** - Users can listen but can't record and compare
7. **Exercises not interactive** - JSON exists but no components to render them
8. **No audio comparison tool** - Can't self-assess pronunciation

---

## 🎯 Mission Statement

Transform the Georgian learning experience from passive content consumption to active, hands-on language acquisition through comprehensive pronunciation training, interactive exercises, and real audio production practice.

---

## 📋 Agent Task List

### **Agent 10: Audio Production & Integration** 🎙️
**Priority:** CRITICAL - BLOCKER  
**Estimated Time:** 2-3 weeks  
**Dependencies:** None

#### 1.1 Audio File Organization & Storage
- [ ] Create directory structure: `public/audio/letters/`, `public/audio/words/`, `public/audio/phrases/`
- [ ] Establish naming convention: `a1-1-let-ა.mp3` (lesson-letter), `a1-1-voc-gamarjoba.mp3` (lesson-vocabulary-word)
- [ ] Document audio specifications: 44.1kHz, 16-bit, mono, MP3 format
- [ ] Create audio asset manifest JSON for easy loading

**Files to Create:**
- `public/audio/manifest.json`
- `lib/utils/audioLoader.ts`
- `lib/utils/audioManifest.ts`

**Files to Modify:**
- None

---

#### 1.2 Letter Pronunciation Audio System
- [ ] Record or source audio for all 33 Georgian letters in isolation
- [ ] Create minimal pair recordings (ბ vs პ vs პ):
  - Voiced-aspirated-ejective triplets
  - Sample pairs for all consonant groups
- [ ] Add IPA pronunciation audio for reference
- [ ] Create letter sequence drills (ა-ე-ი-ო-უ repeated)
- [ ] Build audio files for ejective articulation practice

**Audio Files Needed:**
- All 33 letters isolated: `/audio/letters/ა.mp3` through `/audio/letters/ჰ.mp3`
- Minimal pairs: `/audio/letters/min-pairs/b-p-p.mp3`, `/audio/letters/min-pairs/t-t-t.mp3`, etc.
- Ejective drills: `/audio/letters/ejective-practice.mp3`

**Files to Create:**
- `components/learning/LetterAudioPlayer.tsx`
- `components/learning/MinimalPairPlayer.tsx`
- `lib/hooks/useLetterAudio.ts`

**Files to Modify:**
- `content/lessons/a1/a1-1/vocabulary.json` (add audioUrl to each letter)

---

#### 1.3 Vocabulary Audio Integration
- [ ] Record audio for all vocabulary items across all lessons
- [ ] Create sentence audio for example sentences
- [ ] Record slow/normal pace versions
- [ ] Integrate audio playback into existing LessonPlayer vocabulary component
- [ ] Add repeat-after-me audio practice

**Audio Files Needed:**
- Per lesson: `/audio/lessons/a1/a1-1/gamarjoba.mp3`
- Per vocabulary: Standard and slow versions
- Per sentence: Example sentences at natural pace

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx` (already has audio support via text-to-speech)
- `components/learning/VocabularyFlashcards.tsx` (add audio button)

**Files to Create:**
- `components/learning/NativeAudioPlayer.tsx` (replacement/enhancement for TTS)

---

### **Agent 11: Pronunciation Practice System** 🗣️
**Priority:** CRITICAL  
**Estimated Time:** 3-4 weeks  
**Dependencies:** Agent 10 (for audio files)

#### 2.1 Audio Recording Infrastructure
- [ ] Implement Web Audio API recording
- [ ] Add browser permission handling for microphone
- [ ] Create audio visualization (waveform display)
- [ ] Implement recording playback for user's own voice
- [ ] Add recording duration limits and controls

**Files to Create:**
- `components/learning/AudioRecorder.tsx`
- `lib/hooks/useAudioRecording.ts`
- `lib/utils/audioRecorder.ts`
- `components/shared/WaveformDisplay.tsx`

**Files to Modify:**
- None (new system)

---

#### 2.2 Native Audio Comparison Tool
- [ ] Create side-by-side comparison player
- [ ] Implement synchronized playback (user vs native)
- [ ] Add audio overlay visualization
- [ ] Create A/B switching interface
- [ ] Build confidence scoring UI (user rates themselves)

**Files to Create:**
- `components/learning/AudioComparison.tsx`
- `components/learning/ComparisonWaveform.tsx`
- `lib/hooks/useAudioComparison.ts`

**Files to Modify:**
- None

---

#### 2.3 Pronunciation Feedback System
- [ ] Implement acoustic analysis (if feasible):
  - Pitch contour analysis
  - Timing comparison
  - Energy level analysis
- [ ] Create visual feedback (waveform, spectrogram if possible)
- [ ] Build pronunciation checklist per letter/sound
- [ ] Add detailed feedback descriptions (e.g., "Closer throat pop needed for კ")

**Files to Create:**
- `components/learning/PronunciationFeedback.tsx`
- `lib/utils/audioAnalysis.ts` (research feasibility)
- `lib/data/pronunciationTips.ts` (manual feedback database)

**Files to Modify:**
- None

---

#### 2.4 Letter Drill System
- [ ] Create interactive letter pronunciation drill
- [ ] Build minimal pair discrimination exercises
- [ ] Add minimal pair production practice
- [ ] Create phonological awareness training
- [ ] Implement "listen and identify" exercises

**Files to Create:**
- `components/learning/LetterDrill.tsx`
- `components/learning/MinimalPairPractice.tsx`
- `components/learning/SoundDiscrimination.tsx`
- `lib/utils/phonologyExercises.ts`

**Files to Modify:**
- `app/dashboard/lessons/[id]/page.tsx` (integrate pronunciation drills)

---

### **Agent 12: Interactive Exercise System** 🎮
**Priority:** HIGH  
**Estimated Time:** 3-4 weeks  
**Dependencies:** Agent 10 (audio files)

#### 3.1 Exercise Renderer Components
- [ ] Build `MultipleChoiceExercise` component
- [ ] Build `FillBlankExercise` component
- [ ] Build `MatchingExercise` component
- [ ] Build `AudioExercise` component (listen and respond)
- [ ] Build `WritingExercise` component
- [ ] Build `TranslationExercise` component
- [ ] Create unified `ExercisePlayer` that routes to correct component

**Files to Create:**
- `components/exercises/MultipleChoiceExercise.tsx`
- `components/exercises/FillBlankExercise.tsx`
- `components/exercises/MatchingExercise.tsx`
- `components/exercises/AudioExercise.tsx`
- `components/exercises/WritingExercise.tsx`
- `components/exercises/TranslationExercise.tsx`
- `components/exercises/ExercisePlayer.tsx`
- `lib/hooks/useExercises.ts`
- `lib/utils/exerciseTypes.ts`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx` (add exercises tab)
- `app/dashboard/lessons/[id]/page.tsx` (integrate ExercisePlayer)

---

#### 3.2 Exercise Data Integration
- [ ] Load exercises from `exercises.json` files
- [ ] Create exercise validation system
- [ ] Build answer checking logic
- [ ] Implement scoring system
- [ ] Add progress tracking per exercise
- [ ] Create review mode (show mistakes)

**Files to Create:**
- `lib/content/exerciseLoader.ts`
- `lib/utils/exerciseScoring.ts`
- `lib/hooks/useExerciseProgress.ts`

**Files to Modify:**
- `lib/content/loader.ts` (add exercise loading)
- `lib/content/types.ts` (validate Exercise interfaces)

---

#### 3.3 Exercise Analytics & Feedback
- [ ] Track exercise completion rates
- [ ] Identify weak areas automatically
- [ ] Generate personalized practice recommendations
- [ ] Show detailed explanations after incorrect answers
- [ ] Create exercise performance dashboard

**Files to Create:**
- `components/learning/ExerciseAnalytics.tsx`
- `lib/utils/exerciseAnalytics.ts`
- `lib/hooks/useExercisePerformance.ts`

**Files to Modify:**
- `app/dashboard/page.tsx` (add exercise analytics section)

---

### **Agent 13: Enhanced Phonics & Phonology Foundation** 📚
**Priority:** CRITICAL  
**Estimated Time:** 2-3 weeks  
**Dependencies:** Agents 10, 11, 12

#### 4.1 A1 Lesson Restructuring
- [ ] Split A1-1 into smaller, focused lessons:
  - A1-1a: Vowels only (ა, ე, ი, ო, უ)
  - A1-1b: Familiar consonants (ბ, გ, დ, ვ, ზ, ლ, მ, ნ, რ, ს, ფ, ქ, ჰ)
  - A1-1c: Alphabet overview and handwriting
- [ ] Add dedicated ejective lesson before words
- [ ] Create standalone phonological awareness lessons
- [ ] Add "sound playground" interactive component

**Files to Create:**
- `components/learning/SoundPlayground.tsx`
- `components/learning/PhonologyAwareness.tsx`
- `content/lessons/a1/a1-1a-alphabet-vowels/` (new lesson folder)
- `content/lessons/a1/a1-1b-alphabet-consonants-familiar/`
- Update course structure

**Files to Modify:**
- `lib/data/courseStructure.ts` (update lesson IDs and order)
- `content/lessons/a1/a1-1/` (split or reorganize)

---

#### 4.2 Pronunciation Bootcamp Module
- [ ] Create intensive pronunciation bootcamp (3-5 lessons)
- [ ] Focus on common learner mistakes
- [ ] Build Georgian-specific articulatory guidance
- [ ] Create mouth position animations/illustrations
- [ ] Add self-assessment rubrics

**Files to Create:**
- `components/learning/PronunciationBootcamp.tsx`
- `components/learning/MouthPositionGuide.tsx`
- `content/lessons/a1/a1-pronunciation-bootcamp/` (new module)
- `lib/data/pronunciationGuidance.ts` (articulatory descriptions)

**Files to Modify:**
- `lib/data/courseStructure.ts` (add bootcamp module)

---

#### 4.3 Spaced Repetition for Phonology
- [ ] Apply spaced repetition to letter recognition
- [ ] Create phonological rules flashcards
- [ ] Build "sounds of the day" feature
- [ ] Implement gradual consonant cluster introduction

**Files to Create:**
- `components/learning/PhonologySRS.tsx`
- `lib/utils/phonologySRS.ts`
- `lib/data/phonologicalRules.ts`

**Files to Modify:**
- Existing SRS components (if any)

---

### **Agent 14: Content Production & Quality Assurance** 📝
**Priority:** MEDIUM-HIGH  
**Estimated Time:** Ongoing  
**Dependencies:** None

#### 5.1 Audio Production Workflow
- [ ] Establish recording process
- [ ] Create quality checklist for audio files
- [ ] Implement audio normalization standards
- [ ] Build audio validation tools
- [ ] Create audio versioning system

**Files to Create:**
- `scripts/audio-validator.js`
- `scripts/audio-normalize.js`
- `docs/audio-production-guide.md`

**Files to Modify:**
- None

---

#### 5.2 Content Review & Enhancement
- [ ] Review all existing video scripts for clarity
- [ ] Add pronunciation emphasis to all scripts
- [ ] Create pronunciation notes for all vocabulary
- [ ] Enhance exercises with audio prompts
- [ ] Add "common mistakes" sections to each lesson

**Files to Modify:**
- All `content/lessons/*/video-script.md` files
- All `content/lessons/*/vocabulary.json` files
- All `content/lessons/*/exercises.json` files

---

#### 5.3 Cultural Context Integration
- [ ] Add pronunciation cultural notes (formal vs informal)
- [ ] Create regional accent awareness content
- [ ] Add pronunciation etiquette (when to use formal)
- [ ] Build cultural pronunciation scenarios

**Files to Create:**
- `content/resources/cultural-guides/pronunciation-etiquette.md`
- `components/learning/CulturalPronunciation.tsx`

**Files to Modify:**
- None

---

### **Agent 15: Mobile Pronunciation Experience** 📱
**Priority:** HIGH  
**Estimated Time:** 2 weeks  
**Dependencies:** Agents 10, 11

#### 6.1 Mobile Audio Optimization
- [ ] Optimize audio file sizes for mobile
- [ ] Implement progressive audio loading
- [ ] Add offline audio caching
- [ ] Create mobile-friendly audio controls
- [ ] Optimize recording quality for mobile devices

**Files to Create:**
- `lib/utils/mobileAudio.ts`
- `lib/hooks/useOfflineAudio.ts`

**Files to Modify:**
- `components/learning/AudioRecorder.tsx`
- `lib/utils/audioLoader.ts`

---

#### 6.2 Touch-Friendly Pronunciation Tools
- [ ] Large playback buttons for mobile
- [ ] Swipe gestures for audio comparison
- [ ] Touch-and-hold for slow playback
- [ ] Mobile-optimized waveform display
- [ ] Thumb-friendly recording controls

**Files to Modify:**
- `components/learning/AudioComparison.tsx`
- `components/shared/WaveformDisplay.tsx`
- `components/learning/AudioRecorder.tsx`

---

#### 6.3 PWA Audio Support
- [ ] Add audio to service worker cache
- [ ] Implement background audio playback
- [ ] Add audio notifications
- [ ] Create offline pronunciation practice mode

**Files to Modify:**
- Service worker configuration
- PWA manifest

---

## 🎯 Success Criteria

### Critical Success Metrics:
- ✅ **100%** of letters have native audio recordings
- ✅ **100%** of vocabulary items have audio
- ✅ Recording functionality works on all modern browsers
- ✅ Users can complete pronunciation exercises independently
- ✅ Minimal pair discrimination exercises functional
- ✅ Exercise JSON files render as interactive components
- ✅ Mobile audio performance < 2s load time
- ✅ All A1 lessons include pronunciation drills

### Quality Benchmarks:
- Audio quality: Clear, normalized, no background noise
- Interactive exercises: < 100ms response time
- Recording playback: No latency issues
- Mobile experience: Touch targets ≥ 44px
- Accessibility: Keyboard navigation fully functional
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 📊 Implementation Priority Order

1. **Week 1-2:** Agent 10 - Audio Integration (blocker)
2. **Week 3-5:** Agent 11 - Pronunciation Practice (critical)
3. **Week 6-7:** Agent 12 - Interactive Exercises (high priority)
4. **Week 8-10:** Agent 13 - Phonics Foundation (critical restructure)
5. **Week 11-12:** Agent 14 - Content Enhancement (ongoing)
6. **Week 13-14:** Agent 15 - Mobile Optimization (high priority)

---

## 🔗 Dependencies & Integration

### Existing Components to Enhance:
- `components/dashboard/LessonPlayer.tsx` - Add exercises tab, improve audio
- `components/learning/VocabularyFlashcards.tsx` - Add audio playback
- `lib/utils/text-to-speech.ts` - Enhance or replace with native audio
- `lib/content/loader.ts` - Add exercise loading
- `lib/data/courseStructure.ts` - Update lesson order

### New Systems to Build:
- Complete audio asset management system
- Recording and playback infrastructure
- Exercise rendering engine
- Pronunciation feedback pipeline
- Mobile audio optimization layer

---

## 💡 Key Design Principles

1. **Sound Before Symbol:** Students master sounds before letters, letters before words
2. **Production Before Recognition:** Ability to produce sounds must be tested
3. **Immediate Feedback:** Pronunciation corrections given instantly
4. **Progressive Difficulty:** Simple isolations → complex clusters
5. **Cultural Context:** Pronunciation linked to social situations
6. **Self-Directed:** Users can practice independently
7. **Gamified:** Progress visible, achievements unlock new content

---

## 📚 Resources Needed

### Audio Assets:
- 33 letter recordings (isolated)
- 100+ minimal pair recordings
- 500+ vocabulary recordings
- 200+ sentence recordings
- 50+ phonological drill recordings

### Visual Assets:
- Mouth position diagrams for all sounds
- Articulatory placement illustrations
- IPA chart for Georgian
- Minimal pair comparison charts
- Pronunciation tips infographics

### Third-Party Tools (Optional):
- AI pronunciation scoring API (if affordable)
- Spectrogram visualization library
- Advanced audio analysis tools

---

## 🚀 Quick Wins (Can Start Immediately)

1. **Create audio directory structure** (1 hour)
2. **Write audio manifest JSON** (2 hours)
3. **Build basic AudioPlayer component** (4 hours)
4. **Create SingleChoiceExercise component** (6 hours)
5. **Add audio buttons to existing vocabulary** (2 hours)

**These 5 items can be completed in 1-2 days and immediately improve user experience.**

---

## ✅ Definition of Done

- [ ] All Georgian letters have clickable audio playback
- [ ] Users can record their pronunciation for every letter and word
- [ ] Native audio comparison works flawlessly
- [ ] All exercise types render and function correctly
- [ ] Mobile audio experience is smooth and responsive
- [ ] Pronunciation bootcamp module is complete
- [ ] Minimal pair exercises identify and produce distinctions
- [ ] A1 lessons restructured for sound-first learning
- [ ] All vocabulary includes audio
- [ ] PWA supports offline pronunciation practice
- [ ] Analytics track pronunciation improvement over time
- [ ] Zero accessibility violations in pronunciation tools
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- [ ] Load time < 2s for all audio features
- [ ] User testing confirms pronunciation improvement

---

## 📝 Notes

- **Audio Sourcing:** Consider hiring native Georgian speaker for recordings or using existing Georgian TTS if quality is acceptable
- **Browser Permissions:** Plan for mic permission UX flow
- **Storage:** Audio files will be large - plan CDN strategy
- **Offline Support:** Essential for mobile users without reliable data
- **Gradual Rollout:** Can ship features incrementally rather than all at once
- **User Privacy:** Audio recordings should be local-only unless explicitly uploaded for feedback

---

**Previous Agents:** 1-9 (All Complete)  
**Current Focus:** Agents 10-15 (Critical Content Fixes)  
**Next Phase:** Continued enhancement and optimization

