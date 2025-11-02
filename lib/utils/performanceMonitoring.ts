/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and custom performance metrics
 */

export interface WebVitals {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

let vitalsCallback: ((vitals: WebVitals) => void) | null = null

/**
 * Set callback for Web Vitals updates
 */
export function onWebVitals(
  callback: (vitals: WebVitals) => void
): void {
  vitalsCallback = callback
}

/**
 * Report Web Vital metric
 */
export function reportWebVital(
  name: string,
  value: number,
  id?: string
): void {
  const vitals: WebVitals = {}

  switch (name) {
    case 'LCP':
      vitals.lcp = value
      break
    case 'FID':
      vitals.fid = value
      break
    case 'CLS':
      vitals.cls = value
      break
    case 'FCP':
      vitals.fcp = value
      break
    case 'TTFB':
      vitals.ttfb = value
      break
  }

  if (vitalsCallback) {
    vitalsCallback(vitals)
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}: ${value}${id ? ` (id: ${id})` : ''}`)
  }
}

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  if (typeof performance === 'undefined') {
    return fn()
  }

  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    }

    // Store metric
    storePerformanceMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    })

    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

/**
 * Store performance metric (for analytics)
 */
function storePerformanceMetric(metric: PerformanceMetric): void {
  try {
    const metrics = getPerformanceMetrics()
    metrics.push(metric)

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.shift()
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('__performance_metrics__', JSON.stringify(metrics))
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get stored performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetric[] {
  try {
    if (typeof window === 'undefined') {
      return []
    }

    const stored = localStorage.getItem('__performance_metrics__')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('__performance_metrics__')
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Check if performance budget is met
 */
export interface PerformanceBudget {
  lcp?: number // ms
  fid?: number // ms
  cls?: number // score
  fcp?: number // ms
}

export function checkPerformanceBudget(
  vitals: WebVitals,
  budget: PerformanceBudget
): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []

  if (budget.lcp && vitals.lcp && vitals.lcp > budget.lcp) {
    violations.push(`LCP ${vitals.lcp}ms exceeds budget ${budget.lcp}ms`)
  }

  if (budget.fid && vitals.fid && vitals.fid > budget.fid) {
    violations.push(`FID ${vitals.fid}ms exceeds budget ${budget.fid}ms`)
  }

  if (budget.cls && vitals.cls && vitals.cls > budget.cls) {
    violations.push(`CLS ${vitals.cls} exceeds budget ${budget.cls}`)
  }

  if (budget.fcp && vitals.fcp && vitals.fcp > budget.fcp) {
    violations.push(`FCP ${vitals.fcp}ms exceeds budget ${budget.fcp}ms`)
  }

  return {
    passed: violations.length === 0,
    violations,
  }
}


