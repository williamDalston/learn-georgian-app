import { NextRequest, NextResponse } from 'next/server'
import { generateAudio } from '@/lib/utils/tts'
import logger from '@/lib/utils/logger'
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rateLimit'

/**
 * POST /api/tts/generate
 * Generate audio file on-demand using Google Cloud TTS
 * 
 * Body:
 * {
 *   text: string (required)
 *   filename: string (required)
 *   type: 'letter' | 'word' | 'phrase' (optional, default: 'phrase')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, { windowMs: 60000, maxRequests: 10 })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await request.json()
    const { text, filename, type = 'phrase' } = body

    if (!text || !filename) {
      return NextResponse.json(
        { error: 'Text and filename are required' },
        { status: 400 }
      )
    }

    // Determine output directory based on type
    const outputDirs = {
      letter: 'public/audio/letters',
      word: 'public/audio/words',
      phrase: 'public/audio/phrases',
    }

    const outputDir = outputDirs[type] || outputDirs.phrase
    const outputPath = `${outputDir}/${filename}.mp3`

    // Generate audio
    const result = await generateAudio({
      text,
      outputPath,
      voiceName: 'ka-GE-Neural2-A',
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to generate audio',
          details: 'Check Google Cloud TTS configuration',
        },
        { status: 500 }
      )
    }

    logger.info('Audio generated via API', {
      context: 'api/tts/generate',
      data: { text: text.substring(0, 50), filename, type },
    })

    return NextResponse.json({
      success: true,
      filePath: result.filePath,
      message: 'Audio generated successfully',
    })
  } catch (error) {
    logger.error('TTS generation error', {
      context: 'api/tts/generate',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

