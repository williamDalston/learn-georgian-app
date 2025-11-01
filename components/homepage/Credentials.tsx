import Container from '@/components/shared/Container'

interface Credential {
  title: string
  description?: string
  icon?: string
}

interface CredentialsProps {
  credentials?: Credential[]
}

const defaultCredentials: Credential[] = [
  {
    title: 'PhD in Psychology',
    description: 'Specialized in contemplative neuroscience',
  },
  {
    title: 'Certified Meditation Teacher',
    description: '20+ years of teaching experience',
  },
  {
    title: 'Published Author',
    description: 'Multiple books on inner transformation',
  },
  {
    title: 'Featured Expert',
    description: 'Regular contributor to leading wellness publications',
  },
]

export default function Credentials({
  credentials = defaultCredentials,
}: CredentialsProps) {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-900 mb-3 sm:mb-4 font-bold">
            Credentials & Authority
          </h2>
          <p className="text-base sm:text-lg font-sans text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Built on decades of study, practice, and real-world application
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {credentials.map((credential, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-neutral-50 to-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-100 hover:border-neutral-200 relative overflow-hidden group"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative">
                {credential.icon && (
                  <div className="text-3xl sm:text-4xl mb-4 text-accent transition-transform duration-300 group-hover:scale-110">
                    {credential.icon}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-serif text-primary-900 mb-2.5 sm:mb-3 leading-tight font-semibold">
                  {credential.title}
                </h3>
                {credential.description && (
                  <p className="text-sm sm:text-base font-sans text-gray-600 leading-relaxed">
                    {credential.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

