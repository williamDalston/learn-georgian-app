# Agent E: Mobile & Tablet Experience
## UX/UI Improvements - Assignment E

**Agent:** E  
**Focus Area:** Mobile gestures, offline support, PWA, tablet optimization  
**Estimated Time:** 2-3 weeks  
**Priority:** Phase 2-3 (High Priority)

---

## 🎯 Mission

Create an exceptional mobile and tablet experience with native-feeling gestures, offline support, PWA capabilities, and tablet-specific optimizations.

---

## 📋 Task List

### 1. Gesture Support 📱

**Goal:** Add native mobile gestures for better user experience

#### 1.1 Swipe Navigation
- [ ] Swipe left/right to navigate between lessons
- [ ] Swipe gesture on lesson player page
- [ ] Visual feedback during swipe (card follows finger)
- [ ] Threshold-based: swipe 50%+ triggers navigation
- [ ] Cancelable: release before threshold cancels
- [ ] Smooth animations
- [ ] Disable swipe on scrollable content areas
- [ ] Keyboard shortcut fallback (left/right arrows)

**Files to Create:**
- `lib/hooks/useSwipeGesture.ts`
- `components/dashboard/SwipeableLesson.tsx`

**Files to Modify:**
- `app/dashboard/lessons/[id]/page.tsx`
- `components/dashboard/LessonPlayer.tsx`

#### 1.2 Pull to Refresh
- [ ] Pull down on dashboard to refresh
- [ ] Visual pull indicator
- [ ] Release to refresh
- [ ] Refresh spinner/loading state
- [ ] Update progress, achievements, recommendations
- [ ] Smooth animation

**Files to Create:**
- `lib/hooks/usePullToRefresh.ts`
- `components/dashboard/PullToRefresh.tsx`

**Files to Modify:**
- `app/dashboard/page.tsx`

#### 1.3 Swipe to Complete
- [ ] Swipe right on lesson card to mark complete
- [ ] Visual feedback: card slides away, checkmark appears
- [ ] Undo option (swipe back or undo button)
- [ ] Haptic feedback on completion
- [ ] Only enabled when lesson is ready to complete

**Files to Create:**
- `lib/hooks/useSwipeToComplete.ts`

**Files to Modify:**
- `components/dashboard/ContinueYourPath.tsx`
- Lesson list components

#### 1.4 Long Press Actions
- [ ] Long press on lesson card for quick actions menu
- [ ] Actions:
  - Bookmark/Favorite
  - Mark Complete
  - Share Lesson
  - View Details
- [ ] Context menu appears at touch point
- [ ] Haptic feedback on long press
- [ ] Dismiss on tap outside or selection

**Files to Create:**
- `lib/hooks/useLongPress.ts`
- `components/dashboard/LessonContextMenu.tsx`

**Files to Modify:**
- Lesson card components

---

### 2. Mobile-Optimized Components 📲

**Goal:** Create mobile-native UI patterns

#### 2.1 Bottom Sheet Modals
- [ ] Replace center modals with bottom sheets on mobile
- [ ] Slide up from bottom
- [ ] Drag down to dismiss
- [ ] Backdrop blur
- [ ] Smooth animations
- [ ] Accessible (keyboard navigation, focus trap)
- [ ] Desktop: keep center modals

**Files to Create:**
- `components/shared/BottomSheet.tsx`
- `components/shared/Modal.tsx` (enhance to support bottom sheet)

**Files to Modify:**
- All modal components
- `components/dashboard/WelcomeModal.tsx`
- `components/dashboard/AchievementBadge.tsx`

#### 2.2 Floating Action Button
- [ ] Floating action button (FAB) for "Start Next Lesson"
- [ ] Fixed position (bottom-right)
- [ ] Only on mobile
- [ ] Smooth appear/disappear on scroll
- [ ] Tap to start next lesson or show quick actions
- [ ] Accessible (keyboard navigation)
- [ ] Respects safe area (notches)

**Files to Create:**
- `components/shared/FloatingActionButton.tsx`

**Files to Modify:**
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`

#### 2.3 Sticky Progress Bar
- [ ] Mini progress bar at top of screen
- [ ] Always visible while scrolling
- [ ] Shows course completion percentage
- [ ] Tap to scroll to full progress section
- [ ] Compact design (doesn't obstruct content)
- [ ] Desktop: hide or show in header

**Files to Create:**
- `components/dashboard/StickyProgressBar.tsx`

**Files to Modify:**
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`

