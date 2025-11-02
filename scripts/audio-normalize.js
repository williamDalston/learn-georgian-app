#!/usr/bin/env node

/**
 * Audio Normalization Script
 * 
 * Normalizes audio files to standard loudness (-16 LUFS).
 * Requires ffmpeg to be installed.
 * 
 * Usage: 
 *   node scripts/audio-normalize.js [file|directory]
 * 
 * Prerequisites:
 *   npm install -g ffmpeg-normalize
 *   or
 *   brew install ffmpeg (macOS)
 *   apt-get install ffmpeg (Linux)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TARGET_LUFS = -16; // Target loudness in LUFS
const VALID_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.flac'];

class AudioNormalizer {
  constructor(targetDir, dryRun = false) {
    this.targetDir = targetDir;
    this.dryRun = dryRun;
    this.processed = [];
    this.errors = [];
  }

  /**
   * Check if ffmpeg is available
   */
  checkFFmpeg() {
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      return true;
    } catch (err) {
      console.error('❌ Error: ffmpeg not found. Please install ffmpeg first.');
      console.error('   macOS: brew install ffmpeg');
      console.error('   Linux: apt-get install ffmpeg');
      console.error('   Windows: Download from https://ffmpeg.org/');
      return false;
    }
  }

  /**
   * Normalize audio file
   */
  normalizeFile(filePath) {
    try {
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const dir = path.dirname(filePath);
      const tempFile = path.join(dir, `${baseName}_normalized${ext}`);

      console.log(`   Normalizing: ${path.basename(filePath)}`);

      if (this.dryRun) {
        console.log(`   [DRY RUN] Would normalize to: ${tempFile}`);
        return;
      }

      // Use ffmpeg to normalize audio
      // This uses the loudnorm filter to normalize to -16 LUFS
      const command = `ffmpeg -i "${filePath}" ` +
        `-af "loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=11" ` +
        `-y "${tempFile}"`;

      execSync(command, { stdio: 'inherit' });

      // Replace original with normalized version
      fs.unlinkSync(filePath);
      fs.renameSync(tempFile, filePath);

      this.processed.push(filePath);
      console.log(`   ✅ Normalized: ${path.basename(filePath)}`);

    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.error(`   ❌ Error normalizing ${path.basename(filePath)}: ${error.message}`);
    }
  }

  /**
   * Find all audio files recursively
   */
  findAudioFiles(dir) {
    const files = [];
    
    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (VALID_EXTENSIONS.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    walk(dir);
    return files;
  }

  /**
   * Normalize all audio files
   */
  async normalize() {
    if (!this.checkFFmpeg()) {
      process.exit(1);
    }

    console.log('\n🎚️  Audio Normalization Tool\n');
    console.log(`Target loudness: ${TARGET_LUFS} LUFS`);
    console.log(`Target directory: ${this.targetDir}`);
    
    if (this.dryRun) {
      console.log('⚠️  DRY RUN MODE - No files will be modified\n');
    } else {
      console.log('');
    }

    // Check if target is file or directory
    const stat = fs.statSync(this.targetDir);
    
    let audioFiles = [];
    if (stat.isFile()) {
      audioFiles = [this.targetDir];
    } else {
      audioFiles = this.findAudioFiles(this.targetDir);
    }

    if (audioFiles.length === 0) {
      console.log('⚠️  No audio files found.');
      return;
    }

    console.log(`Found ${audioFiles.length} audio file(s)\n`);

    for (const file of audioFiles) {
      this.normalizeFile(file);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 NORMALIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Processed: ${this.processed.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\nErrors:');
      this.errors.forEach(({ file, error }) => {
        console.log(`   - ${path.basename(file)}: ${error}`);
      });
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Run normalizer if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/audio-normalize.js [file|directory] [--dry-run]');
    process.exit(1);
  }

  const targetPath = args[0];
  const dryRun = args.includes('--dry-run');

  // Resolve to absolute path
  const absolutePath = path.isAbsolute(targetPath) 
    ? targetPath 
    : path.join(process.cwd(), targetPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Error: Path does not exist: ${absolutePath}`);
    process.exit(1);
  }

  const normalizer = new AudioNormalizer(absolutePath, dryRun);
  normalizer.normalize().catch(err => {
    console.error('Normalization error:', err);
    process.exit(1);
  });
}

module.exports = AudioNormalizer;

