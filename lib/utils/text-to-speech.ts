/**
 * Text-to-Speech utilities for Georgian language learning
 * Uses Web Speech API with fallback for browser compatibility
 */

/**
 * Check if the browser supports the Web Speech API
 */
export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'speechSynthesis' in window || 'webkitSpeechSynthesis' in window
}

/**
 * Get the speech synthesis object
 */
function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  return window.speechSynthesis || (window as any).webkitSpeechSynthesis || null
}

/**
 * Get available Georgian voices from the browser
 * Returns the best available Georgian voice or null
 */
export function getGeorgianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !isSpeechSupported()) return null

  const synth = getSpeechSynthesis()
  if (!synth) return null
  
  const voices = synth.getVoices()
  
  // Try to find a Georgian voice first
  const georgianVoice = voices.find((voice: SpeechSynthesisVoice) =>
    voice.lang.toLowerCase().includes('ka') || // Georgian language code
    voice.lang.toLowerCase().includes('georgian') ||
    voice.name.toLowerCase().includes('georgian')
  )

  // Fallback to a compatible voice
  if (georgianVoice) return georgianVoice
  
  // Try alternative language codes that might work
  const alternativeVoice = voices.find((voice: SpeechSynthesisVoice) =>
    ['ru', 'uk', 'tr', 'hy'].includes(voice.lang.split('-')[0].toLowerCase())
  )

  return alternativeVoice || voices[0] || null
}

/**
 * Speak Georgian text using the Web Speech API
 * @param text The Georgian text to speak
 * @param options Configuration options for speech
 */
export function speakGeorgian(
  text: string,
  options: {
    rate?: number // 0.1 to 10, default 1
    pitch?: number // 0 to 2, default 1
    volume?: number // 0 to 1, default 1
    voice?: SpeechSynthesisVoice
    onEnd?: () => void
    onError?: (error: Error) => void
  } = {}
): void {
  const synth = getSpeechSynthesis()
  if (typeof window === 'undefined' || !isSpeechSupported() || !synth) {
    console.warn('Text-to-speech not supported in this browser')
    options.onError?.(new Error('Text-to-speech not supported'))
    return
  }

  // Cancel any ongoing speech
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  
  // Set voice
  const voice = options.voice || getGeorgianVoice()
  if (voice) {
    utterance.voice = voice
  }
  
  // Set speech parameters
  utterance.rate = options.rate ?? 0.75 // Slightly slower for Georgian
  utterance.pitch = options.pitch ?? 1.0
  utterance.volume = options.volume ?? 1.0
  
  // Set language code (Georgian)
  utterance.lang = 'ka-GE'

  // Event handlers
  utterance.onend = () => {
    options.onEnd?.()
  }

  utterance.onerror = (error) => {
    console.error('Speech synthesis error:', error)
    options.onError?.(new Error('Speech synthesis failed'))
  }

  // Speak
  synth.speak(utterance)
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  const synth = getSpeechSynthesis()
  if (typeof window === 'undefined' || !isSpeechSupported() || !synth) return
  synth.cancel()
}

/**
 * Check if speech is currently playing
 */
export function isSpeaking(): boolean {
  const synth = getSpeechSynthesis()
  if (typeof window === 'undefined' || !isSpeechSupported() || !synth) return false
  return synth.speaking
}

/**
 * Pause current speech
 */
export function pauseSpeaking(): void {
  const synth = getSpeechSynthesis()
  if (typeof window === 'undefined' || !isSpeechSupported() || !synth) return
  synth.pause()
}

/**
 * Resume paused speech
 */
export function resumeSpeaking(): void {
  const synth = getSpeechSynthesis()
  if (typeof window === 'undefined' || !isSpeechSupported() || !synth) return
  synth.resume()
}

