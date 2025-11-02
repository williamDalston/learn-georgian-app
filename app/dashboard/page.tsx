'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import logger from '@/lib/utils/logger'
import WelcomeModal from '@/components/dashboard/WelcomeModal'
import ContinueYourPath from '@/components/dashboard/ContinueYourPath'
import ProgressTracker from '@/components/dashboard/ProgressTracker'
import DiscoverMore from '@/components/dashboard/DiscoverMore'
import SkeletonLoader from '@/components/dashboard/SkeletonLoader'
import DashboardSearch from '@/components/dashboard/DashboardSearch'
import PullToRefresh from '@/components/dashboard/PullToRefresh'
import FloatingActionButton from '@/components/shared/FloatingActionButton'
import StickyProgressBar from '@/components/dashboard/StickyProgressBar'
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from '@/components/dashboard/KeyboardShortcuts'
import { useToast } from '@/lib/hooks/useToast'
import { useProgress } from '@/lib/hooks/useProgress'
import { useLessons } from '@/lib/hooks/useLessons'
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback'

export default function DashboardPage() {
  const router = useRouter()
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { progress, isLoading: progressLoading } = useProgress({
    daysPracticed: 5,
    totalTime: 125,
    currentStreak: 3,
    totalLessons: 12,
    completedLessons: 3,
  })
  const { getNextLesson, isLoading: lessonsLoading } = useLessons()
  const { ToastContainer, showToast } = useToast()
  const { success } = useHapticFeedback()

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  const nextLesson = getNextLesson()

  useEffect(() => {
    // Check if this is the user's first visit
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
      setIsFirstVisit(!hasSeenWelcome)
    }
  }, [])

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    success()
    showToast('Dashboard refreshed!', 'success', 2000)
    setIsRefreshing(false)
  }

  const handleStartLesson = () => {
    if (nextLesson) {
      router.push(`/dashboard/lessons/${nextLesson.id}`)
    }
  }

  const handleTakeTour = () => {
    // Show tour/modal (can be implemented later)
    logger.debug('Take tour clicked', { context: 'DashboardPage' })
    // Could implement a tour modal here
  }

  const isLoading = progressLoading || lessonsLoading

  if (isLoading) {
    return (
      <>
        <SkeletonLoader type="dashboard" />
      </>
    )
  }

  return (
    <>
      {/* Welcome Modal for First Visit */}
      {isFirstVisit && (
        <WelcomeModal
          onStartLesson={handleStartLesson}
          onTakeTour={handleTakeTour}
          isFirstVisit={isFirstVisit}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Sticky Progress Bar (mobile only) */}
      <StickyProgressBar />

      {/* Floating Action Button for mobile */}
      {nextLesson && (
        <FloatingActionButton
          onClick={handleStartLesson}
          label="Start Next Lesson"
          variant="primary"
          hideOnScroll={true}
        />
      )}

      {/* Pull to Refresh Wrapper */}
      <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
        {/* Dashboard Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-primary-900 mb-2">
                Welcome Back
              </h1>
              <p className="font-sans text-base sm:text-lg text-gray-600">
                Continue your journey to Georgian fluency
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="w-full sm:w-80">
              <DashboardSearch
                onSearch={(query) => {
                  if (query) {
                    showToast(`Searching for "${query}"...`, 'info', 2000)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Continue Your Path (spans 2 columns on desktop) */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ContinueYourPath nextLesson={nextLesson} />
          </div>

          {/* Sidebar - Progress Tracker */}
          <div className="lg:col-span-1 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ProgressTracker
              daysPracticed={progress.daysPracticed}
              totalTime={progress.totalTime}
              currentStreak={progress.currentStreak}
              totalLessons={progress.totalLessons}
              completedLessons={progress.completedLessons}
            />
          </div>

          {/* Discover More Section - Full Width */}
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <DiscoverMore />
          </div>
        </div>
      </PullToRefresh>
    </>
  )
}

