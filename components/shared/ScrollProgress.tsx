'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrolled = window.scrollY
      const progress = scrolled / (documentHeight - windowHeight)
      
      setScrollProgress(Math.min(progress, 1))
    }

    window.addEventListener('scroll', calculateScrollProgress, { passive: true })
    calculateScrollProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress)
    }
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-accent/20 z-50 transition-opacity duration-300"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll progress"
    >
      <div
        className="h-full bg-accent transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  )
}

