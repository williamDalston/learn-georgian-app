# Agent F: Learning Tools & Vocabulary
## UX/UI Improvements - Assignment F

**Agent:** F  
**Focus Area:** Vocabulary tools, practice tools, study planner  
**Estimated Time:** 2-3 weeks  
**Priority:** Phase 3 (Medium-High Priority)

---

## 🎯 Mission

Create comprehensive learning tools including vocabulary flashcards, spaced repetition, practice modes, and study planning features to enhance the learning experience.

---

## 📋 Task List

### 1. Vocabulary Tools 📚

**Goal:** Help users master vocabulary through interactive tools

#### 1.1 Vocabulary Flashcards
- [ ] Create interactive flashcard system
- [ ] Front: Georgian word (with transliteration)
- [ ] Back: Translation, pronunciation, example sentence
- [ ] Flip animation
- [ ] Swipe gestures: right (know it), left (study more)
- [ ] Mark cards as "mastered" or "needs review"
- [ ] Progress tracking per word
- [ ] Filter by lesson, difficulty, or mastery status
- [ ] Keyboard shortcuts (space to flip, arrow keys to navigate)

**Files to Create:**
- `components/learning/VocabularyFlashcards.tsx`
- `components/learning/Flashcard.tsx`
- `lib/hooks/useFlashcards.ts`
- `lib/utils/flashcardLogic.ts`

**Files to Modify:**
- Vocabulary components

#### 1.2 Spaced Repetition
- [ ] Implement spaced repetition algorithm (SM-2 or similar)
- [ ] Schedule reviews based on performance
- [ ] "Review Now" queue for words due
- [ ] Show when words are next due
- [ ] Adaptive scheduling based on user performance
- [ ] Track review history
- [ ] Visual calendar showing review schedule

**Files to Create:**
- `lib/utils/spacedRepetition.ts`
- `lib/hooks/useSpacedRepetition.ts`
- `components/learning/SpacedRepetition.tsx`

**Files to Modify:**
- Vocabulary flashcard components

#### 1.3 Pronunciation Practice
- [ ] Record pronunciation feature
- [ ] Playback comparison with native speaker
- [ ] Visual waveform comparison
- [ ] Score pronunciation accuracy (if possible)
- [ ] Practice mode: repeat after audio
- [ ] Slow playback option
- [ ] IPA pronunciation guide
- [ ] Save pronunciation attempts

**Files to Create:**
- `components/learning/PronunciationPractice.tsx`
- `components/learning/AudioRecorder.tsx`
- `lib/utils/audioComparison.ts`
- `lib/hooks/useAudioRecording.ts`

**Files to Modify:**
- Vocabulary components

#### 1.4 Vocabulary Search
- [ ] Quick search through all learned vocabulary
- [ ] Search by:
  - Georgian word
  - Transliteration
  - English translation
  - Lesson
- [ ] Filter by:
  - Part of speech
  - Difficulty
  - Mastery status
  - Date learned
- [ ] Auto-complete suggestions
- [ ] Recent searches
- [ ] Favorite words

**Files to Create:**
- `components/learning/VocabularySearch.tsx`
- `lib/utils/vocabularySearch.ts`
- `lib/hooks/useVocabularySearch.ts`

**Files to Modify:**
- Dashboard (add search to navigation)

#### 1.5 Vocabulary Categories
- [ ] Organize vocabulary by:
  - Lesson
  - Topic (greetings, food, travel, etc.)
  - Difficulty
  - Part of speech
  - Custom tags
- [ ] Category-based study sessions
- [ ] Category statistics (words mastered per category)
- [ ] Custom category creation
- [ ] Category-based flashcards

**Files to Create:**
- `components/learning/VocabularyCategories.tsx`
- `components/learning/CategoryManager.tsx`
- `lib/utils/vocabularyCategories.ts`

**Files to Modify:**
- Vocabulary components

---

### 2. Practice Tools 🎯

**Goal:** Provide varied practice modes and exercises

#### 2.1 Random Practice Mode
- [ ] Mix exercises from completed lessons
- [ ] Random selection algorithm
- [ ] Choose exercise types to include:
  - Multiple choice
  - Fill in the blank
  - Translation
  - Matching
