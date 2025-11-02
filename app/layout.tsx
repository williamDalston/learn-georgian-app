import type { Metadata, Viewport } from 'next'
import { playfairDisplay, inter } from '@/lib/fonts'
import './globals.css'
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: 'Learn Georgian | From Beginner to Conversational',
  description: 'Master Georgian from beginner to conversational level. An immersive, structured program with native speakers that takes you step-by-step through real conversations, grammar, and cultural insights.',
  keywords: ['learn georgian', 'georgian language', 'georgian course', 'georgian lessons', 'georgian alphabet', 'learn georgian online', 'georgian grammar', 'conversational georgian'],
  authors: [{ name: 'Learn Georgian' }],
  openGraph: {
    title: 'Learn Georgian | From Beginner to Conversational',
    description: 'Master Georgian from beginner to conversational level. An immersive, structured program with native speakers that takes you step-by-step through real conversations, grammar, and cultural insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Learn Georgian',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn Georgian | From Beginner to Conversational',
    description: 'Master Georgian from beginner to conversational level. An immersive, structured program with native speakers that takes you step-by-step through real conversations, grammar, and cultural insights.',
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
              name: 'Learn Georgian - From Beginner to Conversational',
              description: 'Master Georgian from beginner to conversational level. An immersive, structured program with native speakers that takes you step-by-step through real conversations, grammar, and cultural insights.',
              provider: {
                '@type': 'Organization',
                name: 'Learn Georgian',
              },
              courseMode: 'online',
              educationalLevel: 'Beginner',
              teaches: [
                'Georgian Language',
                'Georgian Alphabet',
                'Georgian Grammar',
                'Georgian Conversation',
                'Georgian Culture',
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
      <body className={`${playfairDisplay.variable} ${inter.variable} pb-20 lg:pb-0 overscroll-y-none`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
