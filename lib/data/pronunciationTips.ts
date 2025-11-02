/**
 * Pronunciation tips and feedback for Georgian letters and sounds
 * Used to provide manual feedback when automatic analysis isn't available
 */

export interface PronunciationTip {
  letter: string
  ipa?: string
  category: 'vowel' | 'voiced' | 'aspirated' | 'ejective' | 'other'
  description: string
  tips: string[]
  commonMistakes: string[]
}

export const pronunciationTips: Record<string, PronunciationTip> = {
  // Vowels
  'ა': {
    letter: 'ა',
    ipa: 'a',
    category: 'vowel',
    description: 'Open front unrounded vowel, like the "a" in "father"',
    tips: [
      'Keep your mouth wide open',
      'Tongue stays low in the mouth',
      'Short and clear sound',
    ],
    commonMistakes: [
      'Making it too nasal',
      'Adding a schwa sound after',
    ],
  },
  'ე': {
    letter: 'ე',
    ipa: 'ɛ',
    category: 'vowel',
    description: 'Open-mid front unrounded vowel, like the "e" in "bed"',
    tips: [
      'Slightly lower than English "ay" sound',
      'Keep it short and clipped',
      'Don\'t add a "y" sound',
    ],
    commonMistakes: [
      'Making it sound like English "ay"',
      'Adding a glide sound',
    ],
  },
  'ი': {
    letter: 'ი',
    ipa: 'i',
    category: 'vowel',
    description: 'Close front unrounded vowel, like the "ee" in "see"',
    tips: [
      'High and front in the mouth',
      'Keep it pure, no off-glide',
      'Tongue toward the front',
    ],
    commonMistakes: [
      'Making it too diphthong-like',
      'Reducing the sound',
    ],
  },
  'ო': {
    letter: 'ო',
    ipa: 'ɔ',
    category: 'vowel',
    description: 'Open-mid back rounded vowel, similar to "o" in "law"',
    tips: [
      'Round your lips',
      'Back of tongue raised',
      'Short and clear',
    ],
    commonMistakes: [
      'Making it too closed like "oh"',
      'Adding a w-like off-glide',
    ],
  },
  'უ': {
    letter: 'უ',
    ipa: 'u',
    category: 'vowel',
    description: 'Close back rounded vowel, like the "oo" in "boot"',
    tips: [
      'Lips very rounded',
      'Back of tongue high',
      'Don\'t pucker excessively',
    ],
    commonMistakes: [
      'Making it sound like English "you"',
      'Not rounding lips enough',
    ],
  },

  // Ejectives
  'პ': {
    letter: 'პ',
    ipa: 'pʼ',
    category: 'ejective',
    description: 'Ejective /p/ sound with a throat pop',
    tips: [
      'Build up pressure in your throat',
      'Close lips firmly',
      'Release with a small "pop" from the throat',
      'Should feel sharp and distinctive',
    ],
    commonMistakes: [
      'Not creating enough pressure',
      'Confusing with regular /p/',
      'Adding an audible release',
    ],
  },
  'კ': {
    letter: 'კ',
    ipa: 'kʼ',
    category: 'ejective',
    description: 'Ejective /k/ sound with a throat pop',
    tips: [
      'Build pressure in the back of your throat',
      'Back of tongue against soft palate',
      'Sharp, popping release',
      'Very distinctive from ქ',
    ],
    commonMistakes: [
      'Too soft, not enough pop',
      'Confusing with aspirated ქ',
      'Not building enough pressure',
    ],
  },
  'ტ': {
    letter: 'ტ',
    ipa: 'tʼ',
    category: 'ejective',
    description: 'Ejective /t/ sound with a throat pop',
    tips: [
      'Pressure in the front of throat',
      'Tip of tongue against alveolar ridge',
      'Sharp, crisp release',
      'Different from თ',
    ],
    commonMistakes: [
      'Too soft compared to aspirated თ',
      'Not enough glottal pressure',
      'Confusing with ბ',
    ],
  },

  // Aspirated
  'ფ': {
    letter: 'ფ',
    ipa: 'pʰ',
    category: 'aspirated',
    description: 'Aspirated /p/ with a puff of air',
    tips: [
      'Strong puff of air after the /p/',
      'Hold a paper in front of your mouth - it should move',
      'More breathy than English /p/',
    ],
    commonMistakes: [
      'Not enough aspiration',
      'Too similar to პ',
      'Reducing the air puff',
    ],
  },
  'ქ': {
    letter: 'ქ',
    ipa: 'kʰ',
    category: 'aspirated',
    description: 'Aspirated /k/ with a puff of air',
    tips: [
      'Strong release of air',
      'More forceful than English /k/',
      'Feel the air from your mouth',
    ],
    commonMistakes: [
      'Too soft',
      'Confusing with კ (ejective)',
      'Not enough aspiration',
    ],
  },
  'თ': {
    letter: 'თ',
    ipa: 'tʰ',
    category: 'aspirated',
    description: 'Aspirated /t/ with a puff of air',
    tips: [
      'Forceful release',
      'Paper test should show strong movement',
      'More air than English /t/',
    ],
    commonMistakes: [
      'Too soft compared to ტ',
      'Not enough aspiration',
      'Confusing with დ',
    ],
  },

  // Voiced
  'ბ': {
    letter: 'ბ',
    ipa: 'b',
    category: 'voiced',
    description: 'Voiced /b/ sound',
    tips: [
      'Vocal cords vibrate',
      'Softer than პ or ფ',
      'Gentle, not forceful',
    ],
    commonMistakes: [
      'Making it too aspirated',
      'Confusing with პ',
      'Too forceful',
    ],
  },
  'გ': {
    letter: 'გ',
    ipa: 'ɡ',
    category: 'voiced',
    description: 'Voiced /g/ sound',
    tips: [
      'Voice should resonate',
      'Smooth, not pop-like',
      'Back of tongue',
    ],
    commonMistakes: [
      'Too hard like კ',
      'Adding aspiration',
      'Not voicing enough',
    ],
  },
  'დ': {
    letter: 'დ',
    ipa: 'd',
    category: 'voiced',
    description: 'Voiced /d/ sound',
    tips: [
      'Smooth release',
      'Voice activated',
      'Not aspirated',
    ],
    commonMistakes: [
      'Making it aspirated like თ',
      'Too hard like ტ',
      'Not voicing properly',
    ],
  },
}

