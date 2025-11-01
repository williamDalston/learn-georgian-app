'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CTAButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

export default function CTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  size = 'md',
  fullWidth = false,
  disabled = false,
}: CTAButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const baseClasses = 'font-sans font-bold rounded-lg shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center justify-center min-h-[44px] touch-manipulation relative overflow-hidden group'
  
  const variantClasses = {
    primary: disabled 
      ? 'bg-gray-400 text-white cursor-not-allowed' 
      : 'bg-gradient-to-r from-accent to-accent-dark text-white hover:from-accent-dark hover:to-accent focus-visible:ring-accent shadow-accent/30',
    secondary: disabled
      ? 'bg-gray-400 text-white cursor-not-allowed'
      : 'bg-gradient-to-r from-primary-900 to-primary-800 text-white hover:from-primary-800 hover:to-primary-900 focus-visible:ring-primary-900',
  }

  const sizeClasses = {
    sm: 'py-2.5 px-4 text-sm sm:py-3 sm:px-5',
    md: 'py-3 px-6 text-base sm:py-4 sm:px-7',
    lg: 'py-4 px-8 text-lg sm:py-5 sm:px-10',
  }

  const widthClasses = fullWidth ? 'w-full' : 'w-full sm:w-auto'

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
    }, 600)

    onClick?.()
  }

  // Glow effect for primary buttons
  const glowEffect = variant === 'primary' && !disabled && (
    <motion.span
      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
      style={{
        background: 'radial-gradient(circle, rgba(255,125,50,0.4) 0%, transparent 70%)',
        filter: 'blur(20px)',
      }}
      animate={{
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  )

  // Shimmer effect overlay
  const shimmerOverlay = (
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      initial={{ x: '-100%' }}
      whileHover={{ x: '200%' }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  )

  const buttonContent = (
    <>
      {glowEffect}
      {shimmerOverlay}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/40"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          animate={{
            width: 200,
            height: 200,
            opacity: [0.6, 0],
            x: -100,
            y: -100,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          aria-hidden="true"
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
        style={{ width: fullWidth ? '100%' : 'auto' }}
      >
        <Link 
          href={href} 
          className={combinedClasses}
          onClick={handleClick}
          aria-disabled={disabled}
        >
          {buttonContent}
        </Link>
      </motion.div>
    )
  }

  // Otherwise render as button
  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={combinedClasses}
      aria-disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {buttonContent}
    </motion.button>
  )
}