- [ ] Set number of questions (10, 20, 50)
- [ ] Track practice scores separately
- [ ] Show progress during session
- [ ] Review mistakes at end

**Files to Create:**
- `components/learning/RandomPractice.tsx`
- `components/learning/PracticeSession.tsx`
- `lib/utils/practiceGenerator.ts`
- `lib/hooks/usePracticeSession.ts`

**Files to Modify:**
- Exercise components
- Dashboard (add practice mode link)

#### 2.2 Weak Area Focus
- [ ] Identify weak areas from exercise history
- [ ] Practice mode focused on weak topics:
  - Grammar concepts with low scores
  - Exercise types with many mistakes
  - Specific lessons that need review
- [ ] Personalized practice sets
- [ ] Track improvement over time
- [ ] Visual progress indicators
- [ ] Suggest when weak areas are improved

**Files to Create:**
- `components/learning/WeakAreaPractice.tsx`
- `lib/utils/weakAreaIdentification.ts`

**Files to Modify:**
- Practice components
- Exercise tracking (may need to enhance)

#### 2.3 Timed Practice
- [ ] Set time limits for practice sessions:
  - 5 minutes (quick review)
  - 15 minutes (focused practice)
  - 30 minutes (extended session)
- [ ] Timer display with visual countdown
- [ ] Option to extend time
- [ ] Score based on speed and accuracy
- [ ] Time pressure mode (harder difficulty)
- [ ] Relaxed mode (no time limit)
- [ ] Show time per question statistics

**Files to Create:**
- `components/learning/TimedPractice.tsx`
- `components/shared/PracticeTimer.tsx`
- `lib/hooks/usePracticeTimer.ts`

**Files to Modify:**
- Practice components

#### 2.4 Progress Tracking
- [ ] Track improvement over time per exercise type
- [ ] Charts showing:
  - Score trends
  - Time spent practicing
  - Accuracy improvements
  - Weak area improvements
- [ ] Compare practice vs. lesson performance
- [ ] Practice statistics dashboard
- [ ] Export practice data

**Files to Create:**
- `components/learning/PracticeStatistics.tsx`
- `components/learning/PracticeCharts.tsx`
- `lib/utils/practiceAnalytics.ts`

**Files to Modify:**
- Practice components

---

### 3. Study Tools 📅

**Goal:** Help users plan and track their study sessions

#### 3.1 Study Planner
- [ ] Create study schedule:
  - Daily goals
  - Weekly goals
  - Monthly goals
- [ ] Drag-and-drop calendar interface
- [ ] Suggested study times based on patterns
- [ ] Block out unavailable times
- [ ] Recurring study sessions
- [ ] Sync with calendar (optional)
- [ ] Visual calendar view
- [ ] Progress toward schedule goals

**Files to Create:**
- `components/learning/StudyPlanner.tsx`
- `components/learning/StudyCalendar.tsx`
- `components/learning/ScheduleEditor.tsx`
- `lib/hooks/useStudySchedule.ts`
- `lib/utils/scheduleManager.ts`

**Files to Modify:**
- Dashboard (add planner widget)

#### 3.2 Pomodoro Timer
- [ ] Built-in Pomodoro timer (25 min work, 5 min break)
- [ ] Customizable intervals:
  - Work duration (15, 25, 45 min)
  - Short break (5, 10 min)
  - Long break (15, 30 min)
- [ ] Visual timer with progress ring
- [ ] Sound notifications (optional)
- [ ] Auto-start next session
- [ ] Track Pomodoro sessions
- [ ] Statistics (sessions completed, time focused)

**Files to Create:**
- `components/learning/PomodoroTimer.tsx`
- `components/shared/CircularTimer.tsx`
- `lib/hooks/usePomodoro.ts`

**Files to Modify:**
- Lesson player (add timer option)
- Dashboard (add timer widget)

#### 3.3 Study Reminders
- [ ] Push notifications for study time
- [ ] Browser notifications (if PWA)
- [ ] Customizable reminder times
- [ ] Reminder messages:
  - "Time for your daily practice!"
  - "Don't break your streak!"
  - "New lesson available"
