'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Exercise, Question } from '@/lib/content/types'
import { speakGeorgian, isSpeaking, stopSpeaking } from '@/lib/utils/text-to-speech'

interface AudioExerciseProps {
  exercise: Exercise
  question: Question
  onAnswer: (questionId: string, answer: string | Blob | null, isCorrect: boolean) => void
  showResult?: boolean
}

export default function AudioExercise({
  exercise,
  question,
  onAnswer,
  showResult = false,
}: AudioExerciseProps) {
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      stopSpeaking()
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handlePlayAudio = () => {
    if (audioPlaying && isSpeaking()) {
      stopSpeaking()
      setAudioPlaying(false)
    } else {
      const textToSpeak = question.text || question.question
      if (textToSpeak) {
        setAudioPlaying(true)
        speakGeorgian(textToSpeak, {
          rate: 0.75,
          onEnd: () => setAudioPlaying(false),
          onError: () => setAudioPlaying(false),
        })
      } else if (question.audioUrl) {
        // If audioUrl exists, play it instead
        const audio = new Audio(question.audioUrl)
        audio.play()
        setAudioPlaying(true)
        audio.onended = () => setAudioPlaying(false)
        audio.onerror = () => setAudioPlaying(false)
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setHasRecorded(true)
        setHasAnswered(true)
        
        // Auto-submit when recording is done
        onAnswer(question.id, blob, true) // Assume correct for pronunciation practice
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleSubmit = () => {
    if (!hasRecorded) return
    setHasAnswered(true)
    onAnswer(question.id, audioBlob, true)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="mb-6">
        <p className="font-serif text-xl text-primary-900 mb-2">
          {question.question || exercise.title}
        </p>
        {exercise.instructions && (
          <p className="font-sans text-sm text-gray-600 mb-4">
            {exercise.instructions}
          </p>
        )}
      </div>

      {/* Audio Player Section */}
      <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 border-2 border-accent-200 rounded-xl p-6">
        <div className="space-y-4">
          {/* Word/Text to Practice */}
          {(question.text || question.question) && (
            <div className="text-center">
              <p className="font-serif text-3xl text-primary-900 mb-2">
                {question.text || question.question}
              </p>
              {question.transliteration && (
                <p className="font-sans text-lg text-accent-700 font-medium">
                  {question.transliteration}
                </p>
              )}
              {question.translation && (
                <p className="font-sans text-base text-gray-600 mt-2">
                  ({question.translation})
                </p>
              )}
            </div>
          )}

          {/* Play Audio Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePlayAudio}
              className="px-6 py-3 bg-accent text-white font-sans font-semibold rounded-xl hover:bg-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center gap-3"
            >
              {audioPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play Audio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recording Section */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
        <div className="space-y-4">
          <h3 className="font-sans font-semibold text-lg text-gray-900 mb-4">
            Practice Your Pronunciation
          </h3>

          {!hasRecorded ? (
            <div className="flex justify-center">
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="px-6 py-3 bg-red-500 text-white font-sans font-semibold rounded-xl hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Start Recording
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="font-sans text-lg font-semibold text-red-600">
                      Recording...
                    </p>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-gray-600 text-white font-sans font-semibold rounded-xl hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                  >
                    Stop Recording
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-sans text-base text-green-700 font-semibold mb-2 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Recording Complete!
                </p>
                {audioBlob && (
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="mt-4 w-full"
                  />
                )}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setHasRecorded(false)
                    setAudioBlob(null)
                    setHasAnswered(false)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-sans font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Record Again
                </button>
                {!hasAnswered && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-accent text-white font-sans font-semibold rounded-lg hover:bg-accent-dark transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {hasAnswered && showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
        >
          <p className="font-sans text-sm text-green-900">
            Great job! Your pronunciation has been recorded. Keep practicing!
          </p>
        </motion.div>
      )}
    </div>
  )
}

