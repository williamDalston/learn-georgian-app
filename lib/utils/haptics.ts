// Haptic feedback utility for mobile devices
// Uses Vibration API where supported

export type HapticType = 'light' | 'medium' | 'strong' | 'success' | 'error' | 'warning'

interface HapticPattern {
  duration: number
  pattern: number[]
}

const hapticPatterns: Record<HapticType, HapticPattern> = {
  light: { duration: 10, pattern: [10] },
  medium: { duration: 20, pattern: [20] },
  strong: { duration: 50, pattern: [50] },
  success: { duration: 30, pattern: [20, 10, 20] },
  error: { duration: 100, pattern: [50, 50, 50] },
  warning: { duration: 40, pattern: [30, 20, 30] },
}

class HapticManager {
  private enabled: boolean = true
  private supported: boolean = false

  constructor() {
    // Check if Vibration API is supported
    if (typeof window !== 'undefined') {
      this.supported = 'vibrate' in navigator
      this.loadPreferences()
    }
  }

  private loadPreferences() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hapticsEnabled')
        this.enabled = saved !== 'false' // Default to enabled
      } catch {
        this.enabled = true
      }
    }
  }

  isEnabled(): boolean {
    return this.enabled && this.supported
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hapticsEnabled', String(enabled))
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  trigger(type: HapticType = 'medium') {
    if (!this.isEnabled()) return

    const pattern = hapticPatterns[type]
    
    if (this.supported && navigator.vibrate) {
      try {
        navigator.vibrate(pattern.pattern)
      } catch (error) {
        // Ignore vibration errors (some browsers may not support it)
        console.debug('Haptic feedback not available:', error)
      }
    }
  }

  // Convenience methods
  light() { this.trigger('light') }
  medium() { this.trigger('medium') }
  strong() { this.trigger('strong') }
  success() { this.trigger('success') }
  error() { this.trigger('error') }
  warning() { this.trigger('warning') }

  // Cancel any ongoing vibration
  cancel() {
    if (this.supported && navigator.vibrate) {
      try {
        navigator.vibrate(0)
      } catch {
        // Ignore errors
      }
    }
  }
}

// Singleton instance
export const haptics = new HapticManager()

// Convenience functions
export const triggerHaptic = (type: HapticType = 'medium') => haptics.trigger(type)
export const setHapticEnabled = (enabled: boolean) => haptics.setEnabled(enabled)
export const isHapticEnabled = () => haptics.isEnabled()


