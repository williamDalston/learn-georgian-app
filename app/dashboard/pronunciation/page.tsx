'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/shared/GlassCard'
import AudioRecorder from '@/components/learning/AudioRecorder'
import AudioComparison from '@/components/learning/AudioComparison'
import LetterDrill from '@/components/learning/LetterDrill'
import MinimalPairPractice from '@/components/learning/MinimalPairPractice'
import type { VocabularyItem } from '@/lib/content/types'

type PracticeMode = 'menu' | 'letter-drill' | 'minimal-pairs' | 'free-practice'

export default function PronunciationPage() {
  const router = useRouter()
  const [mode, setMode] = useState<PracticeMode>('menu')

  // Sample letters for letter drill (in production, load from lessons)
  const sampleLetters: VocabularyItem[] = [
    {
      id: 'let1',
      georgian: 'ა',
      transliteration: 'a',
      translation: 'the letter a',
      ipa: '/ɑ/',
      partOfSpeech: 'vowel',
      notes: 'Vowel sound like a in father',
    },
    {
      id: 'let2',
      georgian: 'კ',
      transliteration: 'k\'',
      translation: 'the letter k (ejective)',
      ipa: '/kʼ/',
      partOfSpeech: 'consonant',
      notes: 'Ejective consonant',
    },
  ]

  // Sample minimal pairs
  const samplePairs = [
    {
      id: 'pair1',
      letter1: 'ბ',
      letter2: 'პ',
      letter1Ipa: 'b',
      letter2Ipa: 'pʼ',
      letter1Example: { word: 'ბარათი', translation: 'card' },
      letter2Example: { word: 'პაპა', translation: 'father' },
      description: 'Distinguish between voiced /b/ and ejective /pʼ/',
    },
    {
      id: 'pair2',
      letter1: 'თ',
      letter2: 'ტ',
      letter1Ipa: 'tʰ',
      letter2Ipa: 'tʼ',
      letter1Example: { word: 'თვა', translation: 'month' },
      letter2Example: { word: 'ტვინი', translation: 'stomach' },
      description: 'Distinguish between aspirated /tʰ/ and ejective /tʼ/',
    },
  ]

  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode)
  }

  const handleBackToMenu = () => {
    setMode('menu')
  }

  const handleComplete = () => {
    setMode('menu')
  }

  if (mode === 'letter-drill') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <LetterDrill letters={sampleLetters} onComplete={handleComplete} />
      </div>
    )
  }

  if (mode === 'minimal-pairs') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <MinimalPairPractice pairs={samplePairs} onComplete={handleComplete} />
      </div>
    )
  }

  if (mode === 'free-practice') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Menu
          </button>
        </div>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Free Pronunciation Practice</h2>
          <p className="text-gray-600 mb-6">
            Practice recording Georgian words and phrases at your own pace.
          </p>
          <AudioRecorder
            maxDuration={30}
            title="Record Your Pronunciation"
            description="Practice any Georgian text"
          />
        </GlassCard>
      </div>
    )
  }

  // Main menu
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-primary-900 mb-2">
          Pronunciation Practice
        </h1>
        <p className="text-gray-600">
          Master Georgian pronunciation with interactive drills and feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Letter Drill */}
        <GlassCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeChange('letter-drill')}>
          <div className="text-center">
            <div className="text-6xl font-serif text-primary-900 mb-4">ა</div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Letter Drill</h3>
            <p className="text-gray-600 text-sm mb-4">
              Practice pronouncing individual Georgian letters with native audio comparison
            </p>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Start Practice
            </button>
          </div>
        </GlassCard>

        {/* Minimal Pairs */}
        <GlassCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeChange('minimal-pairs')}>
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Minimal Pairs</h3>
            <p className="text-gray-600 text-sm mb-4">
              Practice distinguishing between similar sounds like voiced, aspirated, and ejective consonants
            </p>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Start Practice
            </button>
          </div>
        </GlassCard>

        {/* Free Practice */}
        <GlassCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeChange('free-practice')}>
          <div className="text-center">
            <div className="text-5xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Free Practice</h3>
            <p className="text-gray-600 text-sm mb-4">
              Record yourself practicing any Georgian words or phrases
            </p>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Start Practice
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Tips Section */}
      <GlassCard className="p-8 mt-8">
        <h2 className="text-2xl font-bold text-primary-900 mb-4">Tips for Better Pronunciation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent font-bold">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-1">Listen First</h4>
              <p className="text-gray-600 text-sm">
                Always listen to the native speaker before attempting to record
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent font-bold">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-1">Focus on Ejectives</h4>
              <p className="text-gray-600 text-sm">
                Spend extra time on ejective sounds (კ, პ, ტ) - they're unique to Georgian
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent font-bold">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-1">Practice Daily</h4>
              <p className="text-gray-600 text-sm">
                Regular practice is key - even 10 minutes a day makes a difference
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent font-bold">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-1">Use Feedback</h4>
              <p className="text-gray-600 text-sm">
                Listen to your recordings compared to native speakers
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

