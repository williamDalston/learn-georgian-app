/**
 * Performance monitoring and optimization utilities for mobile
 */

/**
 * Measure performance metrics
 */
export function measurePerformance(metricName: string, fn: () => void): number {
  if (typeof performance === 'undefined' || !performance.mark) {
    fn()
    return 0
  }

  const startMark = `${metricName}-start`
  const endMark = `${metricName}-end`

  performance.mark(startMark)
  fn()
  performance.mark(endMark)

  try {
    performance.measure(metricName, startMark, endMark)
    const measure = performance.getEntriesByName(metricName)[0]
    performance.clearMarks(startMark)
    performance.clearMarks(endMark)
    performance.clearMeasures(metricName)
    return measure.duration
  } catch (e) {
    return 0
  }
}

/**
 * Check if connection is slow (2G or slow 3G)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  if (!connection) return false

  // effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
  const effectiveType = connection.effectiveType
  return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === 'slow-3g'
}

/**
 * Check if device has limited memory
 */
export function hasLimitedMemory(): boolean {
  if (typeof navigator === 'undefined' || !('deviceMemory' in navigator)) {
    return false
  }

  const deviceMemory = (navigator as any).deviceMemory
  // deviceMemory: 0.25, 0.5, 1, 2, 4, 8 (GB)
  return deviceMemory !== undefined && deviceMemory < 2
}

/**
 * Check if CPU is constrained
 */
export function isCPUConstrained(): boolean {
  if (typeof navigator === 'undefined' || !('hardwareConcurrency' in navigator)) {
    return false
  }

  const cores = navigator.hardwareConcurrency || 4
  return cores < 4
}

/**
 * Get connection information for adaptive loading
 */
export function getConnectionInfo(): {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
} {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return {}
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  if (!connection) return {}

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // Round-trip time in ms
    saveData: connection.saveData, // Data saver mode
  }
}

/**
 * Debounce with immediate option
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const callNow = immediate && !timeout
    
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }): number {
  if (typeof window === 'undefined') {
    callback()
    return 0
  }

  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, options) as number
  }

  // Fallback to setTimeout
  const timeout = options?.timeout || 5000
  return setTimeout(callback, Math.min(timeout, 100)) as unknown as number
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window === 'undefined') return

  if ('cancelIdleCallback' in window) {
    ;(window as any).cancelIdleCallback(id)
  } else {
    clearTimeout(id as unknown as NodeJS.Timeout)
  }
}

/**
 * Preload image with promise
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Check if element is in viewport (for lazy loading)
 */
export function isInViewport(element: Element, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  )
}

