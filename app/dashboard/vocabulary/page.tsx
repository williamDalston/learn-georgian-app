'use client'

import VocabularySearch from '@/components/learning/VocabularySearch'

export default function VocabularyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-primary-900 mb-2">
          Vocabulary Search
        </h1>
        <p className="text-gray-600">
          Search through all your learned vocabulary
        </p>
      </div>

      <VocabularySearch />
    </div>
  )
}

