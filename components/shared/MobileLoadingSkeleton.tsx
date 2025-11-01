interface SkeletonProps {
  width?: string
  height?: string
  className?: string
}

function Skeleton({ width = '100%', height = '1rem', className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

interface MobileCardSkeletonProps {
  count?: number
}

export function MobileCardSkeleton({ count = 3 }: MobileCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-5 sm:p-6 animate-pulse"
        >
          <Skeleton height="2rem" className="mb-4" />
          <Skeleton height="1rem" className="mb-2" />
          <Skeleton height="1rem" width="80%" />
        </div>
      ))}
    </div>
  )
}

interface MobileTextSkeletonProps {
  lines?: number
}

export function MobileTextSkeleton({ lines = 3 }: MobileTextSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

interface MobileImageSkeletonProps {
  aspectRatio?: 'square' | 'video' | 'wide'
}

export function MobileImageSkeleton({ aspectRatio = 'square' }: MobileImageSkeletonProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }

  return (
    <div
      className={`${aspectClasses[aspectRatio]} bg-gray-200 rounded-lg animate-pulse`}
      aria-hidden="true"
    />
  )
}

export default function MobileLoadingSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton height="2.5rem" width="60%" />
      <MobileTextSkeleton lines={4} />
      <MobileImageSkeleton aspectRatio="video" />
    </div>
  )
}

