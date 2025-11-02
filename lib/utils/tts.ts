/**
 * Google Cloud Text-to-Speech utility for generating Georgian audio
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import fs from 'fs'
import path from 'path'
import logger from './logger'

interface TTSOptions {
  text: string
  voiceName?: string
  outputPath: string
  languageCode?: string
}

interface TTSResult {
  success: boolean
  filePath?: string
  error?: string
}

/**
 * Initialize Google Cloud TTS client
 */
function getTTSClient(): TextToSpeechClient | null {
  try {
    // Check if credentials are available
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CLOUD_PROJECT_ID) {
      logger.warn('Google Cloud TTS credentials not configured')
      return null
    }

    return new TextToSpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      // If GOOGLE_APPLICATION_CREDENTIALS is set to JSON string (Vercel), parse it
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
        ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
        : undefined,
    })
  } catch (error) {
    logger.error('Failed to initialize Google Cloud TTS client', {
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return null
  }
}

/**
 * Generate audio file from text using Google Cloud TTS
 */
export async function generateAudio(options: TTSOptions): Promise<TTSResult> {
  const {
    text,
    voiceName = 'ka-GE-Neural2-A', // Georgian Neural2 voice
    outputPath,
    languageCode = 'ka-GE', // Georgian language code
  } = options

  try {
    const client = getTTSClient()

    if (!client) {
      return {
        success: false,
        error: 'Google Cloud TTS client not initialized. Check environment variables.',
      }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Request audio synthesis
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender: 'NEUTRAL' as const,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        sampleRateHertz: 24000, // High quality
      },
    })

    if (!response.audioContent) {
      return {
        success: false,
        error: 'No audio content received from TTS service',
      }
    }

    // Write audio file
    const audioBuffer = Buffer.from(response.audioContent)
    fs.writeFileSync(outputPath, audioBuffer, 'binary')

    logger.info('Audio generated successfully', {
      context: 'tts',
      data: { outputPath, text: text.substring(0, 50) },
    })

    return {
      success: true,
      filePath: outputPath,
    }
  } catch (error) {
    logger.error('Failed to generate audio', {
      context: 'tts',
      error: error instanceof Error ? error : new Error(String(error)),
      data: { text: text.substring(0, 50), outputPath },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate audio for a single Georgian letter
 */
export async function generateLetterAudio(
  letter: string,
  outputDir: string = 'public/audio/letters'
): Promise<TTSResult> {
  return generateAudio({
    text: letter,
    outputPath: path.join(outputDir, `${letter}.mp3`),
    voiceName: 'ka-GE-Neural2-A',
  })
}

/**
 * Generate audio for a Georgian word
 */
export async function generateWordAudio(
  word: string,
  filename: string,
  outputDir: string = 'public/audio/words'
): Promise<TTSResult> {
  return generateAudio({
    text: word,
    outputPath: path.join(outputDir, `${filename}.mp3`),
    voiceName: 'ka-GE-Neural2-A',
  })
}

/**
 * Generate audio for a Georgian phrase/sentence
 */
export async function generatePhraseAudio(
  phrase: string,
  filename: string,
  outputDir: string = 'public/audio/phrases'
): Promise<TTSResult> {
  return generateAudio({
    text: phrase,
    outputPath: path.join(outputDir, `${filename}.mp3`),
    voiceName: 'ka-GE-Neural2-A',
  })
}

/**
 * Get available Georgian voices
 */
export async function getGeorgianVoices(): Promise<string[]> {
  try {
    const client = getTTSClient()

    if (!client) {
      return []
    }

    const [result] = await client.listVoices({
      languageCode: 'ka-GE',
    })

    return result.voices?.map(voice => voice.name || '') || []
  } catch (error) {
    logger.error('Failed to list Georgian voices', {
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return []
  }
}

