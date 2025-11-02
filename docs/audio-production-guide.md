# Audio Production Guide

## Overview

This document establishes the standards, workflow, and quality checklist for producing Georgian language audio content for the Learn Georgian app.

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Active

---

## 🎯 Purpose

All audio recordings must:
- Provide clear, native Georgian pronunciation
- Help learners distinguish difficult sounds (ejectives vs aspirated vs voiced)
- Support pronunciation practice and self-assessment
- Work seamlessly with the interactive learning system

---

## 📁 Audio File Organization

### Directory Structure

```
/public/audio/
  /letters/          # Individual letter pronunciations
    ა.mp3
    ბ.mp3
    ... (all 33 letters)
  
  /min-pairs/       # Minimal pair comparisons
    b-p-p.mp3       # ბ vs ფ vs პ
    t-t-t.mp3       # თ vs ტ
    k-k-k.mp3       # ქ vs კ
  
  /words/           # Vocabulary pronunciations
    /a1/
      a1-1/
        gamarjoba.mp3
        ...
    /a2/
    ...
  
  /phrases/         # Sentence and phrase recordings
    /a1/
      a1-1/
        ...
  
  /ejective-practice/  # Specialized ejective drills
    k-series.mp3
    p-series.mp3
    t-series.mp3
```

---

## 📋 File Naming Conventions

### Letters
- Format: `[letter].mp3`
- Example: `ა.mp3`, `კ.mp3`, `შ.mp3`
- Use actual Georgian characters in filenames

### Vocabulary Words
- Format: `[lessonId]-[word].mp3` or `[word].mp3`
- Example: `a1-1-gamarjoba.mp3` or `gamarjoba.mp3`
- Use transliteration for filenames if Georgian characters cause issues

### Minimal Pairs
- Format: `[sound-series]-[type].mp3`
- Example: `k-series-aspirated-ejective.mp3`
- Or: `b-p-p.mp3` (for ბ/ფ/პ triplet)

### Phrases/Sentences
- Format: `[lessonId]-phrase-[number].mp3`
- Example: `a1-1-phrase-1.mp3`

---

## 🎤 Audio Specifications

### Technical Standards

| Specification | Value | Notes |
|--------------|-------|-------|
| **Sample Rate** | 44.1 kHz | Standard CD quality |
| **Bit Depth** | 16-bit | Adequate for speech |
| **Channels** | Mono | Speech doesn't need stereo |
| **Format** | MP3 | Balanced quality/size |
| **Bitrate** | 128 kbps | Good quality for speech |
| **Max File Size** | 2 MB per minute | Monitor file sizes |

### Quality Checklist

Before finalizing any audio file:

- [ ] **Clarity:** No background noise or distortion
- [ ] **Volume:** Normalized to -16 LUFS (loudness standard)
- [ ] **Consistency:** All files at similar volume level
- [ ] **Pacing:** Natural, clear speech (not rushed)
- [ ] **Accuracy:** Correct Georgian pronunciation
- [ ] **Breaks:** Appropriate pauses between repetitions
- [ ] **Pronunciation:** Native speaker or verified native-like accent

---

## 🎙️ Recording Guidelines

### Recording Environment

1. **Quiet Space:** Record in a quiet room with minimal echo
2. **Microphone:** Use quality microphone (USB mic minimum)
3. **Distance:** 6-12 inches from microphone
4. **Pop Filter:** Use pop filter to avoid plosive sounds
5. **Position:** Sit or stand consistently throughout recording

### Recording Process

#### For Individual Letters:
1. Say the letter **3 times** with brief pauses
2. Include **IPA pronunciation** if helpful
3. Example: "ა - ა - ა [ɑ]"

#### For Vocabulary Words:
1. Say the word **once clearly**
2. Optional: Say it **slowly once** (for difficult words)
3. Include **example sentence** if part of lesson

#### For Minimal Pairs:
1. Say first word **twice**
2. Pause (2 seconds)
3. Say second word **twice**
4. Pause (2 seconds)
5. Say both **together** for comparison
6. Example: "ქალაქი - ქალაქი ... [pause] ... კაცი - კაცი ... ქალაქი - კაცი"

#### For Sentences:
1. Natural pace first
2. Optional: Slower pace version (for beginners)

---

## ✅ Quality Assurance Checklist

### Pre-Production
- [ ] Script reviewed and approved
- [ ] Recording environment prepared
- [ ] Equipment tested
- [ ] Script pronunciations verified

### During Recording
- [ ] Volume levels consistent
- [ ] Clear enunciation
- [ ] Correct pronunciation
- [ ] Appropriate pacing
- [ ] Minimal background noise

