/**
 * Mobile utility functions for better mobile UX
 */

/**
 * Debounce function for scroll/resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

/**
 * Get viewport height accounting for mobile browser bars
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0
  return window.innerHeight
}

/**
 * Check if user is near bottom of page
 */
export function isNearBottom(threshold: number = 150): boolean {
  if (typeof window === 'undefined') return false
  
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = window.scrollY
  const clientHeight = window.innerHeight
  const distanceFromBottom = scrollHeight - (scrollPosition + clientHeight)
  
  return distanceFromBottom < threshold
}

/**
 * Smooth scroll to element with mobile-safe behavior
 */
export function smoothScrollTo(elementId: string, offset: number = 0): void {
  if (typeof window === 'undefined') return
  
  const element = document.getElementById(elementId)
  if (!element) return
  
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

