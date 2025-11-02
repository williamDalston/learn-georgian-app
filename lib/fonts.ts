import { Playfair_Display, Inter } from 'next/font/google'

// Serif font for headlines (Authority & Trust)
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
})

// Sans-serif font for body text (Readability)
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

// Georgian font - Note: Noto Sans Georgian is not available via next/font/google
// It's loaded via CDN in globals.css as a fallback
// The CSS variable is defined in tailwind.config.js

