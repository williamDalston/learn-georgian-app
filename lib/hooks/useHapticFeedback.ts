import { useCallback } from 'react'
import { haptics, type HapticType } from '@/lib/utils/haptics'

/**
 * Hook for easy haptic feedback in components
 * 
 * Usage:
 * const { trigger } = useHapticFeedback()
 * 
 * Then call trigger('medium') on button click, etc.
 */
export function useHapticFeedback() {
  const trigger = useCallback((type: HapticType = 'medium') => {
    haptics.trigger(type)
  }, [])

  const light = useCallback(() => trigger('light'), [trigger])
  const medium = useCallback(() => trigger('medium'), [trigger])
  const strong = useCallback(() => trigger('strong'), [trigger])
  const success = useCallback(() => trigger('success'), [trigger])
  const error = useCallback(() => trigger('error'), [trigger])
  const warning = useCallback(() => trigger('warning'), [trigger])
  const cancel = useCallback(() => haptics.cancel(), [])

  return {
    trigger,
    light,
    medium,
    strong,
    success,
    error,
    warning,
    cancel,
    isEnabled: haptics.isEnabled(),
    setEnabled: haptics.setEnabled.bind(haptics),
  }
}


