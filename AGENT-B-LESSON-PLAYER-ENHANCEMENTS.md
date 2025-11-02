# Agent B: Lesson Player Enhancements
## UX/UI Improvements - Assignment B

**Agent:** B  
**Focus Area:** Lesson player navigation, video controls, learning tools  
**Estimated Time:** 1-2 weeks  
**Priority:** Phase 2 (High Priority)

---

## 🎯 Mission

Transform the lesson player into a comprehensive learning experience with better navigation, enhanced video controls, and integrated learning tools. Make lessons more engaging and easier to navigate.

---

## 📋 Task List

### 1. Better Navigation 🧭

**Goal:** Help users navigate lessons more easily and understand their position in the course

#### 1.1 Course Outline Sidebar/Drawer
- [ ] Create slide-out sidebar/drawer component
- [ ] Display full course structure
- [ ] Show current lesson highlighted
- [ ] Show completed lessons with checkmarks
- [ ] Show locked/unavailable lessons
- [ ] Allow clicking to jump to any lesson
- [ ] Make it toggleable (slide in/out)
- [ ] Mobile: Bottom drawer
- [ ] Desktop: Side drawer from left

**Files to Create:**
- `components/dashboard/CourseOutlineDrawer.tsx`
- `components/dashboard/CourseOutlineMobile.tsx` (bottom sheet variant)

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- `app/dashboard/lessons/[id]/page.tsx`

#### 1.2 Quick Jump Menu
- [ ] Add dropdown menu in lesson player header
- [ ] List all lessons in current level
- [ ] Show lesson numbers and titles
- [ ] Indicate completed/current/locked status
- [ ] Allow quick jump to any lesson
- [ ] Keyboard shortcut (Ctrl/Cmd + J)

**Files to Create:**
- `components/dashboard/LessonJumpMenu.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`

#### 1.3 Lesson Preview Cards
- [ ] Show next 2-3 lessons in sidebar or bottom section
- [ ] Display lesson title, duration, and brief description
- [ ] Show completion status
- [ ] Allow clicking to preview or start next lesson
- [ ] Smooth transitions between lessons

**Files to Create:**
- `components/dashboard/LessonPreviewCards.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`

#### 1.4 Bookmark/Favorite System
- [ ] Add star/bookmark icon to each lesson
- [ ] Allow users to bookmark lessons for later
- [ ] Create "Bookmarked Lessons" section in dashboard
- [ ] Save bookmarks to localStorage
- [ ] Show bookmark indicator in lesson list
- [ ] Quick access to bookmarked lessons

**Files to Create:**
- `lib/hooks/useBookmarks.ts`
- `components/dashboard/BookmarkButton.tsx`
- `components/dashboard/BookmarkedLessons.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- `app/dashboard/page.tsx`

---

### 2. Enhanced Video Controls 🎥

**Goal:** Give users more control over video playback and navigation

#### 2.1 Speed Control with Labels
- [ ] Enhance existing speed control
- [ ] Add descriptive labels:
  - "0.75x Slower"
  - "1x Normal"
  - "1.25x Faster"
  - "1.5x Very Fast"
  - "2x Maximum"
- [ ] Show current speed in control bar
- [ ] Keyboard shortcut (Shift + > or <)
- [ ] Remember user's preferred speed

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- Add speed persistence to localStorage

#### 2.2 Keyboard Shortcuts Display
- [ ] Create keyboard shortcuts help modal
- [ ] Show available shortcuts:
  - Space: Play/Pause
  - Arrow Left/Right: Seek backward/forward
  - Shift + >/<: Speed up/down
  - M: Mute
  - F: Fullscreen
  - N: Next lesson
  - P: Previous lesson
- [ ] Accessible via "?" key
- [ ] Show on first lesson visit (dismissible)
- [ ] Always accessible via help button

**Files to Create:**
- `components/dashboard/KeyboardShortcutsModal.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- `components/dashboard/KeyboardShortcuts.tsx` (enhance existing)

#### 2.3 Chapter Markers
- [ ] Parse video script for chapter sections
- [ ] Display chapter markers on timeline:
  - Introduction
  - Grammar
  - Vocabulary
  - Practice
  - Summary
- [ ] Allow clicking to jump to chapters
- [ ] Show chapter name on hover
- [ ] Highlight current chapter
- [ ] Create chapter navigation menu

