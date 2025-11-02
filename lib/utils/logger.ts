/**
 * Centralized logging utility
 * Replaces console.* statements throughout the application
 * Automatically handles different log levels based on environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  level?: LogLevel
  context?: string
  error?: Error
  data?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return
    console.debug(this.formatMessage(message, 'debug', options))
  }

  /**
   * Log info messages
   */
  info(message: string, options?: LogOptions): void {
    if (this.isProduction) {
      // In production, send to logging service (e.g., Sentry)
      // this.sendToService('info', message, options)
      return
    }
    console.info(this.formatMessage(message, 'info', options))
  }

  /**
   * Log warnings
   */
  warn(message: string, options?: LogOptions): void {
    if (this.isProduction) {
      // In production, send to logging service
      // this.sendToService('warn', message, options)
    }
    console.warn(this.formatMessage(message, 'warn', options))
  }

  /**
   * Log errors (always logged, send to error tracking in production)
   */
  error(message: string, options?: LogOptions): void {
    const formatted = this.formatMessage(message, 'error', options)
    console.error(formatted)

    // In production, send to error tracking service
    if (this.isProduction && options?.error) {
      // Example: Sentry.captureException(options.error)
      // Example: LogRocket.captureException(options.error)
    }
  }

  /**
   * Format log message with context
   */
  private formatMessage(
    message: string,
    level: LogLevel,
    options?: LogOptions
  ): string {
    const timestamp = new Date().toISOString()
    const context = options?.context ? `[${options.context}]` : ''
    const prefix = `[${timestamp}] [${level.toUpperCase()}] ${context}`

    if (options?.error) {
      return `${prefix} ${message}\n${options.error.stack}`
    }

    if (options?.data) {
      return `${prefix} ${message}\n${JSON.stringify(options.data, null, 2)}`
    }

    return `${prefix} ${message}`
  }

  /**
   * Send logs to external service (Sentry, LogRocket, etc.)
   * Implement based on your error tracking service
   */
  private sendToService(
    level: LogLevel,
    message: string,
    options?: LogOptions
  ): void {
    // Implementation depends on chosen service
    // Example with Sentry:
    // if (level === 'error' && options?.error) {
    //   Sentry.captureException(options.error, {
    //     tags: { context: options.context },
    //     extra: options.data,
    //   })
    // }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const log = {
  debug: (message: string, options?: LogOptions) => logger.debug(message, options),
  info: (message: string, options?: LogOptions) => logger.info(message, options),
  warn: (message: string, options?: LogOptions) => logger.warn(message, options),
  error: (message: string, options?: LogOptions) => logger.error(message, options),
}

// Default export
export default logger



