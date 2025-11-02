'use client'

import { useState, useEffect } from 'react'

interface FontSizeControlsProps {
  /**
   * Minimum font size multiplier (default: 0.875 = 87.5% = 14px from base 16px)
   */
  minSize?: number
  /**
   * Maximum font size multiplier (default: 1.25 = 125% = 20px from base 16px)
   */
  maxSize?: number
  /**
   * Default font size multiplier (default: 1 = 100% = 16px)
   */
  defaultSize?: number
  /**
   * Step size for font adjustments (default: 0.0625 = 6.25% = 1px from base 16px)
   */
  step?: number
}

const STORAGE_KEY = 'user-font-size'
const DEFAULT_MIN = 0.875 // 14px
const DEFAULT_MAX = 1.25 // 20px
const DEFAULT_SIZE = 1 // 16px
const DEFAULT_STEP = 0.0625 // 1px

/**
 * Font size controls component for accessibility
 * Allows users to adjust text size for better readability
 */
export default function FontSizeControls({
  minSize = DEFAULT_MIN,
  maxSize = DEFAULT_MAX,
  defaultSize = DEFAULT_SIZE,
  step = DEFAULT_STEP,
}: FontSizeControlsProps) {
  const [fontSize, setFontSize] = useState(defaultSize)

  useEffect(() => {
    // Load saved font size preference
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = parseFloat(saved)
          if (!isNaN(parsed) && parsed >= minSize && parsed <= maxSize) {
            setFontSize(parsed)
            applyFontSize(parsed)
          }
        }
      } catch {
        // Ignore errors
      }
    }
  }, [minSize, maxSize])

  const applyFontSize = (size: number) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${size * 16}px`
    }
  }

  const handleIncrease = () => {
    const newSize = Math.min(fontSize + step, maxSize)
    setFontSize(newSize)
    applyFontSize(newSize)
    saveFontSize(newSize)
  }

  const handleDecrease = () => {
    const newSize = Math.max(fontSize - step, minSize)
    setFontSize(newSize)
    applyFontSize(newSize)
    saveFontSize(newSize)
  }

  const handleReset = () => {
    setFontSize(defaultSize)
    applyFontSize(defaultSize)
    saveFontSize(defaultSize)
  }

  const saveFontSize = (size: number) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, size.toString())
      } catch {
        // Ignore storage errors
      }
    }
  }

  const percentage = Math.round(fontSize * 100)

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <span className="sr-only">Font size controls</span>
      <button
        onClick={handleDecrease}
        disabled={fontSize <= minSize}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-sm font-medium min-w-[3rem] text-center" aria-live="polite">
        {percentage}%
      </span>
      <button
        onClick={handleIncrease}
        disabled={fontSize >= maxSize}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Increase font size"
        title="Increase font size"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={handleReset}
        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Reset font size to default"
        title="Reset to default size"
      >
        Reset
      </button>
    </div>
  )
}


