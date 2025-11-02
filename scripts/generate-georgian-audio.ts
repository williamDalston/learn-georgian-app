#!/usr/bin/env ts-node

/**
 * Script to generate Georgian audio files using Google Cloud TTS
 * 
 * Usage:
 *   npm run generate:audio:letters    # Generate all 33 letter sounds
 *   npm run generate:audio:vocab      # Generate vocabulary audio
 *   npm run generate:audio:all        # Generate everything
 */

import { generateLetterAudio, generateWordAudio, generatePhraseAudio } from '../lib/utils/tts'
import fs from 'fs'
import path from 'path'

// All 33 Georgian letters in order
const GEORGIAN_LETTERS = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'

// Rate limiting delay (ms) between requests
const DELAY_BETWEEN_REQUESTS = 200

/**
 * Wait for a specified time
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate audio for all 33 Georgian letters
 */
async function generateAllLetters() {
  console.log('🎙️  Generating audio for 33 Georgian letters...\n')

  const outputDir = path.join(process.cwd(), 'public', 'audio', 'letters')
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const results = []

  for (let i = 0; i < GEORGIAN_LETTERS.length; i++) {
    const letter = GEORGIAN_LETTERS[i]
    console.log(`Generating ${i + 1}/33: ${letter}...`)

    const result = await generateLetterAudio(letter, outputDir)

    if (result.success) {
      console.log(`  ✅ ${letter}.mp3`)
      results.push({ letter, success: true })
    } else {
      console.log(`  ❌ Failed: ${result.error}`)
      results.push({ letter, success: false, error: result.error })
    }

    // Rate limiting - wait between requests
    if (i < GEORGIAN_LETTERS.length - 1) {
      await delay(DELAY_BETWEEN_REQUESTS)
    }
  }

  // Summary
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`\n📊 Summary:`)
  console.log(`  ✅ Successful: ${successful}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`  📁 Output: ${outputDir}`)
}

/**
 * Generate audio for vocabulary words from lesson files
 */
async function generateVocabularyAudio(lessonId?: string) {
  console.log('🎙️  Generating audio for vocabulary words...\n')

  const lessonsDir = path.join(process.cwd(), 'content', 'lessons')
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1']

  let totalWords = 0
  let successful = 0
  let failed = 0

  for (const level of levels) {
    const levelDir = path.join(lessonsDir, level)
    
    if (!fs.existsSync(levelDir)) {
      continue
    }

    const lessons = fs.readdirSync(levelDir).filter(dir => {
      if (lessonId) {
        return dir === lessonId
      }
      return true
    })

    for (const lesson of lessons) {
      const vocabFile = path.join(levelDir, lesson, 'vocabulary.json')
      
      if (!fs.existsSync(vocabFile)) {
        continue
      }

      try {
        const vocabData = JSON.parse(fs.readFileSync(vocabFile, 'utf-8'))
        const vocabulary = vocabData.vocabulary || []

        console.log(`\n📚 ${lesson}: ${vocabulary.length} words`)

        for (const word of vocabulary) {
          if (!word.georgian) continue

          const filename = `${lesson}-${word.id || word.georgian}`
          const outputDir = path.join(process.cwd(), 'public', 'audio', 'words', lesson)
          
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
          }

          const result = await generateWordAudio(
            word.georgian,
            filename,
            outputDir
          )

          if (result.success) {
            successful++
            console.log(`  ✅ ${word.georgian}`)
          } else {
            failed++
            console.log(`  ❌ ${word.georgian}: ${result.error}`)
          }

          totalWords++
          await delay(DELAY_BETWEEN_REQUESTS)
        }
      } catch (error) {
        console.error(`Error processing ${lesson}:`, error)
      }
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`  📝 Total words: ${totalWords}`)
  console.log(`  ✅ Successful: ${successful}`)
  console.log(`  ❌ Failed: ${failed}`)
}

/**
 * Generate audio for specific text
 */
async function generateCustomAudio(text: string, filename: string, type: 'word' | 'phrase' = 'phrase') {
  console.log(`🎙️  Generating audio for: ${text}\n`)

  const outputDir = type === 'word' 
    ? path.join(process.cwd(), 'public', 'audio', 'words')
    : path.join(process.cwd(), 'public', 'audio', 'phrases')

  const result = type === 'word'
    ? await generateWordAudio(text, filename, outputDir)
    : await generatePhraseAudio(text, filename, outputDir)

  if (result.success) {
    console.log(`✅ Generated: ${result.filePath}`)
  } else {
    console.log(`❌ Failed: ${result.error}`)
  }
}

// CLI interface
const command = process.argv[2]

async function main() {
  // Check if Google Cloud is configured
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CLOUD_PROJECT_ID) {
    console.error('❌ Google Cloud TTS not configured!')
    console.error('\nPlease set environment variables:')
    console.error('  - GOOGLE_CLOUD_PROJECT_ID')
    console.error('  - GOOGLE_APPLICATION_CREDENTIALS_JSON (for Vercel)')
    console.error('\nOr set GOOGLE_APPLICATION_CREDENTIALS to path of service account JSON file')
    process.exit(1)
  }

  try {
    switch (command) {
      case 'letters':
        await generateAllLetters()
        break

      case 'vocab':
        const lessonId = process.argv[3]
        await generateVocabularyAudio(lessonId)
        break

      case 'custom':
        const text = process.argv[3]
        const filename = process.argv[4]
        const type = process.argv[5] || 'phrase'
        
        if (!text || !filename) {
          console.error('Usage: npm run generate:audio:custom <text> <filename> [word|phrase]')
          process.exit(1)
        }
        
        await generateCustomAudio(text, filename, type as 'word' | 'phrase')
        break

      default:
        console.log('🎙️  Georgian Audio Generation Script\n')
        console.log('Usage:')
        console.log('  npm run generate:audio:letters    # Generate all 33 letter sounds')
        console.log('  npm run generate:audio:vocab     # Generate vocabulary audio (all lessons)')
        console.log('  npm run generate:audio:vocab a1-1  # Generate vocabulary for specific lesson')
        console.log('  npm run generate:audio:custom "გამარჯობა" "gamarjoba" phrase')
        console.log('')
        console.log('Environment variables required:')
        console.log('  GOOGLE_CLOUD_PROJECT_ID')
        console.log('  GOOGLE_APPLICATION_CREDENTIALS_JSON (or GOOGLE_APPLICATION_CREDENTIALS for local)')
        break
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

