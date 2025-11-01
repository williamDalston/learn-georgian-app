import Container from '@/components/shared/Container'

interface Module {
  week: string
  title: string
  description: string
}

const modules: Module[] = [
  {
    week: 'Week 1',
    title: 'Understanding Your Inner Self',
    description: 'Learn to recognize your reactive patterns and understand the nature of your mind.',
  },
  {
    week: 'Week 2',
    title: 'Healing Past Wounds',
    description: 'Discover practical tools for processing past trauma and emotional pain with compassion.',
  },
  {
    week: 'Week 3',
    title: 'Breaking Reactive Patterns',
    description: 'Develop skills to pause, observe, and respond instead of automatically reacting.',
  },
  {
    week: 'Week 4',
    title: 'Building Emotional Resilience',
    description: 'Strengthen your capacity to navigate difficult emotions with grace and wisdom.',
  },
  {
    week: 'Week 5',
    title: 'Cultivating Inner Peace',
    description: 'Learn meditation practices and mindfulness techniques that create lasting calm.',
  },
  {
    week: 'Week 6',
    title: 'Living with Purpose',
    description: 'Align your actions with your values and create a life of meaning and fulfillment.',
  },
]

export default function CourseOutline() {
  return (
    <section className="section-padding bg-neutral-100">
      <Container>
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
            Your Journey to Inner Freedom
          </h2>
          <p className="text-base sm:text-lg font-sans text-gray-700 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            A structured, self-paced program designed to guide you step-by-step toward lasting transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-100 hover:border-accent/30 relative overflow-hidden group"
            >
              {/* Decorative gradient on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center shadow-md ring-2 ring-accent/20 transition-all duration-300 group-hover:ring-accent/40 group-hover:shadow-lg group-hover:scale-110">
                    <span className="text-white font-sans font-bold text-base sm:text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-sans font-semibold text-accent uppercase tracking-wide">
                      {module.week}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-serif text-primary-900 mb-2 sm:mb-3 leading-tight font-semibold group-hover:text-primary-800 transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm sm:text-base font-sans text-gray-700 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12 px-4 sm:px-0">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-neutral-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-base sm:text-lg font-sans text-gray-700">
                <span className="font-semibold text-primary-900">Self-paced learning:</span> Progress at your own rhythm. 
                All content is available immediately upon enrollment.
              </p>
            </div>
            <p className="text-sm sm:text-base font-sans text-gray-600">
              Plus bonus materials, theory lectures, and ongoing updates added regularly.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
