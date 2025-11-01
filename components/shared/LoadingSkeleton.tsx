interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect' | 'card'
  lines?: number
  animated?: boolean
}

export default function LoadingSkeleton({
  className = '',
  variant = 'rect',
  lines = 3,
  animated = true,
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-neutral-200 rounded'
  const animationClass = animated ? 'animate-pulse' : ''

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${animationClass} h-4`}
            style={{
              width: index === lines - 1 ? '80%' : '100%',
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div className={`${baseClasses} ${animationClass} aspect-square ${className}`} />
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${animationClass} p-6 space-y-4 ${className}`}>
        <div className="h-4 bg-neutral-300 rounded w-3/4" />
        <div className="h-4 bg-neutral-300 rounded w-full" />
        <div className="h-4 bg-neutral-300 rounded w-5/6" />
      </div>
    )
  }

  // Default: rect
  return <div className={`${baseClasses} ${animationClass} ${className}`} />
}

