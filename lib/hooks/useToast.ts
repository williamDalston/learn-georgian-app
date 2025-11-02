'use client'

import logger from '@/lib/utils/logger'
import type { ToastType } from '@/components/dashboard/Toast'

// Simplified version of useToast hook
export function useToast() {
  const showToast = (message: string, type?: ToastType, duration?: number) => {
    // Simple implementation - can be enhanced later
    logger.debug('Toast', { context: 'useToast', data: { message, type, duration } })
  }
  const ToastContainer = () => null
  return { showToast, ToastContainer }
}
