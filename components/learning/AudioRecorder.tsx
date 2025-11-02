'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import WaveformDisplay from '@/components/shared/WaveformDisplay'
import { useAudioRecording } from '@/lib/hooks/useAudioRecording'
import logger from '@/lib/utils/logger'

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void
  onRecordingCancel?: () => void
  maxDuration?: number
  showWaveform?: boolean
  title?: string
  description?: string
  className?: string
}

export default function AudioRecorder({
  onRecordingComplete,
  onRecordingCancel,
  maxDuration = 30,
  showWaveform = true,
  title = 'Record Your Pronunciation',
  description = 'Click the button below to start recording',
  className = '',
}: AudioRecorderProps) {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const {
    isRecording,
    isPaused,
    duration,
    error,
    isSupported,
    audioLevel,
    waveformData,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    requestPermission,
  } = useAudioRecording({
    maxDuration,
  })

  // Request permission when component mounts
  useEffect(() => {
    if (!hasRequested && isSupported) {
      requestPermission()
        .then(() => setPermissionGranted(true))
        .catch(() => setPermissionGranted(false))
        .finally(() => setHasRequested(true))
    }
  }, [hasRequested, isSupported, requestPermission])

  const handleStart = async () => {
    try {
      await startRecording()
      setAudioBlob(null)
    } catch (err) {
      logger.error('Failed to start recording', {
        context: 'AudioRecorder',
        error: err as Error,
      })
    }
  }

  const handleStop = async () => {
    try {
      const blob = await stopRecording()
      if (blob) {
        setAudioBlob(blob)
        onRecordingComplete?.(blob)
      }
    } catch (err) {
      logger.error('Failed to stop recording', {
        context: 'AudioRecorder',
        error: err instanceof Error ? err : new Error(String(err)),
      })
    }
  }

  const handleCancel = () => {
    cancelRecording()
    setAudioBlob(null)
    onRecordingCancel?.()
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) {
    return (
      <GlassCard className={`p-8 text-center ${className}`}>
        <div className="text-red-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Browser Not Supported</h3>
        <p className="text-gray-600">
          Audio recording is not supported in your browser. Please use Chrome, Firefox, or Safari.
        </p>
      </GlassCard>
    )
  }

  if (error && !isRecording) {
    return (
      <GlassCard className={`p-8 text-center ${className}`}>
        <div className="text-red-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Recording Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setPermissionGranted(false)
            setHasRequested(false)
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </GlassCard>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <GlassCard className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary-900 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>

        {/* Waveform Display */}
        {showWaveform && (
          <div className="mb-6">
            <WaveformDisplay
              waveformData={waveformData}
              audioLevel={audioLevel}
              isRecording={isRecording}
              height={isRecording ? 120 : 80}
              showLevel={true}
              className="bg-gray-50 p-4 rounded-lg"
            />
          </div>
        )}

        {/* Duration Display */}
        {(isRecording || isPaused || audioBlob) && (
          <div className="text-center mb-6">
            <div className="text-4xl font-mono font-bold text-primary-900">
              {formatDuration(duration)}
            </div>
            {maxDuration > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                Max: {formatDuration(maxDuration)}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <AnimatePresence mode="wait">
            {!isRecording && !audioBlob && !isPaused && (
              <motion.button
                key="record"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleStart}
                disabled={!permissionGranted}
                className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent-dark font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4zM8 14h4a2 2 0 002-2v-1h2a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a4 4 0 00-4-4H8a4 4 0 00-4 4v8a2 2 0 002 2h2v1a2 2 0 002 2z" />
                </svg>
                <span>Start Recording</span>
              </motion.button>
            )}

            {isRecording && !isPaused && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3"
              >
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                  </svg>
                  <span>Pause</span>
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-2 0v6a1 1 0 002 0V7zm6 0a1 1 0 10-2 0v6a1 1 0 102 0V7z" />
                  </svg>
                  <span>Stop</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
                >
                  <span>Cancel</span>
                </button>
              </motion.div>
            )}

            {isRecording && isPaused && (
              <motion.div
                key="paused"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3"
              >
                <button
                  onClick={resumeRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <span>Resume</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
                >
                  <span>Cancel</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Permission message */}
        {!permissionGranted && !isRecording && !hasRequested && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Click "Start Recording" to allow microphone access
          </div>
        )}

        {!permissionGranted && hasRequested && !isRecording && (
          <div className="mt-4 text-center text-sm text-red-600">
            Microphone permission is required to record
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-red-600">
              <motion.div
                className="w-3 h-3 bg-red-600 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-medium">Recording...</span>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  )
}

