/**
 * Service Worker for PWA Audio Support
 * 
 * Agent 15: Mobile Pronunciation Experience
 * Caches audio files for offline pronunciation practice
 */

const CACHE_NAME = 'audio-cache-v1'
const AUDIO_CACHE_MAX_SIZE = 100 * 1024 * 1024 // 100MB

// Install event - cache audio files
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Audio cache opened')
      return cache
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve cached audio when offline
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url)

  // Only handle audio files
  if (
    url.pathname.startsWith('/audio/') &&
    (url.pathname.endsWith('.mp3') ||
      url.pathname.endsWith('.ogg') ||
      url.pathname.endsWith('.webm'))
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached audio if available
        if (response) {
          return response
        }

        // Fetch and cache audio
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response for caching
            const responseToCache = response.clone()

            // Cache the audio file
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(() => {
            // Return offline fallback if fetch fails
            return new Response('Offline', { status: 503 })
          })
      })
    )
  }
})

// Background sync for audio preloading (if supported)
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'preload-audio') {
    event.waitUntil(preloadCriticalAudio())
  }
})

async function preloadCriticalAudio(): Promise<void> {
  // Preload critical audio files (common letters, common words)
  const criticalAudio = [
    '/audio/letters/ა.mp3',
    '/audio/letters/ე.mp3',
    '/audio/letters/ი.mp3',
    '/audio/letters/ო.mp3',
    '/audio/letters/უ.mp3',
  ]

  const cache = await caches.open(CACHE_NAME)
  await Promise.all(
    criticalAudio.map(async (url) => {
      try {
        const response = await fetch(url)
        if (response.ok) {
          await cache.put(url, response)
        }
      } catch (error) {
        console.error(`Failed to preload audio: ${url}`, error)
      }
    })
  )
}

// Clean up cache if it exceeds max size
async function cleanCacheIfNeeded(): Promise<void> {
  const cache = await caches.open(CACHE_NAME)
  const keys = await cache.keys()
  
  // Rough size estimation (1MB per file)
  const estimatedSize = keys.length * 1024 * 1024
  
  if (estimatedSize > AUDIO_CACHE_MAX_SIZE) {
    // Delete oldest half
    const keysToDelete = keys.slice(0, Math.floor(keys.length / 2))
    await Promise.all(keysToDelete.map((key) => cache.delete(key)))
    console.log(`Service Worker: Cleaned ${keysToDelete.length} audio cache entries`)
  }
}

// Periodic cache cleanup
setInterval(() => {
  cleanCacheIfNeeded()
}, 60 * 60 * 1000) // Every hour

