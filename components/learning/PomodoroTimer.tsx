'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import { usePomodoro } from '@/lib/hooks/usePomodoro'

export default function PomodoroTimer() {
  const {
    isRunning,
    isPaused,
    timeRemaining,
    sessionType,
    pomodoroCount,
    settings,
    sessions,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    updateSettings,
    requestNotificationPermission,
    formattedTime,
    progressPercentage,
  } = usePomodoro()

  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission()
  }, [requestNotificationPermission])

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work':
        return 'bg-red-500'
      case 'shortBreak':
        return 'bg-green-500'
      case 'longBreak':
        return 'bg-blue-500'
    }
  }

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'work':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
    }
  }

  const circumference = 2 * Math.PI * 120 // radius = 120
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Timer Display */}
      <GlassCard className="p-8">
        <div className="text-center space-y-6">
          {/* Session Type */}
          <div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${getSessionColor()}`}
            >
              {getSessionLabel()}
            </span>
          </div>

          {/* Circular Progress */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <svg className="transform -rotate-90 w-64 h-64">
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${getSessionColor()}`}
                />
              </svg>
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {formattedTime}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pomodoroCount} Pomodoro{pomodoroCount !== 1 ? 's' : ''} Today
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isRunning && !isPaused && (
              <button
                onClick={startTimer}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Start
              </button>
            )}
            {isRunning && (
              <button
                onClick={pauseTimer}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Pause
              </button>
            )}
            {isPaused && (
              <>
                <button
                  onClick={startTimer}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Resume
                </button>
                <button
                  onClick={resetTimer}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Reset
                </button>
              </>
            )}
            {(isRunning || isPaused) && (
              <button
                onClick={skipSession}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Skip
              </button>
            )}
          </div>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showSettings ? 'Hide' : 'Show'} Settings
          </button>
        </div>
      </GlassCard>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Timer Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workDuration}
                  onChange={(e) =>
                    updateSettings({ workDuration: parseInt(e.target.value) || 25 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  disabled={isRunning || isPaused}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) =>
                    updateSettings({
                      shortBreakDuration: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  disabled={isRunning || isPaused}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) =>
                    updateSettings({
                      longBreakDuration: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  disabled={isRunning || isPaused}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Break Interval
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.longBreakInterval}
                  onChange={(e) =>
                    updateSettings({
                      longBreakInterval: parseInt(e.target.value) || 4,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  disabled={isRunning || isPaused}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Long break after every N Pomodoros
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoStart"
                  checked={settings.autoStart}
                  onChange={(e) => updateSettings({ autoStart: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="autoStart" className="ml-2 text-sm text-gray-700">
                  Auto-start next session
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    updateSettings({ soundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="soundEnabled" className="ml-2 text-sm text-gray-700">
                  Enable sound notifications
                </label>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Session Stats */}
      {sessions.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Today's Sessions</h3>
          <div className="space-y-2">
            {sessions.slice(-10).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      session.type === 'work'
                        ? 'bg-red-500'
                        : session.type === 'shortBreak'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {session.type === 'work'
                      ? 'Work Session'
                      : session.type === 'shortBreak'
                      ? 'Short Break'
                      : 'Long Break'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(session.startTime).toLocaleTimeString()}
                  {session.endTime && (
                    <> - {new Date(session.endTime).toLocaleTimeString()}</>
                  )}
                  {session.completed && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}


