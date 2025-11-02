import { useEffect, useRef } from 'react'
import { trapFocus, getFirstFocusable, setFocus } from '@/lib/utils/focusManagement'

interface UseFocusTrapOptions {
  /**
   * Whether the focus trap is active
   */
  active?: boolean
  /**
   * Whether to focus the first element on mount
   */
  initialFocus?: boolean
}

/**
 * Hook to trap focus within a container (for modals, dialogs, etc.)
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}) {
  const { active = true, initialFocus = true } = options
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    // Focus first element if requested
    if (initialFocus) {
      const firstFocusable = getFirstFocusable(containerRef.current)
      if (firstFocusable) {
        setFocus(firstFocusable)
      }
    }

    // Set up focus trap
    const cleanup = trapFocus(containerRef.current)

    return cleanup
  }, [active, initialFocus])

  return containerRef
}



