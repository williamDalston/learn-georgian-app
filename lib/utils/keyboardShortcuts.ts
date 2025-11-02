/**
 * Centralized keyboard shortcuts configuration and utilities
 * Supports both global shortcuts and context-specific shortcuts
 */

export interface KeyboardShortcut {
  key: string // e.g., 'g d', 'Space', '?' 
  description: string
  action: () => void
  global?: boolean // Can be used from anywhere
  context?: string // Optional context where shortcut applies (e.g., 'lesson-player')
  preventDefault?: boolean // Whether to prevent default browser behavior
}

export interface ShortcutCategory {
  name: string
  shortcuts: Omit<KeyboardShortcut, 'action'>[]
}

/**
 * Get all shortcuts grouped by category for display in help modal
 */
export function getShortcutCategories(): ShortcutCategory[] {
  return [
    {
      name: 'Navigation',
      shortcuts: [
        { key: 'g d', description: 'Go to Dashboard', global: true },
        { key: 'g c', description: 'Go to Courses', global: true },
        { key: 'g l', description: 'Go to Lessons', global: true },
        { key: 'g p', description: 'Go to Progress', global: true },
        { key: '/', description: 'Focus Search', global: true },
      ],
    },
    {
      name: 'Lesson Player',
      shortcuts: [
        { key: 'Space', description: 'Play/Pause video', context: 'lesson-player' },
        { key: 'ArrowLeft', description: 'Seek backward 10 seconds', context: 'lesson-player' },
        { key: 'ArrowRight', description: 'Seek forward 10 seconds', context: 'lesson-player' },
        { key: 'ArrowUp', description: 'Increase volume', context: 'lesson-player' },
        { key: 'ArrowDown', description: 'Decrease volume', context: 'lesson-player' },
        { key: 'm', description: 'Mute/Unmute', context: 'lesson-player' },
        { key: 'f', description: 'Toggle fullscreen', context: 'lesson-player' },
        { key: 'n', description: 'Next lesson', context: 'lesson-player' },
        { key: 'p', description: 'Previous lesson', context: 'lesson-player' },
        { key: 'Shift + >', description: 'Increase playback speed', context: 'lesson-player' },
        { key: 'Shift + <', description: 'Decrease playback speed', context: 'lesson-player' },
      ],
    },
    {
      name: 'General',
      shortcuts: [
        { key: '?', description: 'Show keyboard shortcuts help', global: true },
        { key: 'Escape', description: 'Close modals/dialogs', global: true },
        { key: 'Tab', description: 'Navigate between elements', global: true },
      ],
    },
  ]
}

/**
 * Format shortcut key for display in UI
 */
export function formatShortcutKey(key: string): string {
  // Handle multi-key shortcuts
  if (key.includes(' + ')) {
    return key.split(' + ').map(k => `<kbd>${k}</kbd>`).join(' + ')
  }
  return `<kbd>${key}</kbd>`
}

/**
 * Check if target element should allow keyboard shortcuts
 */
export function shouldAllowShortcut(target: HTMLElement): boolean {
  // Allow shortcuts unless typing in input, textarea, or contenteditable
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  ) {
    // Allow '/' to focus search even when typing
    return target.tagName === 'INPUT' && target.type === 'search'
  }
  return true
}


