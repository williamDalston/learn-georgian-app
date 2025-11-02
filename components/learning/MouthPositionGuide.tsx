'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'

interface SoundGuide {
  georgian: string
  ipa: string
  placeOfArticulation: string
  mannerOfArticulation: string
  voicing: 'voiced' | 'voiceless'
  description: string
  instruction: string
  commonMistakes: string[]
  tips: string[]
  contrast?: string
}

const soundGuides: SoundGuide[] = [
  {
    georgian: 'კ',
    ipa: '/kʼ/',
    placeOfArticulation: 'Velar (back of tongue to soft palate)',
    mannerOfArticulation: 'Ejective stop',
    voicing: 'voiceless',
    description: 'Ejective K - Produced with a glottal closure followed by a sharp release',
    instruction: '1. Place the back of your tongue against your soft palate.\n2. Close your glottis (at the base of your throat).\n3. Build air pressure in your throat.\n4. Release with a sharp "pop" sound.',
    commonMistakes: [
      'Confusing with regular /k/',
      'Not building enough glottal pressure',
      'Releasing too slowly',
    ],
    tips: [
      'Think of it like cracking your knuckles but in your throat',
      'Practice by saying "k" while holding your breath',
      'The sound should feel like a pop in the back of your throat',
    ],
    contrast: 'Different from კ (regular K) and ქ (aspirated K)',
  },
  {
    georgian: 'რ',
    ipa: '/r/',
    placeOfArticulation: 'Alveolar (tongue tip to alveolar ridge)',
    mannerOfArticulation: 'Trill',
    voicing: 'voiced',
    description: 'Rolled R - Tongue tip vibrates rapidly against alveolar ridge',
    instruction: '1. Curl the tip of your tongue upward.\n2. Place it lightly against the alveolar ridge (just behind teeth).\n3. Blow air over your tongue to create vibration.\n4. Maintain steady vibration.',
    commonMistakes: [
      'Using English R instead (no vibration)',
      'Creating friction instead of vibration',
      'Rolling from throat instead of tongue tip',
    ],
    tips: [
      'Try saying "drrrr" - the D helps position your tongue',
      'Practice with "prrrr" - the P builds air pressure',
      'Start with a single tap, then extend it',
    ],
  },
  {
    georgian: 'ღ',
    ipa: '/ɣ/',
    placeOfArticulation: 'Velar/Pharyngeal (back of throat)',
    mannerOfArticulation: 'Fricative',
    voicing: 'voiced',
    description: 'Voiced velar fricative - Like clearing your throat WITH voice',
    instruction: '1. Open your mouth slightly.\n2. Place tongue low in your mouth.\n3. Constrict your throat slightly.\n4. Produce sound with vocal cords vibrating.',
    commonMistakes: [
      'Confusing with voiceless ხ /x/',
      'Using too much friction',
      'Not vibrating vocal cords',
    ],
    tips: [
      'Like French R but at the back of throat',
      'Feels like vibrating your throat',
      'Contrast with ხ /x/ - one has voice, one doesn\'t',
    ],
    contrast: 'Different from ხ /x/ (voiceless throat sound)',
  },
  {
    georgian: 'პ',
    ipa: '/pʼ/',
    placeOfArticulation: 'Bilabial (both lips)',
    mannerOfArticulation: 'Ejective stop',
    voicing: 'voiceless',
    description: 'Ejective P - Bilabial stop with glottal closure',
    instruction: '1. Close your lips tightly.\n2. Close your glottis (throat closure).\n3. Build air pressure in your throat.\n4. Release with a sharp pop.',
    commonMistakes: [
      'Not using glottal closure',
      'Confusing with regular /p/',
      'Aspirating the sound',
    ],
    tips: [
      'Contrast with ბ /b/ (voiced) and ფ /p/ (aspirated)',
      'Practice with minimal pairs: ბარი vs პარი',
      'The release should feel explosive',
    ],
    contrast: 'Different from ბ /b/ (voiced) and ფ /p/ (aspirated)',
  },
  {
    georgian: 'ტ',
    ipa: '/tʼ/',
    placeOfArticulation: 'Alveolar (tongue tip to alveolar ridge)',
    mannerOfArticulation: 'Ejective stop',
    voicing: 'voiceless',
    description: 'Ejective T - Alveolar stop with glottal closure',
    instruction: '1. Place tongue tip against alveolar ridge.\n2. Close your glottis.\n3. Build air pressure in throat.\n4. Release with sharp pop.',
    commonMistakes: [
      'Using English T instead',
      'Not building glottal pressure',
      'Aspirating the release',
    ],
    tips: [
      'Contrast with დ /d/ (voiced) and თ /tʰ/ (aspirated)',
      'Triplet: დ (voiced) - თ (aspirated) - ტ (ejective)',
      'Practice: deda - tevza - t\'at\'a',
    ],
    contrast: 'Different from დ /d/ (voiced) and თ /tʰ/ (aspirated)',
  },
  {
    georgian: 'ყ',
    ipa: '/qʼ/',
    placeOfArticulation: 'Uvular (back of tongue to uvula)',
    mannerOfArticulation: 'Ejective stop',
    voicing: 'voiceless',
    description: 'Ejective Q - Like /kʼ/ but further back in throat',
    instruction: '1. Place back of tongue against uvula (dangling thing in throat).\n2. Close your glottis.\n3. Build air pressure.\n4. Release with explosive pop.',
    commonMistakes: [
      'Confusing with კ /kʼ/ (velar ejective)',
      'Not going back far enough',
      'Using regular K instead',
    ],
    tips: [
      'This is the furthest back consonant in Georgian',
      'Hang your tongue low and go as far back as possible',
      'Feels like a "K" made with your throat closing',
    ],
    contrast: 'Different from კ /kʼ/ (velar ejective)',
  },
]

