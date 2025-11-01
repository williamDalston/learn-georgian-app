import { ReactNode } from 'react'
import Link from 'next/link'

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
  const baseClasses = 'font-sans font-bold rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center justify-center min-h-[44px] touch-manipulation transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none will-change-transform relative overflow-hidden group'
  
  const variantClasses = {
    primary: disabled 
      ? 'bg-gray-400 text-white cursor-not-allowed' 
      : 'bg-accent text-white hover:bg-accent-dark hover:shadow-xl active:bg-accent-700 focus-visible:ring-accent',
    secondary: disabled
      ? 'bg-gray-400 text-white cursor-not-allowed'
      : 'bg-primary-900 text-white hover:bg-primary-800 hover:shadow-xl active:bg-primary-700 focus-visible:ring-primary-900',
  }

  const sizeClasses = {
    sm: 'py-2.5 px-4 text-sm sm:py-3 sm:px-5',
    md: 'py-3 px-6 text-base sm:py-4 sm:px-7',
    lg: 'py-4 px-8 text-lg sm:py-5 sm:px-10',
  }

  const widthClasses = fullWidth ? 'w-full' : 'w-full sm:w-auto'

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`

  // Shimmer effect overlay
  const shimmerOverlay = (
    <span 
      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent"
      aria-hidden="true"
    />
  )

  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses} aria-disabled={disabled}>
        {shimmerOverlay}
        <span className="relative z-10">{children}</span>
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-disabled={disabled}
    >
      {shimmerOverlay}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