- [ ] Snooze option
- [ ] Reminder preferences

**Files to Create:**
- `components/settings/ReminderSettings.tsx`
- `lib/utils/reminderManager.ts`

**Files to Modify:**
- Settings (if exists)
- May need PWA notifications from Agent E

#### 3.4 Study Statistics
- [ ] Detailed stats on study habits:
  - Daily study time
  - Study session frequency
  - Most productive days/times
  - Longest study session
  - Total study time
  - Average session duration
- [ ] Visual charts and graphs
- [ ] Compare weeks/months
- [ ] Study streak visualization
- [ ] Export statistics

**Files to Create:**
- `components/learning/StudyStatistics.tsx`
- `components/learning/StudyCharts.tsx`
- `lib/utils/studyAnalytics.ts`

**Files to Modify:**
- Dashboard
- Progress tracker (enhance)

---

### 4. Additional Learning Features 🎓

#### 4.1 Vocabulary Review Sessions
- [ ] Scheduled vocabulary review
- [ ] Review queue based on spaced repetition
- [ ] Quick review mode (5-10 words)
- [ ] Extended review mode (all words)
- [ ] Review statistics
- [ ] Daily review goal

**Files to Create:**
- `components/learning/VocabularyReview.tsx`

**Files to Modify:**
- Vocabulary components

#### 4.2 Exercise Collections
- [ ] Create custom exercise collections
- [ ] Save favorite exercises
- [ ] Share exercise collections (if applicable)
- [ ] Collection-based practice
- [ ] Progress per collection

**Files to Create:**
- `components/learning/ExerciseCollections.tsx`
- `lib/hooks/useExerciseCollections.ts`

**Files to Modify:**
- Exercise components

#### 4.3 Learning Paths
- [ ] Create custom learning paths
- [ ] Different paths for different goals:
  - Travel-focused
  - Business-focused
  - Academic-focused
- [ ] Path recommendations
- [ ] Switch between paths
- [ ] Path completion tracking

**Files to Create:**
- `components/learning/LearningPaths.tsx`
- `lib/utils/learningPaths.ts`

**Files to Modify:**
- Dashboard
- Course structure (may need to enhance)

---

## 🎨 Design Considerations

- Flashcard interface should be clean and focused
- Practice modes should be clearly differentiated
- Study planner should be easy to use and flexible
- Statistics should be visual and easy to understand
- All tools should work well on mobile and desktop
- Keyboard shortcuts should be available for power users
- Progress should be clearly visible

---

## ✅ Definition of Done

- [ ] Vocabulary flashcards fully functional
- [ ] Spaced repetition algorithm implemented
- [ ] Pronunciation practice with recording
- [ ] Vocabulary search working
- [ ] Vocabulary categories implemented
- [ ] Random practice mode functional
- [ ] Weak area practice identifying and practicing weak areas
- [ ] Timed practice with customizable durations
- [ ] Practice progress tracking and charts
- [ ] Study planner with calendar interface
- [ ] Pomodoro timer with customizable intervals
- [ ] Study reminders working (if PWA)
- [ ] Study statistics displaying comprehensive data
- [ ] Vocabulary review sessions functional
- [ ] Exercise collections working
- [ ] Learning paths created
- [ ] All features tested on mobile and desktop
- [ ] Data persistence working (localStorage/IndexedDB)
- [ ] Accessibility verified

---

## 📚 Resources

- Vocabulary data: `content/lessons/*/vocabulary.json`
- Exercise types: `content/lessons/*/exercises.json`
- Course structure: `lib/data/courseStructure.ts`
- Spaced repetition: SuperMemo SM-2 algorithm reference

---

## 🔗 Dependencies

- Agent A (for consistent styling)
- Agent B (may use lesson player features)
- Agent E (for PWA notifications for reminders)

---

## 📝 Notes

- Spaced repetition requires persistent storage (localStorage or IndexedDB)
- Audio recording may require browser permissions
- Pronunciation scoring may need external API (optional)
- Study planner should respect user's timezone
- Statistics may require significant data storage
- Consider privacy implications for any data collection

---

**Previous Agent:** Agent E  
**Next Agent:** Agent G (Accessibility & Performance)