export default function MouthPositionGuide() {
  const [selectedSound, setSelectedSound] = useState<SoundGuide>(soundGuides[0])
  const [showInstructions, setShowInstructions] = useState(true)

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-primary-900 mb-2">
          Articulatory Guidance
        </h2>
        <p className="text-gray-600">
          Learn how to physically produce challenging Georgian sounds with detailed mouth position and articulation guides.
        </p>
      </div>

      {/* Sound Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {soundGuides.map((sound) => (
          <button
            key={sound.georgian}
            onClick={() => {
              setSelectedSound(sound)
              setShowInstructions(true)
            }}
            className={`
              px-4 py-2 rounded-lg transition-all
              ${selectedSound.georgian === sound.georgian
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            <div className="text-2xl font-bold">{sound.georgian}</div>
            <div className="text-xs">{sound.ipa}</div>
          </button>
        ))}
      </div>

      {/* Sound Details */}
      <motion.div
        key={selectedSound.georgian}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Letter Display */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
          <div>
            <div className="text-5xl font-bold text-primary-900 mb-2">
              {selectedSound.georgian}
            </div>
            <div className="text-xl font-mono text-accent mb-4">
              {selectedSound.ipa}
            </div>
            <p className="text-gray-700">{selectedSound.description}</p>
          </div>
          <div className="text-6xl">👄</div>
        </div>

        {/* Technical Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-primary-900 mb-2">Place of Articulation</h3>
            <p className="text-sm text-gray-700">{selectedSound.placeOfArticulation}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-primary-900 mb-2">Manner of Articulation</h3>
            <p className="text-sm text-gray-700">{selectedSound.mannerOfArticulation}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="font-semibold text-primary-900 mb-2">Voicing</h3>
            <p className="text-sm text-gray-700 capitalize">{selectedSound.voicing}</p>
          </div>
          {selectedSound.contrast && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-primary-900 mb-2">Distinction</h3>
              <p className="text-sm text-gray-700">{selectedSound.contrast}</p>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-900">Step-by-Step Instructions</h3>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm text-accent hover:underline"
            >
              {showInstructions ? 'Hide' : 'Show'}
            </button>
          </div>
          {showInstructions && (
            <div className="space-y-2 whitespace-pre-line text-gray-700">
              {selectedSound.instruction.split('\n').map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <span className="flex-1">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-primary-900 mb-3">💡 Tips</h3>
          <ul className="space-y-2">
            {selectedSound.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-accent">•</span>
                <span className="flex-1">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
          <h3 className="font-semibold text-primary-900 mb-3">⚠️ Common Mistakes</h3>
          <ul className="space-y-2">
            {selectedSound.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-red-600">✗</span>
                <span className="flex-1">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Practice Button */}
        <button className="w-full px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors font-semibold">
          Practice This Sound
        </button>
      </motion.div>
    </GlassCard>
  )
}

