'use client'

import React from 'react'
import { isMobile } from '@/lib/utils/mobile'
import Container from './Container'
import CTAButton from './CTAButton'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class MobileErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo)
      // TODO: Send to error tracking service (e.g., Sentry)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Optionally reload the page
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isMobileDevice = typeof window !== 'undefined' && isMobile()

      return (
        <Container>
          <div className={`min-h-[60vh] flex items-center justify-center py-12 ${isMobileDevice ? 'px-4' : 'px-0'}`}>
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif text-primary-900 mb-3">
                Something went wrong
              </h1>
              
              <p className="text-base sm:text-lg font-sans text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="font-sans font-semibold text-red-900 cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs font-mono text-red-800 overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton
                  onClick={this.handleReset}
                  variant="primary"
                  fullWidth={isMobileDevice}
                >
                  Refresh Page
                </CTAButton>
                
                <CTAButton
                  href="/"
                  variant="secondary"
                  fullWidth={isMobileDevice}
                >
                  Go Home
                </CTAButton>
              </div>
            </div>
          </div>
        </Container>
      )
    }

    return this.props.children
  }
}

