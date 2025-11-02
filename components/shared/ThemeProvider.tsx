'use client'

import { useEffect } from 'react'
import { useTheme } from '@/lib/hooks/useTheme'

/**
 * ThemeProvider - Initializes theme on mount
 * This component ensures the theme is applied immediately when the app loads
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme() // Initialize theme hook
  
  return <>{children}</>
}

