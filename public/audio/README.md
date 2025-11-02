# Audio Assets Directory

This directory contains all audio files for the Georgian learning application.

## Directory Structure

```
public/audio/
├── letters/          # Individual Georgian letter pronunciations (33 letters)
├── words/            # Vocabulary word pronunciations (organized by lesson)
│   └── [lessonId]/   # Lesson-specific vocabulary audio
├── phrases/          # Example sentence pronunciations (organized by lesson)
│   └── [lessonId]/   # Lesson-specific phrase audio
├── min-pairs/        # Minimal pair audio for sound discrimination practice
├── ejective-practice/ # Ejective consonant practice audio
└── manifest.json     # Audio manifest file (auto-generated reference)
```

## File Naming Conventions

### Letters
- Format: `[letter].mp3`
- Example: `ა.mp3`, `ბ.mp3`, `კ.mp3`

### Words
- Format: `[normalized-word].mp3`
- Normalization: lowercase, spaces replaced with hyphens
- Example: `gamarjoba.mp3` for "გამარჯობა"
- Location: `words/[lessonId]/gamarjoba.mp3`

### Phrases
- Format: `[normalized-phrase].mp3`
- Normalization: lowercase, spaces replaced with hyphens
- Example: `gamarjoba-rogor-khart.mp3` for "გამარჯობა, როგორ ხართ?"
- Location: `phrases/[lessonId]/gamarjoba-rogor-khart.mp3`

### Minimal Pairs
- Format: `[pairId].mp3`
- Examples: `b-p-p.mp3`, `t-t-t.mp3`, `k-k-k.mp3`

### Ejective Practice
- Format: `[exerciseId].mp3`
- Example: `ejective-drill-1.mp3`

## Audio Specifications

- **Format**: MP3
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128 kbps
- **Channels**: Mono
- **Bit Depth**: 16-bit

## Adding Audio Files

1. **Record or source native Georgian audio files**
   - Ensure clear, normalized audio quality
   - Remove background noise
   - Use consistent pronunciation

2. **Convert to MP3 format** (if needed)
   ```bash
   # Using ffmpeg
   ffmpeg -i input.wav -ar 44100 -ac 1 -b:a 128k output.mp3
   ```

3. **Place files in appropriate directories**
   - Letters: `public/audio/letters/`
   - Words: `public/audio/words/[lessonId]/`
   - Phrases: `public/audio/phrases/[lessonId]/`
   - Minimal pairs: `public/audio/min-pairs/`
   - Ejective practice: `public/audio/ejective-practice/`

4. **Follow naming conventions** (see above)

## Audio File Generation

### Option 1: Native Speaker Recording
- Hire a native Georgian speaker
- Record all letters, words, and phrases
- Professional quality, most authentic

### Option 2: Text-to-Speech (Temporary)
- Use Georgian TTS service
- Lower quality but faster to generate
- Good for initial development/testing

### Option 3: Existing Audio Resources
- Source from existing Georgian language resources
- Ensure licensing is appropriate
- May need format conversion

## Integration

Audio files are automatically detected by the application. The audio system:
- Checks for native audio files first
- Falls back to browser text-to-speech if audio not found
- Provides visual feedback during playback
- Handles errors gracefully

## Manifest

The `manifest.json` file tracks available audio assets and provides a reference for developers. It's automatically referenced by the audio loader system.

## Testing

To test audio playback:
1. Add audio files to appropriate directories
2. Ensure files follow naming conventions
3. Visit lesson or vocabulary page
4. Click audio play buttons
5. Verify native audio plays (or TTS fallback works)

## Notes

- Audio files are not committed to git by default (add to `.gitignore` if large)
- Consider using CDN for production deployments
- Implement caching for frequently used audio
- Optimize file sizes for mobile users