#### 2.4 Haptic Feedback
- [ ] Add haptic feedback for key actions:
  - Achievement unlocked (strong)
  - Lesson completed (medium)
  - Button press (light)
  - Swipe gesture (light)
  - Error (medium)
- [ ] Use Vibration API (where supported)
- [ ] Respect user preferences
- [ ] Fallback gracefully (no-op if not supported)

**Files to Create:**
- `lib/utils/haptics.ts`
- `lib/hooks/useHapticFeedback.ts`

**Files to Modify:**
- All interactive components
- Achievement celebrations
- Lesson completion

---

### 3. Offline Support 📴

**Goal:** Enable learning without internet connection

#### 3.1 Download Lessons
- [ ] Allow downloading lessons for offline viewing
- [ ] Download button on lesson page
- [ ] Download includes:
  - Video (if possible)
  - Transcript
  - Exercises
  - Vocabulary
  - Notes
- [ ] Show download progress
- [ ] Manage downloads (view, delete)
- [ ] Storage space indicator
- [ ] Offline badge on downloaded lessons

**Files to Create:**
- `lib/utils/offlineStorage.ts`
- `lib/hooks/useOfflineLessons.ts`
- `components/dashboard/DownloadLesson.tsx`
- `components/dashboard/OfflineManager.tsx`

**Files to Modify:**
- `app/dashboard/lessons/[id]/page.tsx`
- `components/dashboard/LessonPlayer.tsx`

#### 3.2 Offline Indicator
- [ ] Show when content is available offline
- [ ] Offline badge on lesson cards
- [ ] Network status indicator
- [ ] "Available Offline" vs "Requires Internet"
- [ ] Visual distinction in UI

**Files to Create:**
- `components/shared/OfflineIndicator.tsx`
- `lib/hooks/useNetworkStatus.ts`

**Files to Modify:**
- Lesson components
- Dashboard

#### 3.3 Sync Status
- [ ] Show sync status when connection returns
- [ ] Queue actions when offline
- [ ] Sync progress indicator
- [ ] "Syncing..." message
- [ ] Sync completion notification
- [ ] Handle sync conflicts
- [ ] Manual sync option

**Files to Create:**
- `components/shared/SyncStatus.tsx`
- `lib/utils/syncManager.ts`
- `lib/hooks/useSync.ts`

**Files to Modify:**
- `app/dashboard/page.tsx`

#### 3.4 Offline Queue
- [ ] Queue actions when offline:
  - Lesson completions
  - Progress updates
  - Exercise submissions
  - Notes
- [ ] Store in IndexedDB or localStorage
- [ ] Process queue when online
- [ ] Show queued actions count
- [ ] Handle failures gracefully

**Files to Create:**
- `lib/utils/actionQueue.ts`
- `lib/hooks/useActionQueue.ts`

**Files to Modify:**
- All action-triggering components

---

### 4. Tablet Optimization 📱

**Goal:** Optimize experience for tablet devices

#### 4.1 Split-View Mode
- [ ] Video on left, notes/exercises on right (landscape)
- [ ] Video on top, notes/exercises on bottom (portrait)
- [ ] Resizable panels (drag divider)
- [ ] Auto-adjust on orientation change
- [ ] Save layout preference
- [ ] Keyboard shortcut to toggle

**Files to Create:**
- `components/dashboard/SplitViewLesson.tsx`
- `components/shared/ResizablePanels.tsx`

**Files to Modify:**
- `app/dashboard/lessons/[id]/page.tsx`
- `components/dashboard/LessonPlayer.tsx`

#### 4.2 Multi-Panel Layout
- [ ] Course outline + lesson player + notes simultaneously
- [ ] Three-panel layout on large tablets
- [ ] Collapsible panels
- [ ] Panel management (show/hide)
- [ ] Touch-friendly controls

**Files to Create:**
- `components/dashboard/MultiPanelLayout.tsx`

**Files to Modify:**
- `app/dashboard/lessons/[id]/page.tsx`

#### 4.3 Pencil Support
- [ ] Support Apple Pencil/Stylus input
- [ ] Note-taking with handwriting
- [ ] Draw on video screenshots (if enabled)
- [ ] Convert handwriting to text (optional)
- [ ] Smooth stroke rendering
- [ ] Undo/redo for drawings

