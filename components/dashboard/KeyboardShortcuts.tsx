'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/lib/hooks/useToast'

interface Shortcut {
  key: string
  description: string
  action: () => void
  global?: boolean // Can be used from anywhere
}

export function useKeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()
  const { showToast } = useToast()

  useEffect(() => {
    const shortcuts: Shortcut[] = [
      {
        key: 'g d',
        description: 'Go to Dashboard',
        action: () => router.push('/dashboard'),
        global: true,
      },
      {
        key: 'g c',
        description: 'Go to Courses',
        action: () => router.push('/dashboard/courses'),
        global: true,
      },
      {
        key: 'g p',
        description: 'Go to Progress',
        action: () => router.push('/dashboard/progress'),
        global: true,
      },
      {
        key: '/',
        description: 'Focus Search',
        action: () => {
          const searchInput = document.querySelector(
            'input[type="search"]'
          ) as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
            showToast('Search focused', 'info', 2000)
          }
        },
        global: true,
      },
    ]

    let keySequence: string[] = []
    let sequenceTimer: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow '/' to focus search even when typing
        if (e.key === '/' && target.tagName === 'INPUT') {
          return
        }
        if (e.key !== '/') {
          return
        }
      }

      // Prevent default for shortcuts
      const shortcutsToCheck = shortcuts.filter((s) => {
        if (s.key.includes(' ')) {
          // Multi-key shortcut
          return true
        }
        // Single key shortcut - check if it matches and is global or on correct page
        if (s.key === e.key.toLowerCase()) {
          return s.global || pathname?.includes(s.key.split(' ')[0])
        }
        return false
      })

      if (shortcutsToCheck.length > 0) {
        e.preventDefault()
      }

      // Handle multi-key sequences (e.g., 'g d')
      if (shortcutsToCheck.some((s) => s.key.includes(' '))) {
        keySequence.push(e.key.toLowerCase())
        clearTimeout(sequenceTimer)

        sequenceTimer = setTimeout(() => {
          keySequence = []
        }, 1000)

        const sequenceString = keySequence.join(' ')
        const matchedShortcut = shortcuts.find(
          (s) => s.key === sequenceString
        )

        if (matchedShortcut) {
          matchedShortcut.action()
          keySequence = []
        }
      } else {
        // Handle single-key shortcuts
        const matchedShortcut = shortcuts.find(
          (s) => s.key === e.key.toLowerCase() && (s.global || true)
        )

        if (matchedShortcut) {
          matchedShortcut.action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(sequenceTimer)
    }
  }, [router, pathname, showToast])
}

// Keyboard Shortcuts Help Modal
export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { keys: 'g d', description: 'Go to Dashboard' },
    { keys: 'g c', description: 'Go to Courses' },
    { keys: 'g p', description: 'Go to Progress' },
    { keys: '/', description: 'Focus Search' },
    { keys: '?', description: 'Show this help' },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault()
          setIsOpen((prev) => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-serif text-2xl text-primary-900 mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between">
              <span className="font-sans text-gray-700">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
        <p className="mt-6 font-sans text-sm text-gray-500 text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded">?</kbd> anytime to toggle this help
        </p>
      </div>
    </div>
  )
}

