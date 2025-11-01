'use client'

import type { ToastType } from '@/components/dashboard/Toast'

// Simplified version of useToast hook
export function useToast() {
  const showToast = (message: string, type?: ToastType, duration?: number) => {
    // Simple implementation - can be enhanced later
    console.log('Toast:', { message, type, duration })
  }
  const ToastContainer = () => null
  return { showToast, ToastContainer }
}