/**
 * Get pronunciation tips for a letter
 */
export function getPronunciationTip(letter: string): PronunciationTip | null {
  return pronunciationTips[letter] || null
}

/**
 * Get category description
 */
export function getCategoryDescription(category: PronunciationTip['category']): string {
  const descriptions: Record<PronunciationTip['category'], string> = {
    vowel: 'Pure vowel sound - focus on clarity',
    voiced: 'Voiced consonant - your vocal cords should vibrate',
    aspirated: 'Aspirated consonant - releases a puff of air',
    ejective: 'Ejective consonant - creates pressure and releases with a "pop"',
    other: 'Other consonant sound',
  }
  return descriptions[category] || 'Consonant sound'
}

/**
 * Generate feedback based on a comparison score
 */
export function generateFeedback(
  letter: string,
  score: number
): { message: string; suggestions: string[] } {
  const tip = getPronunciationTip(letter)

  if (score >= 80) {
    return {
      message: '🎉 Excellent! Your pronunciation is very close to native!',
      suggestions: [
        'Keep practicing to maintain accuracy',
        'Try saying it in different contexts',
        'Listen to native speakers more',
      ],
    }
  } else if (score >= 60) {
    return {
      message: '👍 Good! You\'re on the right track!',
      suggestions: tip?.tips.slice(0, 2) || [
        'Focus on the specific articulation',
        'Listen more carefully to the native sound',
      ],
    }
  } else {
    return {
      message: '💪 Keep practicing! This sound is challenging.',
      suggestions: [
        ...(tip?.tips || []),
        ...(tip?.commonMistakes.map((m) => `Avoid: ${m}`) || []),
      ],
    }
  }
}

