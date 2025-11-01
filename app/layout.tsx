import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inner Freedom Program | Transform Your Life',
  description: 'A practical, step-by-step path to inner freedom. Move beyond temporary calm and build a life of lasting clarity and purpose.',
  keywords: ['inner freedom', 'mindfulness', 'meditation', 'personal growth', 'wellness', 'self-improvement', 'transformation'],
  authors: [{ name: 'Inner Freedom Program' }],
  openGraph: {
    title: 'Inner Freedom Program | Transform Your Life',
    description: 'A practical, step-by-step path to inner freedom. Move beyond temporary calm and build a life of lasting clarity and purpose.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Inner Freedom Program',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inner Freedom Program | Transform Your Life',
    description: 'A practical, step-by-step path to inner freedom. Move beyond temporary calm and build a life of lasting clarity and purpose.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#082434' },
    { media: '(prefers-color-scheme: dark)', color: '#082434' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: 'Inner Freedom Program',
              description: 'A practical, step-by-step path to inner freedom. Move beyond temporary calm and build a life of lasting clarity and purpose.',
              provider: {
                '@type': 'Organization',
                name: 'Inner Freedom Program',
              },
              courseMode: 'online',
              educationalLevel: 'Beginner',
              teaches: [
                'Mindfulness',
                'Meditation',
                'Personal Growth',
                'Emotional Resilience',
                'Inner Peace',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '200',
              },
            }),
          }}
        />
      </head>
      <body className="pb-20 lg:pb-0 overscroll-y-none">
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {children}
      </body>
    </html>
  )
}
