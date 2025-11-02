'use client'

import PomodoroTimer from '@/components/learning/PomodoroTimer'

export default function PomodoroPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-primary-900 mb-2">
          Pomodoro Timer
        </h1>
        <p className="text-gray-600">
          Stay focused and productive with the Pomodoro Technique
        </p>
      </div>

      <PomodoroTimer />
    </div>
  )
}



