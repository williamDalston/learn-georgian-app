'use client'

import Container from '@/components/shared/Container'
import Image from 'next/image'
import { useState } from 'react'

interface LogoItem {
  name: string
  logo: string
  alt: string
  url?: string
}

interface LogoCloudProps {
  title?: string
  logos?: LogoItem[]
}

const defaultLogos: LogoItem[] = [
  {
    name: 'New York Times',
    logo: '/logos/nyt-logo.png',
    alt: 'New York Times',
  },
  {
    name: 'Psychology Today',
    logo: '/logos/psychology-today-logo.png',
    alt: 'Psychology Today',
  },
  {
    name: 'Mindful Magazine',
    logo: '/logos/mindful-logo.png',
    alt: 'Mindful Magazine',
  },
  {
    name: 'Harvard Business Review',
    logo: '/logos/hbr-logo.png',
    alt: 'Harvard Business Review',
  },
]

export default function LogoCloud({
  title = "As Seen In",
  logos = defaultLogos,
}: LogoCloudProps) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set(prev).add(index))
  }

  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-serif text-primary-900 mb-2 sm:mb-3 font-bold">
            {title}
          </h2>
          <p className="text-sm sm:text-base font-sans text-gray-600 px-4 sm:px-0 leading-relaxed">
            Trusted by leading publications and media outlets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center justify-items-center max-w-5xl mx-auto px-4 sm:px-0">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 w-full group"
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full max-w-[150px] sm:max-w-[180px] h-12 sm:h-16 relative focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                  aria-label={`${logo.name} - Opens in new window`}
                >
                  <Image
                    src={logo.logo}
                    alt={logo.alt}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                    loading="lazy"
                  />
                </a>
              ) : (
                <div className="w-full max-w-[150px] sm:max-w-[180px] h-12 sm:h-16 relative group">
                  {!failedImages.has(index) ? (
                    <Image
                      src={logo.logo}
                      alt={logo.alt}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 rounded">
                      <span className="text-xs sm:text-sm font-sans text-gray-400 text-center px-2">
                        {logo.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Text fallback for screen readers */}
        <div className="sr-only">
          {logos.map((logo, index) => (
            <div key={index}>
              {logo.name}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

