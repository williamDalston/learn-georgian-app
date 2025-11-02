/**
 * Daily motivation and greetings
 */

export interface DailyMotivation {
  greeting: string
  timeBasedGreeting: string
  motivationalQuote: string
  todayFocus?: string
}

const motivationalQuotes = [
  "Every expert was once a beginner. Every pro was once an amateur.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Learning a language is like exercising. Consistency beats intensity every time.",
  "You don't have to be great to start, but you have to start to be great.",
  "Progress, not perfection, is the goal.",
  "Small steps every day lead to big results over time.",
  "The journey of a thousand miles begins with a single step.",
  "Consistency is the mother of mastery.",
  "Your future self will thank you for the work you do today.",
  "Language learning is a marathon, not a sprint.",
]

export function getDailyMotivation(
  userName?: string,
  todayGoal?: string
): DailyMotivation {
  const hour = new Date().getHours()
  let timeBasedGreeting = 'Hello'
  let greeting = 'Welcome back'

  if (hour < 12) {
    timeBasedGreeting = 'Good morning'
    greeting = userName ? `Good morning, ${userName}` : 'Good morning'
  } else if (hour < 17) {
    timeBasedGreeting = 'Good afternoon'
    greeting = userName ? `Good afternoon, ${userName}` : 'Good afternoon'
  } else {
    timeBasedGreeting = 'Good evening'
    greeting = userName ? `Good evening, ${userName}` : 'Good evening'
  }

  // Get quote based on day of year for consistency
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const quote = motivationalQuotes[dayOfYear % motivationalQuotes.length]

  return {
    greeting,
    timeBasedGreeting,
    motivationalQuote: quote,
    todayFocus: todayGoal,
  }
}

