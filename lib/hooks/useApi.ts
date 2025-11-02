/**
 * React hooks for API calls with loading states and error handling
 */

'use client'

import { useState, useCallback } from 'react'
import { apiClient, ApiClientError } from '@/lib/utils/apiClient'
import logger from '@/lib/utils/logger'
import type { ApiResponse } from '@/lib/types/api'

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
}

/**
 * Hook for making API calls with loading and error states
 */
export function useApi<T = unknown>(
  apiCall: (...args: unknown[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiCall(...args)
        
        if (response.success && response.data) {
          setData(response.data)
          options.onSuccess?.(response.data)
          return response.data
        } else {
          throw new Error(response.error || 'Request failed')
        }
      } catch (err) {
        const apiError = err instanceof ApiClientError ? err : new Error(String(err))
        setError(apiError)
        logger.error('API call failed', {
          context: 'useApi',
          error: apiError,
        })
        options.onError?.(apiError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiCall, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

/**
 * Hook for making GET requests
 */
export function useGet<T = unknown>(endpoint: string) {
  return useApi<T>(() => {
    return apiClient
      .get<T>(endpoint)
      .then((res: any) => {
        // Works whether apiClient returns T or AxiosResponse<T>
        const data = (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
        const status = (res && typeof res === 'object' && 'status' in res) ? (res.status as number) : undefined
        return { 
          success: true, 
          data,
          ...(status !== undefined && { status })
        } as ApiResponse<T>
      })
  })
}

/**
 * Hook for making POST requests
 */
export function usePost<T = unknown, D = unknown>(endpoint: string) {
  return useApi<T>((...args: unknown[]) => {
    const body = args[0] as D
    return apiClient
      .post<T>(endpoint, body)
      .then((res: any) => {
        // Works whether apiClient returns T or AxiosResponse<T>
        const data = (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
        const status = (res && typeof res === 'object' && 'status' in res) ? (res.status as number) : undefined
        return { 
          success: true, 
          data,
          ...(status !== undefined && { status })
        } as ApiResponse<T>
      })
  })
}

/**
 * Hook for syncing progress with backend
 */
export function useProgressSync() {
  const { execute, loading, error } = usePost('/api/progress/sync')

  const syncProgress = useCallback(
    async (progress: {
      daysPracticed: number
      totalTime: number
      currentStreak: number
      totalLessons: number
      completedLessons: number
    }) => {
      return execute({ progress })
    },
    [execute]
  )

  return { syncProgress, loading, error }
}

