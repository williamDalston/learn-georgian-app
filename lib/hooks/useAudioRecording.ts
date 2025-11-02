/**
 * React hook for audio recording using Web Audio API
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { AudioRecorder, type RecordingOptions } from '@/lib/utils/audioRecorder'
import logger from '@/lib/utils/logger'

export interface UseAudioRecordingReturn {
  // State
  isRecording: boolean
  isPaused: boolean
  duration: number
  error: string | null
  isSupported: boolean
  audioLevel: number
  waveformData: number[]

  // Actions
  startRecording: () => Promise<void>
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => Promise<Blob | null>
  cancelRecording: () => void
  requestPermission: () => Promise<void>

  // Cleanup
  cleanup: () => void
}

export function useAudioRecording(options: RecordingOptions = {}): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [isSupported] = useState(AudioRecorder.isSupported())

  const recorderRef = useRef<AudioRecorder | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize recorder
  useEffect(() => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser')
      return
    }

    recorderRef.current = new AudioRecorder({
      ...options,
      onProgress: (dur) => {
        setDuration(dur)
        options.onProgress?.(dur)
      },
      onError: (err) => {
        setError(err.message)
        logger.error('Audio recording error', {
          context: 'useAudioRecording',
          error: err as Error,
        })
        options.onError?.(err)
      },
    })

    return () => {
      recorderRef.current?.dispose()
    }
  }, [isSupported, options])

  // Animate audio level and waveform during recording
  useEffect(() => {
    if (isRecording && !isPaused && recorderRef.current) {
      const animate = () => {
        if (recorderRef.current && isRecording && !isPaused) {
          setAudioLevel(recorderRef.current.getAudioLevel())
          setWaveformData(recorderRef.current.getWaveformData(128))
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      setAudioLevel(0)
      setWaveformData([])
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording, isPaused])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      await recorderRef.current?.startRecording()
      setIsRecording(true)
      setIsPaused(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording'
      setError(errorMessage)
      setIsRecording(false)
      logger.error('Failed to start recording', {
        context: 'useAudioRecording',
        error: err as Error,
      })
    }
  }, [])

  const pauseRecording = useCallback(() => {
    recorderRef.current?.pauseRecording()
    setIsPaused(true)
  }, [])

  const resumeRecording = useCallback(() => {
    recorderRef.current?.resumeRecording()
    setIsPaused(false)
  }, [])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const blob = await recorderRef.current?.stopRecording()
    setIsRecording(false)
    setIsPaused(false)
    setDuration(0)
    setAudioLevel(0)
    setWaveformData([])
    return blob || null
  }, [])

  const cancelRecording = useCallback(() => {
    recorderRef.current?.cancelRecording()
    setIsRecording(false)
    setIsPaused(false)
    setDuration(0)
    setAudioLevel(0)
    setWaveformData([])
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      setError(null)
      await recorderRef.current?.requestPermission()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission'
      setError(errorMessage)
      logger.error('Failed to request microphone permission', {
        context: 'useAudioRecording',
        error: err as Error,
      })
    }
  }, [])

  const cleanup = useCallback(() => {
    recorderRef.current?.dispose()
    setIsRecording(false)
    setIsPaused(false)
    setDuration(0)
    setError(null)
  }, [])

  return {
    // State
    isRecording,
    isPaused,
    duration,
    error,
    isSupported,
    audioLevel,
    waveformData,

    // Actions
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    requestPermission,

    // Cleanup
    cleanup,
  }
}

