'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: 'O', description: 'Toggle course outline drawer' },
        { keys: 'J', description: 'Quick jump to any lesson' },
        { keys: 'N', description: 'Go to next lesson' },
        { keys: 'P', description: 'Go to previous lesson' },
      ],
    },
    {
      category: 'Video Controls',
      items: [
        { keys: 'Space', description: 'Play/Pause video' },
        { keys: '←', description: 'Seek backward 10 seconds' },
        { keys: '→', description: 'Seek forward 10 seconds' },
        { keys: 'M', description: 'Mute/Unmute' },
        { keys: 'F', description: 'Toggle fullscreen' },
        { keys: '>', description: 'Speed up playback' },
        { keys: '<', description: 'Slow down playback' },
      ],
    },
    {
      category: 'Tools',
      items: [
        { keys: '?', description: 'Show this help modal' },
        { keys: 'B', description: 'Toggle bookmark' },
        { keys: 'V', description: 'Show vocabulary quick access' },
      ],
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-accent/5 to-accent-50 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-primary-900 mb-1">Keyboard Shortcuts</h2>
                  <p className="font-sans text-sm text-gray-600">Speed up your learning with these shortcuts</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close shortcuts"
                >
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {shortcuts.map((category, index) => (
                    <div key={index}>
                      <h3 className="font-serif text-lg text-primary-900 mb-3">{category.category}</h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <span className="font-sans text-sm text-gray-700">{item.description}</span>
                            <div className="flex items-center gap-2">
                              {item.keys.split(' ').map((key, keyIndex) => (
                                <div key={keyIndex} className="flex items-center gap-1">
                                  {item.keys.includes(' ') && keyIndex > 0 && (
                                    <span className="text-gray-500">+</span>
                                  )}
                                  <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-sm font-semibold shadow-sm">
                                    {key}
                                  </kbd>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="font-sans text-xs text-gray-600 text-center">
                  Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">?</kbd> anytime to toggle this help
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


