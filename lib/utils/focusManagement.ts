/**
 * Focus management utilities for accessibility
 * Handles focus trapping, focus restoration, and focus indicators
 */

let focusHistory: HTMLElement[] = []
const MAX_HISTORY = 10

/**
 * Save the currently focused element to history
 */
export function saveFocus(): void {
  if (typeof document === 'undefined') return
  
  const activeElement = document.activeElement as HTMLElement
  if (activeElement && activeElement !== document.body) {
    focusHistory.push(activeElement)
    // Keep history size manageable
    if (focusHistory.length > MAX_HISTORY) {
      focusHistory.shift()
    }
  }
}

/**
 * Restore focus to the last saved element
 */
export function restoreFocus(): void {
  if (typeof document === 'undefined') return
  
  const lastFocused = focusHistory.pop()
  if (lastFocused && typeof lastFocused.focus === 'function') {
    // Check if element is still in DOM
    if (document.body.contains(lastFocused)) {
      lastFocused.focus()
    }
  }
}

/**
 * Clear focus history
 */
export function clearFocusHistory(): void {
  focusHistory = []
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(
  container: HTMLElement | null
): HTMLElement[] {
  if (!container || typeof document === 'undefined') return []

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
}

/**
 * Get the first focusable element in a container
 */
export function getFirstFocusable(container: HTMLElement | null): HTMLElement | null {
  const focusable = getFocusableElements(container)
  return focusable.length > 0 ? focusable[0] : null
}

/**
 * Get the last focusable element in a container
 */
export function getLastFocusable(container: HTMLElement | null): HTMLElement | null {
  const focusable = getFocusableElements(container)
  return focusable.length > 0 ? focusable[focusable.length - 1] : null
}

/**
 * Trap focus within a container (for modals, dropdowns, etc.)
 * Returns a cleanup function
 */
export function trapFocus(container: HTMLElement): () => void {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const firstFocusable = getFirstFocusable(container)
  const lastFocusable = getLastFocusable(container)

  // Focus first element
  if (firstFocusable) {
    firstFocusable.focus()
  }

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    // If no focusable elements, prevent tabbing
    if (!firstFocusable || !lastFocusable) {
      e.preventDefault()
      return
    }

    // If only one focusable element, keep focus there
    if (firstFocusable === lastFocusable) {
      e.preventDefault()
      firstFocusable.focus()
      return
    }

    // Handle tabbing forward
    if (!e.shiftKey) {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    } else {
      // Handle tabbing backward
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      }
    }
  }

  container.addEventListener('keydown', handleTab)

  return () => {
    container.removeEventListener('keydown', handleTab)
  }
}

/**
 * Set focus to a specific element safely
 */
export function setFocus(element: HTMLElement | null): void {
  if (!element || typeof document === 'undefined') return

  if (typeof element.focus === 'function') {
    element.focus()
    // Ensure focus is visible
    if (element.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}

/**
 * Focus the first element in a container
 */
export function focusFirst(container: HTMLElement | null): void {
  const first = getFirstFocusable(container)
  setFocus(first)
}

/**
 * Focus the last element in a container
 */
export function focusLast(container: HTMLElement | null): void {
  const last = getLastFocusable(container)
  setFocus(last)
}

