'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiAnimationProps {
  trigger: boolean
  variant?: 'default' | 'celebratory' | 'fireworks' | 'rain'
  intensity?: 'low' | 'medium' | 'high'
}

export default function ConfettiAnimation({
  trigger,
  variant = 'default',
  intensity = 'medium',
}: ConfettiAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      // Just show a simple celebration without animation
      return
    }

    if (!canvasRef.current) return

    const duration = 3000
    const end = Date.now() + duration

    // Configure intensity
    const particleCount = {
      low: 50,
      medium: 100,
      high: 200,
    }[intensity]

    const config: confetti.Options = {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      origin: { y: 0.6 },
    }

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      // Launch confetti based on variant
      switch (variant) {
        case 'celebratory':
          confetti({
            ...config,
            angle: 60,
            spread: 55,
            particleCount: particleCount / 10,
            origin: { x: 0 },
          })
          confetti({
            ...config,
            angle: 120,
            spread: 55,
            particleCount: particleCount / 10,
            origin: { x: 1 },
          })
          break

        case 'fireworks':
          confetti({
            ...config,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 9999,
            particleCount: particleCount / 4,
            shapes: ['circle'],
          })
          break

        case 'rain':
          confetti({
            ...config,
            angle: 90,
            spread: 120,
            particleCount: particleCount / 20,
            origin: { y: -0.1 },
          })
          break

        case 'default':
        default:
          confetti({
            ...config,
            angle: 60,
            spread: 75,
            particleCount: particleCount / 10,
          })
      }
    }, 250)
  }, [trigger, variant, intensity])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

// Simplified confetti for quick celebrations
export function triggerConfetti(options?: {
  variant?: 'default' | 'celebratory' | 'fireworks' | 'rain'
  intensity?: 'low' | 'medium' | 'high'
}) {
  const { variant = 'default', intensity = 'medium' } = options || {}

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) return

  const particleCount = {
    low: 50,
    medium: 100,
    high: 200,
  }[intensity]

  const config: confetti.Options = {
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    origin: { y: 0.6 },
  }

  switch (variant) {
    case 'celebratory':
      confetti({
        ...config,
        angle: 60,
        spread: 55,
        particleCount: particleCount / 2,
        origin: { x: 0 },
      })
      confetti({
        ...config,
        angle: 120,
        spread: 55,
        particleCount: particleCount / 2,
        origin: { x: 1 },
      })
      break

    case 'fireworks':
      confetti({
        ...config,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        particleCount: particleCount / 4,
        shapes: ['circle'],
      })
      break

    case 'rain':
      confetti({
        ...config,
        angle: 90,
        spread: 120,
        particleCount: particleCount / 20,
        origin: { y: -0.1 },
      })
      break

    case 'default':
    default:
      confetti({
        ...config,
        angle: 60,
        spread: 75,
        particleCount: particleCount / 10,
      })
  }
}



