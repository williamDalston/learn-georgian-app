import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Learn Georgian - From Beginner to Conversational',
    short_name: 'Learn Georgian',
    description: 'Master Georgian from beginner to conversational level with immersive lessons, grammar, and cultural insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#082434',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'languages'],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    related_applications: [],
    prefer_related_applications: false,
  }
}

