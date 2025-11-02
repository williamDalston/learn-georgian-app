/**
 * Greeting utilities for personalized, time-based messages
 */

export type GreetingTime = 'morning' | 'afternoon' | 'evening' | 'night'

export interface GreetingOptions {
  userName?: string
  timeOfDay?: GreetingTime
  includeEmoji?: boolean
}

const GREETINGS: Record<GreetingTime, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Working late",
}

const EMOJIS: Record<GreetingTime, string> = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌆",
  night: "🌙",
}

/**
 * Get the current time of day based on hour
 */
export function getTimeOfDay(): GreetingTime {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'morning'
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon'
  } else if (hour >= 17 && hour < 22) {
    return 'evening'
  } else {
    return 'night'
  }
}

/**
 * Generate a personalized greeting message
 */
export function generateGreeting(options: GreetingOptions = {}): string {
  const {
    userName,
    timeOfDay = getTimeOfDay(),
    includeEmoji = false,
  } = options

  let greeting = GREETINGS[timeOfDay]
  
  // Add user name if provided
  if (userName) {
    greeting += `, ${userName}`
  }
  
  // Add emoji if requested
  if (includeEmoji) {
    greeting += ` ${EMOJIS[timeOfDay]}`
  }
  
  // Add encouraging message
  const messages = {
    morning: "Ready to start learning?",
    afternoon: "Let's continue your journey.",
    evening: "Perfect time for a quick lesson.",
    night: "Let's learn together.",
  }
  
  greeting += `! ${messages[timeOfDay]}`
  
  return greeting
}

/**
 * Get a welcome message for first-time users
 */
export function getWelcomeMessage(userName?: string): string {
  const greeting = generateGreeting({ userName, includeEmoji: true })
  return `${greeting} Welcome to your Georgian learning journey! 🇬🇪`
}

/**
 * Get a returning user message
 */
export function getWelcomeBackMessage(userName?: string): string {
  return generateGreeting({ userName, includeEmoji: true })
}


