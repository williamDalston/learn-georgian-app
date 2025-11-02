'use client'

import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import type { VocabularyItem } from '@/lib/content/types'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

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
                {vocabulary.transliteration && (
                  <p className="text-xl sm:text-2xl text-gray-600 font-sans italic">
                    {vocabulary.transliteration}
                  </p>
                )}
                {vocabulary.ipa && (
                  <p className="text-sm text-gray-500 font-mono">
                    /{vocabulary.ipa}/
                  </p>
                )}
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

