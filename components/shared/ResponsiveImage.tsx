'use client'

import Image, { ImageProps } from 'next/image'

interface ResponsiveImageProps extends Omit<ImageProps, 'sizes'> {
  mobileSize?: string
  tabletSize?: string
  desktopSize?: string
  priority?: boolean
}

export default function ResponsiveImage({
  mobileSize = '100vw',
  tabletSize = '50vw',
  desktopSize = '33vw',
  priority = false,
  className = '',
  ...props
}: ResponsiveImageProps) {
  // Generate responsive sizes string
  const sizes = `(max-width: 640px) ${mobileSize}, (max-width: 1024px) ${tabletSize}, ${desktopSize}`

  return (
    <Image
      {...props}
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      className={`w-full h-auto ${className}`}
    />
  )
}

