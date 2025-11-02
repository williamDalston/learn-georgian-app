'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import GlassCard from '@/components/shared/GlassCard'
import type { VocabularyItem } from '@/lib/content/types'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { speakGeorgian, isSpeaking, stopSpeaking, isSpeechSupported } from '@/lib/utils/text-to-speech'

interface FlashcardProps {
  vocabulary: VocabularyItem & { lessonId?: string; level?: string }
  isFlipped: boolean
  onFlip: () => void
  onKnow: () => void
  onStudyMore: () => void
  cardIndex?: number
  totalCards?: number
}

export default function Flashcard({
  vocabulary,
  isFlipped,
  onFlip,
  onKnow,
  onStudyMore,
  cardIndex,
  totalCards,
}: FlashcardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    setSpeechSupported(isSpeechSupported())
  }, [])

  const handlePlayAudio = () => {
    if (isPlaying && isSpeaking()) {
      stopSpeaking()
      setIsPlaying(false)
    } else {
      stopSpeaking()
      speakGeorgian(vocabulary.georgian, {
        rate: 0.75,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ perspective: '1000px' }}>
      {/* Card Counter */}
      {cardIndex !== undefined && totalCards !== undefined && (
        <div className="text-center mb-4 text-sm text-gray-600">
          Card {cardIndex + 1} of {totalCards}
        </div>
      )}

      {/* Flashcard */}
      <div className="relative w-full h-[400px] cursor-pointer" onClick={onFlip}>
        <motion.div
          className="relative w-full h-full"
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.6,
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <GlassCard
              className="w-full h-full p-8 flex flex-col justify-center items-center"
              hoverable={false}
            >
              <div className="text-center space-y-6">
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Georgian
                  </span>
                </div>
                <h2 className="text-5xl sm:text-6xl font-serif text-primary-900 mb-4">
                  {vocabulary.georgian}
                </h2>
                <div className="flex flex-col items-center gap-2">
                  {vocabulary.transliteration && (
                    <p className="text-xl sm:text-2xl text-gray-600 font-sans italic flex items-center gap-3">
                      {vocabulary.transliteration}
                      {speechSupported && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayAudio()
                          }}
                          className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent hover:text-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                          aria-label="Play pronunciation"
                          title="Listen to pronunciation"
                        >
                          {isPlaying && isSpeaking() ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.769 13H3a1 1 0 01-1-1V8a1 1 0 011-1h1.769l3.614-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      )}
                    </p>
                  )}
                  {vocabulary.ipa && (
                    <p className="text-sm text-gray-500 font-mono">
                      /{vocabulary.ipa}/
                    </p>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Click or press Space to flip
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <GlassCard
              className="w-full h-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50"
              hoverable={false}
            >
              <div className="text-center space-y-6 w-full">
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Translation
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {vocabulary.translation}
                </h3>
                {vocabulary.partOfSpeech && (
                  <p className="text-sm text-gray-500 italic">
                    {vocabulary.partOfSpeech}
                  </p>
                )}
                {vocabulary.exampleSentence && (
                  <div className="mt-6 p-4 bg-white/60 rounded-lg border border-gray-200">
                    <p className="text-lg font-serif text-primary-900 mb-2">
                      {vocabulary.exampleSentence.georgian}
                    </p>
                    <p className="text-sm text-gray-600 italic mb-1">
                      {vocabulary.exampleSentence.transliteration}
                    </p>
                    <p className="text-sm text-gray-700">
                      {vocabulary.exampleSentence.translation}
                    </p>
                  </div>
                )}
                {vocabulary.notes && (
                  <p className="text-sm text-gray-600 mt-4 italic">
                    {vocabulary.notes}
                  </p>
                )}
                {vocabulary.lessonId && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Lesson: {vocabulary.lessonId.toUpperCase()}
                      {vocabulary.level && ` • Level: ${vocabulary.level}`}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons (shown when flipped) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 justify-center mt-6"
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onStudyMore()
            }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Study More
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onKnow()
            }}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            I Know This
          </button>
        </motion.div>
      )}
    </div>
  )
}