### Post-Production
- [ ] Audio normalized (-16 LUFS)
- [ ] Background noise removed (if needed)
- [ ] File correctly named
- [ ] Saved in correct directory
- [ ] Metadata added (if possible)
- [ ] Quality spot-checked
- [ ] Verified in app context

---

## 🔧 Audio Processing Tools

### Recommended Software

1. **Audacity** (Free, Open Source)
   - Recording
   - Normalization
   - Noise reduction
   - Export to MP3

2. **Adobe Audition** (Professional)
   - Advanced editing
   - Better noise reduction
   - Professional workflow

3. **FFmpeg** (Command Line)
   - Batch processing
   - Format conversion
   - Normalization

### Processing Steps

1. **Import** audio file
2. **Normalize** to -16 LUFS
3. **Remove noise** if present (gentle noise reduction)
4. **Trim** silence at start/end (leave 0.5s padding)
5. **Export** as MP3 at 128 kbps

---

## 📊 Audio Manifest System

All audio files should be referenced in a manifest JSON file for easy loading:

**Location:** `public/audio/manifest.json`

```json
{
  "letters": {
    "ა": "/audio/letters/ა.mp3",
    "ბ": "/audio/letters/ბ.mp3",
    ...
  },
  "vocabulary": {
    "a1-1": {
      "gamarjoba": "/audio/words/a1/a1-1/gamarjoba.mp3",
      ...
    }
  },
  "minPairs": {
    "k-series": "/audio/min-pairs/k-series.mp3",
    ...
  }
}
```

---

## 🔄 Version Control

### Audio Versioning

- Use semantic versioning: `v1.0`, `v1.1`, etc.
- Store old versions for reference
- Document changes in version log

### File Changes

When updating audio:
1. Keep old file: `gamarjoba-v1.0.mp3`
2. Create new: `gamarjoba-v1.1.mp3`
3. Update manifest to point to latest
4. Document reason for change

---

## 👥 Native Speaker Requirements

### Speaker Qualifications

- **Native Georgian speaker** (born and raised in Georgia)
- **Clear pronunciation** (no strong regional accent unless specified)
- **Teaching experience** preferred (understands learner needs)
- **Consistent delivery** across all recordings

### Speaker Notes

Provide speaker with:
- Clear pronunciation guide
- Context for each word/phrase
- Common learner mistakes to emphasize
- Pace guidelines (slower for beginners)

---

## 📝 Content Integration

### Linking Audio to Content

1. **Vocabulary JSON:**
   ```json
   {
     "georgian": "გამარჯობა",
     "audioUrl": "/audio/words/a1/a1-1/gamarjoba.mp3"
   }
   ```

2. **Video Scripts:**
   - Add markers: `[AUDIO: gamarjoba.mp3]`

3. **Exercises:**
   - Reference audio in audio-based exercises
   - Include audio prompts in instructions

---

## 🚨 Common Issues & Solutions

### Problem: Inconsistent Volume
**Solution:** Normalize all files to -16 LUFS before final export

### Problem: Background Noise
**Solution:** Use noise reduction tool, or re-record in quieter space

### Problem: Unclear Pronunciation
**Solution:** Re-record with clearer enunciation, slower pace

### Problem: File Size Too Large
**Solution:** Reduce bitrate to 96 kbps (still acceptable for speech)

### Problem: Georgian Characters in Filenames
**Solution:** Use transliteration in filenames, map in manifest JSON

---

## 📈 Progress Tracking

### Recording Status

Track recording progress:
- [ ] Letters: 0/33 (0%)
- [ ] A1 Vocabulary: 0/X (0%)
- [ ] A2 Vocabulary: 0/X (0%)
- [ ] Minimal Pairs: 0/X (0%)
- [ ] Phrases: 0/X (0%)

### Quality Metrics

- **Completion:** % of content with audio
- **Quality Score:** Average quality rating
- **User Feedback:** Pronunciation clarity ratings

---

## 🔗 Related Documents

- `audio-script-template.md` - Template for creating audio scripts
- `pronunciation-guide.md` - Detailed pronunciation instructions
- `cultural-pronunciation-guide.md` - Cultural context for pronunciation

---

## ✅ Approval Process

Before audio goes live:

1. **Internal Review:** Team member reviews for quality
2. **Native Speaker Verification:** Native speaker confirms accuracy
3. **Technical Check:** File format, size, naming verified
4. **Integration Test:** Audio plays correctly in app
5. **User Testing:** Sample users test audio clarity

---

**Status:** Active  
**Maintained By:** Agent 14 - Content Production  
**Last Review:** January 2025

