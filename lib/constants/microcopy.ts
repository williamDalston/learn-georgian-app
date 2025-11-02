/**
 * Microcopy constants for consistent messaging throughout the app
 * These should be engaging, motivational, and clear
 */

export const BUTTONS = {
  // Lesson Actions
  markComplete: "I've Got This! ✓",
  nextLesson: "Continue Learning →",
  startLearning: "Begin Your Journey",
  saveProgress: "Save Progress ✓",
  checkAnswers: "Check My Answers",
  
  // Course Actions
  startLesson: "Start Lesson",
  retakeLesson: "Review Again",
  downloadResources: "Download Materials",
  
  // Navigation
  backToDashboard: "← Back to Dashboard",
  takeTour: "Take a 30-second Tour",
  exploreCourses: "Explore All Courses",
  
  // Achievements
  viewAchievements: "View All Achievements",
  celebrate: "Celebrate! 🎉",
  
  // User Actions
  updateSettings: "Save Changes",
  cancel: "Cancel",
  confirm: "Confirm",
  
  // Search
  search: "Search lessons...",
  clearSearch: "Clear",
  
  // Loading States
  loading: "Loading...",
  submitting: "Submitting...",
  processing: "Processing...",
} as const

export const GREETINGS = {
  morning: "Good morning! Ready to start learning?",
  afternoon: "Good afternoon! Let's continue your journey.",
  evening: "Good evening! Perfect time for a quick lesson.",
  night: "Working late? Let's learn together.",
  default: "Welcome Back! Ready to learn?",
} as const

export const LOADING_MESSAGES = {
  lessons: "Loading your lessons...",
  savingProgress: "Saving progress...",
  checkingAchievements: "Checking achievements...",
  loadingVideo: "Loading video...",
  submittingAnswers: "Checking your answers...",
  loadingDashboard: "Preparing your dashboard...",
  syncingData: "Syncing your data...",
  downloading: "Downloading resources...",
} as const

export const SUCCESS_MESSAGES = {
  lessonCompleted: "Lesson completed! Great work! 🎉",
  progressSaved: "Progress saved successfully! ✓",
  achievementUnlocked: "Achievement unlocked! 🏆",
  settingsUpdated: "Settings updated! ✓",
  answersCorrect: "Excellent! All correct! ✅",
  downloaded: "Download complete! ✓",
} as const

export const ERROR_MESSAGES = {
  generic: "Oops! Something went wrong. Please try again.",
  networkError: "Connection issue. Please check your internet and try again.",
  saveError: "Failed to save progress. Please try again.",
  loadError: "Couldn't load content. Try refreshing the page.",
  videoError: "Video couldn't load. Please refresh the page.",
  searchError: "Search failed. Please try again.",
} as const

export const EMPTY_STATES = {
  noLessons: "No lessons completed yet. Start your learning journey!",
  noAchievements: "No achievements yet. Complete lessons to unlock achievements!",
  noSearchResults: "No results found. Try different keywords.",
  noNotes: "No notes yet. Add notes while learning!",
  noProgress: "Start learning to see your progress!",
} as const

export const ACHIEVEMENT_DESCRIPTIONS = {
  firstLesson: "You took your first step on this amazing journey. Keep going!",
  a1Master: "Congratulations! You've mastered the A1 level. Ready for the next challenge?",
  weekWarrior: "7 days of consistent practice! You're building a powerful habit.",
  consistencyChampion: "30 days straight! Your dedication is inspiring.",
  dedicatedLearner: "10 hours of learning! You're truly dedicated to your goal.",
  seriousStudent: "50 hours invested! You're becoming a serious Georgian speaker.",
  firstWeek: "One week complete! You're on your way.",
  monthlyMilestone: "30 days of practice! Your commitment is outstanding.",
  halfway: "You're halfway to fluency! Keep pushing forward.",
  almostThere: "Almost at the finish line! Just a bit more to go.",
} as const

export const MOTIVATIONAL_QUOTES = [
  "Every expert was once a beginner. You're on your way!",
  "Progress, not perfection. Keep learning!",
  "Small steps lead to big achievements. Keep going!",
  "Your consistency is building your future fluency.",
  "Every lesson brings you closer to your goal.",
] as const

export const PROGRESS_PHRASES = {
  starting: "Getting started...",
  onTrack: "You're on track! Keep it up!",
  ahead: "You're ahead of schedule! Amazing!",
  catchingUp: "Almost there! Keep pushing!",
  completed: "Course completed! You're fluent now! 🎉",
} as const

/**
 * Helper function to get a random motivational quote
 */
export function getRandomQuote(): string {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  return MOTIVATIONAL_QUOTES[randomIndex]
}

/**
 * Helper function to get time-based greeting
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return GREETINGS.morning
  } else if (hour >= 12 && hour < 17) {
    return GREETINGS.afternoon
  } else if (hour >= 17 && hour < 22) {
    return GREETINGS.evening
  } else {
    return GREETINGS.night
  }
}