**Files to Create:**
- `components/dashboard/PencilNotes.tsx`
- `lib/utils/penInput.ts`

**Files to Modify:**
- `components/dashboard/LessonNotes.tsx`

#### 4.4 Larger Touch Targets
- [ ] Optimize spacing for tablet fingers
- [ ] Minimum 48px touch targets
- [ ] Better spacing between interactive elements
- [ ] Tablet-specific navigation patterns
- [ ] Landscape optimizations

**Files to Modify:**
- All interactive components
- Add tablet-specific breakpoints

---

### 5. Progressive Web App (PWA) 🌐

**Goal:** Make the app installable and app-like

#### 5.1 Install Prompt
- [ ] Show install prompt for PWA
- [ ] "Add to Home Screen" button
- [ ] Explain benefits of installing
- [ ] Custom install UI
- [ ] Track install events
- [ ] Don't show too frequently

**Files to Create:**
- `components/shared/InstallPrompt.tsx`
- `lib/utils/pwa.ts`
- `lib/hooks/useInstallPrompt.ts`

**Files to Modify:**
- Root layout
- `app/manifest.ts` (or create)

#### 5.2 Service Worker
- [ ] Implement service worker for offline functionality
- [ ] Cache static assets
- [ ] Cache API responses
- [ ] Background sync for offline actions
- [ ] Update strategy (stale-while-revalidate)
- [ ] Version management

**Files to Create:**
- `public/sw.js` or `app/sw.ts`
- `lib/utils/serviceWorker.ts`

**Files to Modify:**
- Root layout (register service worker)

#### 5.3 Push Notifications
- [ ] Study reminders
- [ ] Achievement notifications
- [ ] Streak reminders
- [ ] New lesson notifications
- [ ] User preference management
- [ ] Permission handling
- [ ] Notification actions

**Files to Create:**
- `lib/utils/pushNotifications.ts`
- `lib/hooks/useNotifications.ts`
- `components/settings/NotificationSettings.tsx`

**Files to Modify:**
- Settings (if exists)

#### 5.4 App-like Experience
- [ ] Full-screen mode
- [ ] Splash screen
- [ ] App icons for all platforms
- [ ] Theme color
- [ ] Standalone display mode
- [ ] Status bar styling

**Files to Create:**
- `app/manifest.ts`
- `public/icons/` (app icons)

**Files to Modify:**
- Root layout
- Metadata configuration

---

## 🎨 Design Considerations

- Gestures should feel natural and responsive
- Bottom sheets should be easy to dismiss
- Offline mode should be clearly indicated
- PWA should feel like a native app
- Tablet layouts should make use of available space
- All gestures should have keyboard alternatives
- Respect user preferences (reduced motion, etc.)

---

## ✅ Definition of Done

- [ ] Swipe navigation between lessons working
- [ ] Pull to refresh on dashboard
- [ ] Swipe to complete lessons
- [ ] Long press context menus
- [ ] Bottom sheet modals on mobile
- [ ] Floating action button implemented
- [ ] Sticky progress bar functional
- [ ] Haptic feedback on key actions
- [ ] Download lessons for offline viewing
- [ ] Offline indicators displayed
- [ ] Sync status and queue working
- [ ] Split-view mode for tablets
- [ ] Multi-panel layout functional
- [ ] Pencil/stylus support (if applicable)
- [ ] Tablet touch targets optimized
- [ ] PWA install prompt working
- [ ] Service worker implemented
- [ ] Push notifications functional
- [ ] App manifest configured
- [ ] All features tested on real devices
- [ ] Accessibility maintained (keyboard navigation)

---

## 📚 Resources

- Mobile navigation: `components/shared/MobileNavigation.tsx`
- Dashboard layout: `app/dashboard/layout.tsx`
- Lesson player: `components/dashboard/LessonPlayer.tsx`
- PWA documentation: MDN Web Docs

---

## 🔗 Dependencies

- Agent A (for consistent styling)
- Agent B (for lesson player enhancements that may need offline support)

---

## 📝 Notes

- Service worker implementation requires HTTPS (except localhost)
- Push notifications require user permission
- Offline video storage may be limited by browser storage quotas
- Test gestures on various devices (iOS, Android)
- Haptic feedback is limited to devices that support it
- PWA features may vary by browser/platform

---

**Previous Agent:** Agent D  
**Next Agent:** Agent F (Learning Tools & Vocabulary)