**Files to Create:**
- `lib/utils/videoChapters.ts`
- `components/dashboard/VideoChapters.tsx`
- `components/dashboard/ChapterMarker.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- May need to update video script format

#### 2.4 Transcript Integration
- [ ] Parse video script into transcript format
- [ ] Display transcript alongside video
- [ ] Sync transcript with video playback (highlight current line)
- [ ] Make transcript clickable (jump to timestamp)
- [ ] Allow searching transcript
- [ ] Toggle transcript visibility
- [ ] Copy transcript text
- [ ] Print transcript option

**Files to Create:**
- `components/dashboard/VideoTranscript.tsx`
- `lib/utils/transcriptParser.ts`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- Video script loading logic

#### 2.5 Playback Resume
- [ ] Track last watched position per lesson
- [ ] Save position to localStorage
- [ ] Show "Resume from [timestamp]" button when returning
- [ ] Auto-resume option (user preference)
- [ ] Show progress indicator on lesson thumbnail
- [ ] Clear resume position on completion

**Files to Create:**
- `lib/hooks/useVideoProgress.ts`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- `app/dashboard/courses/page.tsx` (show progress on lesson cards)

---

### 3. Learning Tools 🛠️

**Goal:** Integrate learning tools directly into the lesson experience

#### 3.1 Inline Notes (Timestamped)
- [ ] Create inline note-taking interface
- [ ] Allow notes at specific timestamps
- [ ] Show note markers on video timeline
- [ ] Click timestamp to jump to note
- [ ] Edit/delete notes
- [ ] Export notes
- [ ] Search notes
- [ ] Sync notes with video playback

**Files to Create:**
- `components/dashboard/InlineNotes.tsx`
- `components/dashboard/NoteMarker.tsx`
- `lib/hooks/useLessonNotes.ts` (enhance existing)

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- `components/dashboard/LessonNotes.tsx` (may merge or enhance)

#### 3.2 Vocabulary Quick Access
- [ ] Create floating vocabulary button
- [ ] Show vocabulary in slide-out panel or modal
- [ ] Accessible without scrolling
- [ ] Show pronunciation, translation, examples
- [ ] Mark vocabulary as learned
- [ ] Quick copy to clipboard
- [ ] Audio playback for pronunciation

**Files to Create:**
- `components/dashboard/VocabularyQuickAccess.tsx`
- `components/dashboard/VocabularyFloatingButton.tsx`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`

#### 3.3 Practice Mode Toggle
- [ ] Add "Watch Mode" vs "Practice Mode" toggle
- [ ] Practice Mode: Hide answers in exercises
- [ ] Practice Mode: Show explanations after completion
- [ ] Practice Mode: Track separate practice scores
- [ ] Remember user preference
- [ ] Clear visual indication of current mode

**Files to Create:**
- `components/dashboard/PracticeModeToggle.tsx`
- `lib/hooks/usePracticeMode.ts`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`
- Exercise components

#### 3.4 Lesson Checklist
- [ ] Create interactive checklist of lesson components:
  - ✓ Watch video
  - ✓ Complete exercises
  - ✓ Review vocabulary
  - ✓ Take quiz
  - ✓ Complete lesson
- [ ] Auto-check as user completes items
- [ ] Show completion percentage
- [ ] Persistent across sessions
- [ ] Visual progress indicator

**Files to Create:**
- `components/dashboard/LessonChecklist.tsx`
- `lib/hooks/useLessonChecklist.ts`

**Files to Modify:**
- `components/dashboard/LessonPlayer.tsx`

---

## 🎨 Design Considerations

- Course outline drawer should not obstruct video on mobile
- Video controls should be touch-friendly (minimum 44px targets)
- All new modals/drawers should respect `prefers-reduced-motion`
- Keyboard shortcuts should be discoverable but not intrusive
- Learning tools should enhance, not distract from video

---

## ✅ Definition of Done

- [ ] Course outline sidebar/drawer fully functional on mobile and desktop
- [ ] Quick jump menu implemented with keyboard shortcut
- [ ] Lesson preview cards showing next lessons
- [ ] Bookmark system implemented and persistent
- [ ] Enhanced speed control with labels
- [ ] Keyboard shortcuts help modal accessible
- [ ] Chapter markers on video timeline
- [ ] Transcript synced with video playback
- [ ] Playback resume tracking working
- [ ] Inline timestamped notes implemented
- [ ] Vocabulary quick access floating button
- [ ] Practice mode toggle functional
- [ ] Lesson checklist tracking progress
- [ ] All features tested on mobile and desktop
- [ ] Keyboard navigation fully functional
- [ ] Accessibility verified (screen readers, keyboard only)

---

## 📚 Resources

- Existing lesson player: `components/dashboard/LessonPlayer.tsx`
- Video script format: `content/lessons/*/video-script.md`
- Course structure: `lib/data/courseStructure.ts`
- Keyboard shortcuts: `components/dashboard/KeyboardShortcuts.tsx`

---

## 🔗 Dependencies

- Agent A (for consistent button styles and microcopy)
- May need to update video script format to support chapters

---

## 📝 Notes

- Consider performance when loading full course structure in drawer
- Bookmark data should sync across devices if user authentication is added
- Chapter markers require consistent video script format
- Transcript parsing should handle various script formats gracefully

---

**Previous Agent:** Agent A  
**Next Agent:** Agent C (Achievement & Progress Systems)

