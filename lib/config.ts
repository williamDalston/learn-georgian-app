/**
 * Application configuration with environment variable validation
 */

function getEnvVar(name: string, defaultValue?: string, required = false): string {
  const value = process.env[name]
  if (!value && !defaultValue && required) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || defaultValue || ''
}

export const config = {
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  stripe: {
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
    secretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', ''),
  },
  // Database configuration (optional)
  database: {
    url: process.env.DATABASE_URL || '',
  },
  // Authentication (optional)
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
  },
  // Feature flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableStripe: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
  },
} as const

// Validate critical config only in production
if (config.app.isProduction) {
  if (config.features.enableStripe && !config.stripe.publishableKey) {
    throw new Error('Stripe publishable key is required when Stripe is enabled')
  }
}

