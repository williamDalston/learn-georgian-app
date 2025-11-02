'use client'

import { ReactNode } from 'react'
import MemberNavigation from '@/components/dashboard/MemberNavigation'
import Container from '@/components/shared/Container'
import { useKeyboardShortcuts } from '@/components/dashboard/KeyboardShortcuts'
import CourseOutlineSidebar from '@/components/dashboard/CourseOutlineSidebar'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // Enable keyboard shortcuts globally for dashboard
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Navigation (Bottom Bar) */}
      <MemberNavigation isMobile={true} />

      {/* Desktop Layout */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <MemberNavigation />
            <CourseOutlineSidebar />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 pb-20 lg:pb-8 pb-safe">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

