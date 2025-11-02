'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'

interface Letter {
  georgian: string
  ipa: string
  transliteration: string
  englishExample: string
  category: 'vowel' | 'familiar' | 'aspirated' | 'ejective' | 'other'
  description?: string
}

interface SoundPlaygroundProps {
  letters: Letter[]
  onLetterClick?: (letter: Letter) => void
  showDescriptions?: boolean
}

export default function SoundPlayground({
  letters,
  onLetterClick,
  showDescriptions = true,
}: SoundPlaygroundProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [playingLetter, setPlayingLetter] = useState<string | null>(null)
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null)

  const categories = [
    { id: 'vowel', label: 'Vowels', color: 'from-blue-500 to-cyan-500', count: letters.filter(l => l.category === 'vowel').length },
    { id: 'familiar', label: 'Familiar', color: 'from-green-500 to-emerald-500', count: letters.filter(l => l.category === 'familiar').length },
    { id: 'aspirated', label: 'Aspirated', color: 'from-yellow-500 to-orange-500', count: letters.filter(l => l.category === 'aspirated').length },
    { id: 'ejective', label: 'Ejective', color: 'from-red-500 to-rose-500', count: letters.filter(l => l.category === 'ejective').length },
    { id: 'other', label: 'Other', color: 'from-purple-500 to-pink-500', count: letters.filter(l => l.category === 'other').length },
  ]

  const filteredLetters = selectedCategory
    ? letters.filter(l => l.category === selectedCategory)
    : letters

  const handlePlay = (letter: Letter) => {
    setCurrentLetter(letter)
    setPlayingLetter(letter.georgian)
    
    // Simulate audio playback
    setTimeout(() => {
      setPlayingLetter(null)
    }, 2000)
    
    onLetterClick?.(letter)
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-primary-900 mb-2">Sound Playground</h2>
        <p className="text-gray-600">
          Click on any letter to hear its sound. Practice pronouncing each letter.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedCategory === null
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All ({letters.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Letter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <AnimatePresence>
          {filteredLetters.map((letter, index) => (
            <motion.button
              key={letter.georgian}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handlePlay(letter)}
              disabled={playingLetter === letter.georgian}
              className={`
                group relative p-4 rounded-xl border-2 transition-all duration-300
                ${playingLetter === letter.georgian
                  ? 'border-accent bg-accent/10 scale-105'
                  : 'border-gray-200 bg-white hover:border-accent hover:shadow-lg'
                }
              `}
            >
              {/* Letter */}
              <div className="text-3xl font-bold text-primary-900 mb-2">
                {letter.georgian}
              </div>

              {/* IPA */}
              <div className="text-xs text-accent font-mono mb-1">
                {letter.ipa}
              </div>

              {/* Transliteration */}
              <div className="text-xs text-gray-600 mb-1">
                {letter.transliteration}
              </div>

              {/* Playing Indicator */}
              {playingLetter === letter.georgian && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent/20 rounded-xl">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-8 h-8 border-4 border-accent rounded-full"
                  />
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Letter Details */}
      <AnimatePresence>
        {currentLetter && showDescriptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl font-bold">{currentLetter.georgian}</div>
              <div className="flex-1">
                <div className="font-serif text-lg text-primary-900 mb-1">
                  {currentLetter.transliteration}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-mono text-accent">{currentLetter.ipa}</span>
                  {' - '}{currentLetter.englishExample}
                </div>
                {currentLetter.description && (
                  <div className="text-sm text-gray-700">
                    {currentLetter.description}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-primary-900 mb-2">How to Use</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click any letter to hear its sound (audio coming soon)</li>
          <li>• Practice saying the sound after hearing it</li>
          <li>• Use the IPA symbols to understand pronunciation</li>
          <li>• Filter by category to focus on specific sound types</li>
        </ul>
      </div>
    </GlassCard>
  )
}

