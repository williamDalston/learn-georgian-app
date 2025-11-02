'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'

interface AudioComparisonProps {
  userAudio: Blob | null
  nativeAudioUrl: string
  text: string
  transliteration?: string
  onNewRecording?: () => void
  className?: string
}

export default function AudioComparison({
  userAudio,
  nativeAudioUrl,
  text,
  transliteration,
  onNewRecording,
  className = '',
}: AudioComparisonProps) {
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null)
  const [isPlayingUser, setIsPlayingUser] = useState(false)
  const [isPlayingNative, setIsPlayingNative] = useState(false)
  const [comparisonScore, setComparisonScore] = useState<number | null>(null)

  // Clean up audio URLs
  useEffect(() => {
    if (userAudio) {
      const url = URL.createObjectURL(userAudio)
      setUserAudioUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setUserAudioUrl(null)
    }
  }, [userAudio])

  const playAudio = async (
    audioUrl: string,
    setIsPlaying: (playing: boolean) => void
  ) => {
    try {
      setIsPlaying(true)
      const audio = new Audio(audioUrl)
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
      })

      audio.addEventListener('error', () => {
        setIsPlaying(false)
      })

      await audio.play()
    } catch (error) {
      console.error('Failed to play audio', error)
      setIsPlaying(false)
    }
  }

  const handlePlayUser = () => {
    if (userAudioUrl) {
      playAudio(userAudioUrl, setIsPlayingUser)
    }
  }

  const handlePlayNative = () => {
    if (nativeAudioUrl) {
      playAudio(nativeAudioUrl, setIsPlayingNative)
    }
  }

  const handleCompare = async () => {
    // Placeholder for actual comparison logic
    // In a real implementation, you would send audio to a backend service
    // or use Web Audio API to analyze waveforms
    setComparisonScore(Math.floor(Math.random() * 100)) // Placeholder
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <GlassCard className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary-900 mb-2">
            Compare Your Pronunciation
          </h3>
          <p className="text-gray-600">
            Listen to both recordings and compare them
          </p>
        </div>

        {/* Text to Pronounce */}
        <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <div className="text-center">
            <div className="text-4xl font-serif text-primary-900 mb-2">
              {text}
            </div>
            {transliteration && (
              <div className="text-2xl text-gray-600 font-sans italic">
                {transliteration}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Native Audio */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Native Speaker
              </h4>
            </div>
            
            <button
              onClick={handlePlayNative}
              disabled={isPlayingNative}
              className="w-full p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg hover:border-green-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-75"
            >
              <div className="flex flex-col items-center gap-3">
                {isPlayingNative ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                  </motion.div>
                ) : (
                  <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-lg font-medium text-green-900">
                  {isPlayingNative ? 'Playing...' : 'Play Native'}
                </span>
              </div>
            </button>
          </div>

          {/* User Audio */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your Recording
              </h4>
            </div>

            {userAudioUrl ? (
              <button
                onClick={handlePlayUser}
                disabled={isPlayingUser}
                className="w-full p-6 bg-gradient-to-br from-accent/10 to-orange-50 border-2 border-accent/30 rounded-lg hover:border-accent/50 transition-all focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-75"
              >
                <div className="flex flex-col items-center gap-3">
                  {isPlayingUser ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <svg className="w-12 h-12 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                      </svg>
                    </motion.div>
                  ) : (
                    <svg className="w-12 h-12 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-lg font-medium text-accent-dark">
                    {isPlayingUser ? 'Playing...' : 'Play Yours'}
                  </span>
                </div>
              </button>
            ) : (
              <div className="w-full p-6 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-600">No recording yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          {onNewRecording && (
            <button
              onClick={onNewRecording}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Record Again
            </button>
          )}
          
          {userAudioUrl && (
            <button
              onClick={handleCompare}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Get Feedback
            </button>
          )}
        </div>

        {/* Comparison Score */}
        {comparisonScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-900 mb-2">
                {comparisonScore}%
              </div>
              <p className="text-gray-700 font-medium">Pronunciation Match</p>
              <p className="text-sm text-gray-600 mt-2">
                {comparisonScore >= 80 
                  ? '🎉 Excellent pronunciation!' 
                  : comparisonScore >= 60 
                  ? '👍 Good! Keep practicing' 
                  : '💪 Nice try, keep working on it!'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">How to use:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Listen to the native speaker first</li>
                <li>Record your own pronunciation</li>
                <li>Compare both recordings</li>
                <li>Practice until they sound similar</li>
              </ol>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

