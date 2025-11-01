'use client'

import { useState } from 'react'

interface LessonControlsProps {
  onSpeedChange?: (speed: number) => void
  onQualityChange?: (quality: string) => void
  currentSpeed?: number
  currentQuality?: string
  className?: string
}

export default function LessonControls({
  onSpeedChange,
  onQualityChange,
  currentSpeed = 1,
  currentQuality = 'auto',
  className = '',
}: LessonControlsProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const qualities = ['Auto', '1080p', '720p', '480p', '360p']

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Playback Speed */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSpeedMenu(!showSpeedMenu)
            setShowQualityMenu(false)
          }}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-sans text-sm transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {currentSpeed}x
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px] z-10">
            {speeds.map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  onSpeedChange?.(speed)
                  setShowSpeedMenu(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-neutral-50 font-sans text-sm transition-colors ${
                  currentSpeed === speed ? 'bg-accent bg-opacity-10 text-accent font-semibold' : ''
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quality */}
      <div className="relative">
        <button
          onClick={() => {
            setShowQualityMenu(!showQualityMenu)
            setShowSpeedMenu(false)
          }}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-sans text-sm transition-colors"
        >
          {currentQuality}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showQualityMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[100px] z-10">
            {qualities.map((quality) => (
              <button
                key={quality}
                onClick={() => {
                  onQualityChange?.(quality.toLowerCase())
                  setShowQualityMenu(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-neutral-50 font-sans text-sm transition-colors ${
                  currentQuality.toLowerCase() === quality.toLowerCase()
                    ? 'bg-accent bg-opacity-10 text-accent font-semibold'
                    : ''
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showSpeedMenu || showQualityMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowSpeedMenu(false)
            setShowQualityMenu(false)
          }}
        />
      )}
    </div>
  )
}

