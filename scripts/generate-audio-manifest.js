#!/usr/bin/env node

/**
 * Audio Manifest Generator
 * 
 * Scans the public/audio directory and generates/updates the audio manifest.json file.
 * This script helps track which audio files are available and their organization.
 * 
 * Usage: node scripts/generate-audio-manifest.js
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const MANIFEST_FILE = path.join(AUDIO_DIR, 'manifest.json');
const GEORGIAN_LETTERS = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'.split('');

/**
 * Scan directory for audio files
 */
function scanDirectory(dirPath, extensions = ['.mp3', '.wav', '.m4a', '.ogg']) {
  const files = [];
  
  if (!fs.existsSync(dirPath)) {
    return files;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (extensions.includes(ext)) {
        const relativePath = '/' + path.relative(path.join(process.cwd(), 'public'), fullPath).replace(/\\/g, '/');
        files.push({
          name: item,
          path: relativePath,
          size: stat.size,
        });
      }
    } else if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subFiles = scanDirectory(fullPath, extensions);
      files.push(...subFiles);
    }
  }
  
  return files;
}

/**
 * Organize files by type
 */
function organizeFiles(files) {
  const organized = {
    letters: [],
    words: {},
    phrases: {},
    minPairs: [],
    ejectivePractice: [],
    other: [],
  };
  
  for (const file of files) {
    if (file.path.includes('/letters/')) {
      organized.letters.push(file);
    } else if (file.path.includes('/min-pairs/')) {
      organized.minPairs.push(file);
    } else if (file.path.includes('/ejective-practice/')) {
      organized.ejectivePractice.push(file);
    } else if (file.path.includes('/words/')) {
      // Extract lesson ID from path
      const match = file.path.match(/\/words\/([^/]+)\//);
      const lessonId = match ? match[1] : 'global';
      if (!organized.words[lessonId]) {
        organized.words[lessonId] = [];
      }
      organized.words[lessonId].push(file);
    } else if (file.path.includes('/phrases/')) {
      // Extract lesson ID from path
      const match = file.path.match(/\/phrases\/([^/]+)\//);
      const lessonId = match ? match[1] : 'global';
      if (!organized.phrases[lessonId]) {
        organized.phrases[lessonId] = [];
      }
      organized.phrases[lessonId].push(file);
    } else {
      organized.other.push(file);
    }
  }
  
  return organized;
}

/**
 * Check for missing letters
 */
function findMissingLetters(letterFiles) {
  const foundLetters = new Set();
  
  for (const file of letterFiles) {
    // Try to extract letter from filename
    const baseName = path.basename(file.name, path.extname(file.name));
    if (GEORGIAN_LETTERS.includes(baseName)) {
      foundLetters.add(baseName);
    }
  }
  
  const missing = GEORGIAN_LETTERS.filter(letter => !foundLetters.has(letter));
  return missing;
}

/**
 * Generate manifest
 */
function generateManifest(organizedFiles) {
  const manifest = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    description: 'Audio manifest for Georgian learning app. This file tracks available audio assets.',
    letters: {
      description: 'Individual Georgian letter pronunciations',
      files: organizedFiles.letters.map(f => f.path),
      count: organizedFiles.letters.length,
      total: GEORGIAN_LETTERS.length,
      missing: findMissingLetters(organizedFiles.letters),
      note: 'Add audio files to public/audio/letters/ directory. File naming: [letter].mp3',
    },
    words: {
      description: 'Vocabulary word pronunciations organized by lesson',
      structure: '/audio/words/[lessonId]/[word].mp3',
      lessons: {},
      totalFiles: 0,
      note: 'Add audio files to public/audio/words/[lessonId]/ directory. File naming: [normalized-word].mp3',
    },
    phrases: {
      description: 'Example sentence pronunciations organized by lesson',
      structure: '/audio/phrases/[lessonId]/[phrase].mp3',
      lessons: {},
      totalFiles: 0,
      note: 'Add audio files to public/audio/phrases/[lessonId]/ directory. File naming: [normalized-phrase].mp3',
    },
    minPairs: {
      description: 'Minimal pair audio for sound discrimination practice',
      files: organizedFiles.minPairs.map(f => f.path),
      count: organizedFiles.minPairs.length,
      note: 'Add audio files to public/audio/min-pairs/ directory',
    },
    ejectivePractice: {
      description: 'Ejective consonant practice audio',
      structure: '/audio/ejective-practice/[exerciseId].mp3',
      files: organizedFiles.ejectivePractice.map(f => f.path),
      count: organizedFiles.ejectivePractice.length,
      note: 'Add audio files to public/audio/ejective-practice/ directory',
    },
    specifications: {
      format: 'MP3',
      sampleRate: '44100 Hz',
      bitRate: '128 kbps',
      channels: 'mono',
      bitDepth: '16-bit',
    },
    instructions: {
      setup: '1. Record or source native Georgian audio files',
      placement: '2. Place files in appropriate directories according to structure above',
      naming: '3. Use exact naming convention: [identifier].mp3',
      validation: '4. Audio files will automatically be detected and used when present',
      fallback: '5. If audio file is missing, app will fallback to text-to-speech',
    },
    stats: {
      totalFiles: organizedFiles.letters.length + 
                  organizedFiles.minPairs.length + 
                  organizedFiles.ejectivePractice.length + 
                  Object.values(organizedFiles.words).reduce((sum, arr) => sum + arr.length, 0) +
                  Object.values(organizedFiles.phrases).reduce((sum, arr) => sum + arr.length, 0),
      lettersComplete: organizedFiles.letters.length >= GEORGIAN_LETTERS.length,
    },
  };
  
  // Organize words by lesson
  for (const [lessonId, files] of Object.entries(organizedFiles.words)) {
    manifest.words.lessons[lessonId] = {
      files: files.map(f => f.path),
      count: files.length,
    };
    manifest.words.totalFiles += files.length;
  }
  
  // Organize phrases by lesson
  for (const [lessonId, files] of Object.entries(organizedFiles.phrases)) {
    manifest.phrases.lessons[lessonId] = {
      files: files.map(f => f.path),
      count: files.length,
    };
    manifest.phrases.totalFiles += files.length;
  }
  
  return manifest;
}

/**
 * Main function
 */
function main() {
  console.log('\n🎵 Audio Manifest Generator\n');
  console.log(`Scanning directory: ${AUDIO_DIR}\n`);
  
  // Check if audio directory exists
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error(`❌ Error: Audio directory does not exist: ${AUDIO_DIR}`);
    process.exit(1);
  }
  
  // Scan for audio files
  console.log('📁 Scanning for audio files...');
  const allFiles = scanDirectory(AUDIO_DIR);
  console.log(`   Found ${allFiles.length} audio file(s)\n`);
  
  // Organize files
  console.log('📋 Organizing files...');
  const organized = organizeFiles(allFiles);
  
  // Generate manifest
  console.log('📝 Generating manifest...');
  const manifest = generateManifest(organized);
  
  // Write manifest
  console.log(`💾 Writing manifest to: ${MANIFEST_FILE}`);
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MANIFEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Letters: ${manifest.letters.count}/${manifest.letters.total}`);
  if (manifest.letters.missing.length > 0) {
    console.log(`   Missing: ${manifest.letters.missing.join(', ')}`);
  }
  console.log(`✅ Minimal Pairs: ${manifest.minPairs.count}`);
  console.log(`✅ Ejective Practice: ${manifest.ejectivePractice.count}`);
  console.log(`✅ Vocabulary Words: ${manifest.words.totalFiles} across ${Object.keys(manifest.words.lessons).length} lessons`);
  console.log(`✅ Phrases: ${manifest.phrases.totalFiles} across ${Object.keys(manifest.phrases.lessons).length} lessons`);
  console.log(`\n📦 Total Files: ${manifest.stats.totalFiles}`);
  console.log(`📅 Last Updated: ${manifest.lastUpdated}`);
  console.log('\n' + '='.repeat(60) + '\n');
  
  console.log('✅ Manifest generated successfully!\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateManifest, scanDirectory, organizeFiles };

