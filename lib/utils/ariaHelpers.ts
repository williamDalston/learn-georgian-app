/**
 * ARIA helper utilities for accessibility
 */

/**
 * Generate a unique ID for ARIA attributes
 */
let idCounter = 0
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Get ARIA label for icon-only buttons
 */
export function getIconButtonLabel(
  iconName: string,
  action: string
): string {
  return `${action} ${iconName}`.trim()
}

/**
 * Common ARIA labels for common actions
 */
export const commonAriaLabels = {
  close: 'Close',
  open: 'Open',
  delete: 'Delete',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  submit: 'Submit',
  search: 'Search',
  menu: 'Menu',
  navigation: 'Navigation',
  mainContent: 'Main content',
  skipToContent: 'Skip to main content',
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
  previous: 'Previous',
  next: 'Next',
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
  fullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  settings: 'Settings',
  profile: 'Profile',
  logout: 'Log out',
}

/**
 * Get descriptive label for status messages
 */
export function getStatusMessage(
  type: 'loading' | 'success' | 'error' | 'info',
  context: string
): string {
  const statusMessages: Record<string, Record<string, string>> = {
    loading: {
      lesson: 'Loading lesson...',
      video: 'Loading video...',
      progress: 'Loading progress...',
      achievements: 'Loading achievements...',
      default: 'Loading...',
    },
    success: {
      saved: 'Progress saved successfully',
      completed: 'Lesson completed',
      achievement: 'Achievement unlocked',
      default: 'Success',
    },
    error: {
      load: 'Failed to load. Please try again.',
      save: 'Failed to save. Please try again.',
      network: 'Network error. Please check your connection.',
      default: 'An error occurred',
    },
    info: {
      default: 'Information',
    },
  }

  return (
    statusMessages[type]?.[context] || statusMessages[type]?.default || context
  )
}

/**
 * Create ARIA describedby attribute value from IDs
 */
export function createDescribedBy(...ids: string[]): string {
  return ids.filter(Boolean).join(' ')
}

/**
 * Create ARIA labelledby attribute value from IDs
 */
export function createLabelledBy(...ids: string[]): string {
  return ids.filter(Boolean).join(' ')
}

