'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import CTAButton from '@/components/shared/CTAButton'

interface MinimalPair {
  pair: [string, string]
  letters: string[]
  ipa: string[]
  type: 'voiced-vs-aspirated' | 'voiced-vs-ejective' | 'aspirated-vs-ejective' | 'throat-sounds' | 'tripartite'
  description: string
  examples?: {
    georgian: string
    transliteration: string
    translation: string
  }[]
}

interface PhonologyAwarenessProps {
  exerciseType?: 'minimal-pairs' | 'sound-isolation' | 'sound-blending'
}

const minimalPairs: MinimalPair[] = [
  {
    pair: ['ბ /b/ vs თ /tʰ/', 'ბ /b/ vs თ /tʰ/'],
    letters: ['ბ', 'თ'],
    ipa: ['/b/', '/tʰ/'],
    type: 'voiced-vs-aspirated',
    description: 'Distinguish between voiced /b/ and aspirated /tʰ/. The voiced sound has vibration; the aspirated has a puff of air.',
    examples: [
      { georgian: 'ბარი', transliteration: 'bari', translation: 'bar' },
      { georgian: 'თაგვი', transliteration: 'tagvi', translation: 'mouse' },
    ],
  },
  {
    pair: ['ბ /b/ vs პ /pʼ/', 'ბ /b/ vs პ /pʼ/'],
    letters: ['ბ', 'პ'],
    ipa: ['/b/', '/pʼ/'],
    type: 'voiced-vs-ejective',
    description: 'Distinguish between voiced /b/ and ejective /pʼ/. The voiced sound has vibration; the ejective has a glottal pop.',
    examples: [
      { georgian: 'ბარი', transliteration: 'bari', translation: 'bar' },
      { georgian: 'პარი', transliteration: "p'ari", translation: 'spring' },
    ],
  },
  {
    pair: ['დ /d/ vs თ /tʰ/ vs ტ /tʼ/', 'დ /d/ vs თ /tʰ/ vs ტ /tʼ/'],
    letters: ['დ', 'თ', 'ტ'],
    ipa: ['/d/', '/tʰ/', '/tʼ/'],
    type: 'tripartite',
    description: 'Master the three-way distinction: voiced /d/, aspirated /tʰ/, and ejective /tʼ/. This is a key challenge in Georgian!',
    examples: [
      { georgian: 'დედა', transliteration: 'deda', translation: 'mother' },
      { georgian: 'თევზა', transliteration: 'tevza', translation: 'eagle' },
      { georgian: 'ტატა', transliteration: "t'at'a", translation: 'dad' },
    ],
  },
  {
    pair: ['ხ /x/ vs ღ /ɣ/', 'ხ /x/ vs ღ /ɣ/'],
    letters: ['ხ', 'ღ'],
    ipa: ['/x/', '/ɣ/'],
    type: 'throat-sounds',
    description: 'Distinguish voiceless /x/ from voiced /ɣ/. Both are made in the back of the throat.',
    examples: [
      { georgian: 'ხარი', transliteration: 'xari', translation: 'bull' },
      { georgian: 'ღამე', transliteration: 'ɣame', translation: 'night' },
    ],
  },
]

export default function PhonologyAwareness({ exerciseType = 'minimal-pairs' }: PhonologyAwarenessProps) {
  const [selectedPair, setSelectedPair] = useState<MinimalPair | null>(null)
  const [mode, setMode] = useState<'discrimination' | 'production'>('discrimination')
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const handleDiscriminationExercise = () => {
    // TODO: Implement actual discrimination exercise
    // For now, just track attempts
    setTotalAttempts(totalAttempts + 1)
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-primary-900 mb-2">
          Phonological Awareness Training
        </h2>
        <p className="text-gray-600 mb-4">
          Develop your ability to hear and produce subtle sound differences in Georgian.
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('discrimination')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              mode === 'discrimination'
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Discrimination (Hear)
          </button>
          <button
            onClick={() => setMode('production')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              mode === 'production'
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Production (Speak)
          </button>
        </div>
      </div>

      {/* Minimal Pairs Display */}
      {exerciseType === 'minimal-pairs' && (
        <div className="space-y-4 mb-6">
          {minimalPairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPair(selectedPair === pair ? null : pair)}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedPair === pair
                  ? 'border-accent bg-accent/10 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-accent/50 hover:shadow'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {pair.letters.map((letter, i) => (
                      <div
                        key={i}
                        className="text-3xl font-bold text-primary-900"
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 text-sm">
                    {pair.ipa.map((ipa, i) => (
                      <span key={i} className="font-mono text-accent">
                        {ipa}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                  {pair.type.replace(/-/g, ' ')}
                </div>
              </div>
              <p className="text-sm text-gray-600">{pair.description}</p>

              {/* Examples */}
              {pair.examples && (
                <div className="mt-3 space-y-1">
                  {pair.examples.map((ex, i) => (
                    <div key={i} className="text-xs text-gray-700">
                      <span className="font-bold">{ex.georgian}</span> ({ex.transliteration}) - {ex.translation}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Practice Button */}
      {selectedPair && mode === 'discrimination' && (
        <div className="mt-6">
          <CTAButton
            onClick={handleDiscriminationExercise}
            className="w-full"
          >
            Practice Discrimination Exercise
          </CTAButton>
          <div className="mt-4 text-center text-sm text-gray-600">
            Score: {score}/{totalAttempts}
          </div>
        </div>
      )}

      {/* Production Mode Instructions */}
      {mode === 'production' && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-primary-900 mb-2">Production Practice</h3>
          <p className="text-sm text-gray-700 mb-3">
            Practice saying the sounds in each pair. Record yourself and compare with native audio.
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. Click on a minimal pair above</li>
            <li>2. Listen to the native pronunciation (audio coming soon)</li>
            <li>3. Record yourself saying both sounds</li>
            <li>4. Compare your pronunciation with native audio</li>
            <li>5. Repeat until you can clearly distinguish the sounds</li>
          </ul>
        </div>
      )}

      {/* Progress Indicator */}
      {totalAttempts > 0 && (
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">
            Progress
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / totalAttempts) * 100}%` }}
              className="bg-gradient-to-r from-accent to-accent-dark h-full"
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Accuracy: {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%
          </div>
        </div>
      )}
    </GlassCard>
  )
}

