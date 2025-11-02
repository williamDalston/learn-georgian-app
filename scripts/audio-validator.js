#!/usr/bin/env node

/**
 * Audio File Validator
 * 
 * Validates audio files against production standards:
 * - Checks file existence
 * - Verifies naming conventions
 * - Validates file sizes
 * - Checks directory structure
 * 
 * Usage: node scripts/audio-validator.js [directory]
 */

const fs = require('fs');
const path = require('path');

const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB
const EXPECTED_SAMPLE_RATE = 44100; // 44.1 kHz
const VALID_EXTENSIONS = ['.mp3', '.wav', '.m4a'];

// Expected directory structure
const EXPECTED_DIRS = [
  'letters',
  'words',
  'phrases',
  'min-pairs',
  'ejective-practice'
];

// Georgian alphabet (all 33 letters)
const GEORGIAN_LETTERS = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'.split('');

class AudioValidator {
  constructor(baseDir) {
    this.baseDir = baseDir || path.join(process.cwd(), 'public', 'audio');
    this.errors = [];
    this.warnings = [];
    this.validated = 0;
  }

  /**
   * Run all validation checks
   */
  async validate() {
    console.log(`\n🔍 Validating audio files in: ${this.baseDir}\n`);

    // Check if directory exists
    if (!fs.existsSync(this.baseDir)) {
      this.errors.push(`Audio directory does not exist: ${this.baseDir}`);
      this.printResults();
      return;
    }

    // Validate directory structure
    this.validateDirectoryStructure();

    // Validate letter files
    this.validateLetters();

    // Validate file naming conventions
    this.validateNaming();

    // Validate file sizes
    this.validateFileSizes();

    // Print results
    this.printResults();
  }

  /**
   * Check directory structure
   */
  validateDirectoryStructure() {
    console.log('📁 Checking directory structure...');
    
    for (const dir of EXPECTED_DIRS) {
      const dirPath = path.join(this.baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        this.warnings.push(`Expected directory missing: ${dir}`);
      }
    }
  }

  /**
   * Validate letter audio files
   */
  validateLetters() {
    console.log('🔤 Validating letter files...');
    
    const lettersDir = path.join(this.baseDir, 'letters');
    if (!fs.existsSync(lettersDir)) {
      this.warnings.push('Letters directory does not exist');
      return;
    }

    const files = fs.readdirSync(lettersDir);
    const letterFiles = files.filter(f => 
      fs.statSync(path.join(lettersDir, f)).isFile() && 
      VALID_EXTENSIONS.some(ext => f.endsWith(ext))
    );

    // Check for all 33 letters
    for (const letter of GEORGIAN_LETTERS) {
      const found = letterFiles.some(f => f.startsWith(letter));
      if (!found) {
        this.errors.push(`Missing audio for letter: ${letter}`);
      } else {
        this.validated++;
      }
    }

    // Check for unexpected files
    for (const file of letterFiles) {
      const letter = file.charAt(0);
      if (!GEORGIAN_LETTERS.includes(letter)) {
        this.warnings.push(`Unexpected file in letters directory: ${file}`);
      }
    }
  }

  /**
   * Validate file naming conventions
   */
  validateNaming() {
    console.log('📝 Validating file naming...');
    
    const walk = (dir, basePath = '') => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath, relativePath);
        } else if (VALID_EXTENSIONS.some(ext => file.endsWith(ext))) {
          // Check naming conventions
          this.validateFileName(file, relativePath);
          this.validated++;
        }
      }
    };

    walk(this.baseDir);
  }

  /**
   * Validate individual file name
   */
  validateFileName(filename, relativePath) {
    // Check for valid extension
    const ext = path.extname(filename);
    if (!VALID_EXTENSIONS.includes(ext)) {
      this.errors.push(`Invalid file extension in ${relativePath}: ${ext}`);
    }

    // Check for spaces (should use hyphens)
    if (filename.includes(' ')) {
      this.warnings.push(`File name contains spaces (use hyphens): ${relativePath}`);
    }

    // Check for special characters (except hyphens and dots)
    if (!/^[ა-ჰa-zA-Z0-9.\-_]+$/.test(filename.replace(ext, ''))) {
      this.warnings.push(`File name contains special characters: ${relativePath}`);
    }
  }

  /**
   * Validate file sizes
   */
  validateFileSizes() {
    console.log('💾 Validating file sizes...');
    
    const walk = (dir, basePath = '') => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath, relativePath);
        } else if (VALID_EXTENSIONS.some(ext => file.endsWith(ext))) {
          const stats = fs.statSync(fullPath);
          const sizeMB = stats.size / (1024 * 1024);
          
          if (sizeMB > MAX_FILE_SIZE_MB) {
            this.warnings.push(
              `Large file size (${sizeMB.toFixed(2)}MB): ${relativePath} (max: ${MAX_FILE_SIZE_MB}MB)`
            );
          }
        }
      }
    };

    walk(this.baseDir);
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Files validated: ${this.validated}`);
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(w => console.log(`   - ${w}`));
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(e => console.log(`   - ${e}`));
      console.log('\n❌ Validation FAILED');
      process.exit(1);
    } else if (this.warnings.length === 0) {
      console.log('\n✅ Validation PASSED - No issues found!');
    } else {
      console.log('\n⚠️  Validation PASSED with warnings');
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Run validator if called directly
if (require.main === module) {
  const baseDir = process.argv[2];
  const validator = new AudioValidator(baseDir);
  validator.validate().catch(err => {
    console.error('Validation error:', err);
    process.exit(1);
  });
}

module.exports = AudioValidator;

