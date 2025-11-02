/**
 * API client utilities for making authenticated requests
 */

import type { ApiResponse, ApiError } from '@/lib/types/api'
import logger from './logger'

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

/**
 * Make an API request with error handling and retry logic
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 3,
    ...fetchOptions
  } = options

  const url = endpoint.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`
    : endpoint

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new ApiClientError(
          data.error || 'Request failed',
          response.status,
          data
        )
      }

      return data as ApiResponse<T>
    } catch (error) {
      lastError = error instanceof ApiClientError ? error : new Error(String(error))

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
        throw error
      }

      // Retry on network errors or 5xx errors
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000) // Exponential backoff, max 10s
        logger.warn(`API request failed, retrying in ${delay}ms`, {
          context: 'apiClient',
          data: { endpoint, attempt: attempt + 1, retries },
        })
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

/**
 * API client class for typed requests
 */
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await apiRequest<T>(`${this.baseUrl}${endpoint}`, options)
    
    if (!response.success) {
      throw new ApiClientError(
        response.error || 'Request failed',
        400,
        response
      )
    }

    return response.data as T
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

