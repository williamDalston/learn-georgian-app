'use client'

/**
 * Service Worker Registration Component
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Registers service worker for PWA audio support
 */

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/utils/serviceWorker'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker()
  }, [])

  // Component doesn't render anything
  return null
}

