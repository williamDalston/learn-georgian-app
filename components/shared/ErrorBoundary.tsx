'use client'

import { Component, ReactNode } from 'react'
import Container from './Container'
import CTAButton from './CTAButton'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-serif text-primary-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-lg font-sans text-gray-700 mb-8">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-accent text-white font-sans font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-accent-dark transition-colors"
                >
                  Refresh Page
                </button>
                <CTAButton href="/" variant="secondary">
                  Go Home
                </CTAButton>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
          </Container>
        </div>
      )
    }

    return this.props.children
  }
}

