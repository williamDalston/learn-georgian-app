/**
 * API request/response types
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    email: string
  }
}

export interface SignupRequest {
  email: string
  password: string
}

export interface SignupResponse {
  success: boolean
  message: string
  userId?: string
  token?: string
}

export interface ProgressData {
  daysPracticed: number
  totalTime: number // in minutes
  currentStreak: number
  totalLessons: number
  completedLessons: number
}

export interface SyncProgressRequest {
  progress: ProgressData
}

export interface SyncProgressResponse {
  success: boolean
  message: string
  progress: ProgressData
}

export interface CheckoutSessionRequest {
  plan: 'monthly' | 'annual'
  email: string
}

export interface CheckoutSessionResponse {
  success: boolean
  sessionId: string
  url?: string
  message?: string
}

export interface ApiError {
  error: string
  status?: number
}


