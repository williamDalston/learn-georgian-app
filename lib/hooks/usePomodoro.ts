/**
 * React hook for Pomodoro timer
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { storageHelpers } from '@/lib/utils/storage'
import logger from '@/lib/utils/logger'

export interface PomodoroSettings {
  workDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  longBreakInterval: number // number of pomodoros before long break
  autoStart: boolean
  soundEnabled: boolean
}

export interface PomodoroSession {
  id: string
  type: 'work' | 'shortBreak' | 'longBreak'
  startTime: number
  endTime?: number
  completed: boolean
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStart: false,
  soundEnabled: true,
}

const STORAGE_KEY = 'pomodoro_settings'
const SESSIONS_KEY = 'pomodoro_sessions'

export function usePomodoro() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // seconds
  const [sessionType, setSessionType] = useState<
    'work' | 'shortBreak' | 'longBreak'
  >('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number | null>(null)

  // Load settings and sessions from storage
  useEffect(() => {
    const savedSettings = storageHelpers.getJSON<PomodoroSettings>(
      STORAGE_KEY,
      DEFAULT_SETTINGS
    )
    if (savedSettings) {
      setSettings(savedSettings)
      // Set initial time based on settings
      setTimeRemaining(savedSettings.workDuration * 60)
    }

    const savedSessions = storageHelpers.getJSON<PomodoroSession[]>(
      SESSIONS_KEY,
      []
    )
    if (savedSessions) {
      setSessions(savedSessions)
      // Calculate pomodoro count from completed sessions
      const completedWorkSessions = savedSessions.filter(
        (s) => s.type === 'work' && s.completed
      ).length
      setPomodoroCount(completedWorkSessions)
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    storageHelpers.setJSON(STORAGE_KEY, settings)
  }, [settings])

  // Save sessions when they change
  useEffect(() => {
    if (sessions.length > 0) {
      storageHelpers.setJSON(SESSIONS_KEY, sessions)
    }
  }, [sessions])

  // Timer countdown
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused])

  const playSound = useCallback(() => {
    if (settings.soundEnabled && typeof window !== 'undefined') {
      // Create a simple notification sound
      const audio = new Audio('/audio/notification.mp3').catch(() => {
        // Fallback: use Web Audio API to generate a beep
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.value = 800
          oscillator.type = 'sine'

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          )

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
        } catch (err) {
          logger.debug('Could not play sound', {
            context: 'usePomodoro',
          })
        }
      })
    }
  }, [settings.soundEnabled])

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)

    // Play sound
    playSound()

    // Update session
    setSessions((prev) => {
      const currentSession = prev[prev.length - 1]
      if (currentSession && !currentSession.completed) {
        return prev.map((s, idx) =>
          idx === prev.length - 1
            ? { ...s, endTime: Date.now(), completed: true }
            : s
        )
      }
      return prev
    })

    // Determine next session type
    if (sessionType === 'work') {
      const newPomodoroCount = pomodoroCount + 1
      setPomodoroCount(newPomodoroCount)

      // Check if it's time for a long break
      if (newPomodoroCount % settings.longBreakInterval === 0) {
        setSessionType('longBreak')
        setTimeRemaining(settings.longBreakDuration * 60)
      } else {
        setSessionType('shortBreak')
        setTimeRemaining(settings.shortBreakDuration * 60)
      }
    } else {
      // Break finished, start work session
      setSessionType('work')
      setTimeRemaining(settings.workDuration * 60)
    }

    // Auto-start next session if enabled
    if (settings.autoStart) {
      setTimeout(() => {
        startTimer()
      }, 1000)
    } else {
      // Send browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(
          sessionType === 'work'
            ? 'Break time! 🎉'
            : 'Time to focus! 🎯',
          {
            body:
              sessionType === 'work'
                ? 'Take a well-deserved break!'
                : 'Ready for your next Pomodoro?',
            icon: '/icons/icon-192x192.png',
          }
        )
      }
    }
  }, [
    sessionType,
    pomodoroCount,
    settings,
    playSound,
  ])

  const startTimer = useCallback(() => {
    if (!isRunning) {
      // Create new session if starting from stopped state
      if (!isPaused && timeRemaining === getSessionDuration(sessionType)) {
        const newSession: PomodoroSession = {
          id: `${sessionType}-${Date.now()}`,
          type: sessionType,
          startTime: Date.now(),
          completed: false,
        }
        setSessions((prev) => [...prev, newSession])
        startTimeRef.current = Date.now()
      } else if (isPaused && pausedTimeRef.current) {
        // Resume from pause
        const pausedDuration = Date.now() - pausedTimeRef.current
        startTimeRef.current = (startTimeRef.current || Date.now()) + pausedDuration
        pausedTimeRef.current = null
      }

      setIsRunning(true)
      setIsPaused(false)
    }
  }, [isRunning, isPaused, timeRemaining, sessionType])

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false)
      setIsPaused(true)
      pausedTimeRef.current = Date.now()
    }
  }, [isRunning])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeRemaining(getSessionDuration(sessionType))
    startTimeRef.current = null
    pausedTimeRef.current = null
  }, [sessionType])

  const skipSession = useCallback(() => {
    resetTimer()
    handleTimerComplete()
  }, [resetTimer, handleTimerComplete])

  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    // Update timer if work duration changed and we're in work mode
    if (
      newSettings.workDuration &&
      sessionType === 'work' &&
      !isRunning &&
      !isPaused
    ) {
      setTimeRemaining(newSettings.workDuration * 60)
    }
  }, [sessionType, isRunning, isPaused])

  const getSessionDuration = (type: 'work' | 'shortBreak' | 'longBreak'): number => {
    switch (type) {
      case 'work':
        return settings.workDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
    }
  }

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate percentage complete
  const progressPercentage = (() => {
    const total = getSessionDuration(sessionType)
    return ((total - timeRemaining) / total) * 100
  })()

  return {
    // State
    isRunning,
    isPaused,
    timeRemaining,
    sessionType,
    pomodoroCount,
    settings,
    sessions,

    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    updateSettings,
    requestNotificationPermission,

    // Computed
    formattedTime: formatTime(timeRemaining),
    progressPercentage,
  }
}


