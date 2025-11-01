import Container from '@/components/shared/Container'
import Image from 'next/image'

interface TeacherBioProps {
  photo?: string
  photoAlt?: string
  credentials?: {
    author?: string
    degree?: string
    experience?: string
    featuredIn?: string[]
  }
  personalNarrative?: string
  philosophy?: string
}

export default function TeacherBio({
  photo = '/images/teacher-photo.jpg',
  photoAlt = 'Your guide to inner freedom',
  credentials = {
    author: 'The Path to Inner Freedom',
    degree: 'PhD in Psychology',
    experience: '20+ Years Guiding Individuals to Inner Freedom',
    featuredIn: ['New York Times', 'Psychology Today', 'Mindful Magazine'],
  },
  personalNarrative = 'My journey to inner freedom wasn\'t a straight line. Like many seekers, I found myself stuck in patterns of reactivity and emotional turmoil, searching for answers in books, retreats, and spiritual practices. Through years of dedicated practice and study, I discovered that true transformation comes not from dogmatic approaches or quick fixes, but from understanding the nature of the mind itself. This program is the practical framework I wish I had when I started—one that bridges ancient wisdom with modern science, and guides you step-by-step toward genuine inner freedom.',
  philosophy = 'This program is different. We move beyond dogma and "quick fixes." This is a practical, science-backed framework for understanding your mind and fundamentally changing your relationship with the world. Here, you\'ll find no New Age fluff, but also no overly cerebral rabbit holes. Instead, you\'ll discover a structured, empathetic path that honors both the wisdom traditions and the latest insights from neuroscience and psychology.',
}: TeacherBioProps) {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Photo & Credentials */}
          <div className="flex-shrink-0 lg:w-1/3">
            {/* Teacher Photo */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-6 bg-gradient-to-br from-primary-200 to-secondary-200 ring-1 ring-neutral-200/50 group">
              <Image
                src={photo}
                alt={photoAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                priority
                loading="eager"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Credentials Section */}
            <div className="space-y-4 px-4 sm:px-0">
              <h3 className="text-lg sm:text-xl font-serif text-primary-900 mb-3 sm:mb-4 font-semibold">
                Meet Your Guide
              </h3>
              
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-sm sm:text-base text-gray-700" role="list">
                {credentials.author && (
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                    <span>Author of <em className="font-semibold text-primary-900 not-italic">{credentials.author}</em></span>
                  </li>
                )}
                {credentials.degree && (
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                    <span>{credentials.degree}</span>
                  </li>
                )}
                {credentials.experience && (
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                    <span>{credentials.experience}</span>
                  </li>
                )}
                {credentials.featuredIn && credentials.featuredIn.length > 0 && (
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent mt-1.5 flex-shrink-0">•</span>
                    <span>
                      Featured in{' '}
                      {credentials.featuredIn.map((outlet, index) => (
                        <span key={outlet}>
                          {index > 0 && index < credentials.featuredIn!.length - 1 && ', '}
                          {index === credentials.featuredIn!.length - 1 && index > 0 && ' and '}
                          <em className="font-semibold text-primary-900 not-italic">{outlet}</em>
                        </span>
                      ))}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Narrative & Philosophy */}
          <div className="flex-1 lg:w-2/3 px-4 sm:px-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary-900 mb-4 sm:mb-6">
              My journey to inner freedom wasn't a straight line.
            </h3>

            {/* Personal Narrative */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 sm:mb-8">
              <p className="text-base sm:text-lg font-sans text-gray-700 leading-relaxed mb-4 sm:mb-6">
                {personalNarrative}
              </p>
            </div>

            {/* Philosophy Statement */}
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-lg p-4 sm:p-6 md:p-8 border-l-4 border-accent shadow-sm relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-accent mt-1">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-sans text-gray-800 leading-relaxed italic">
                  {philosophy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

