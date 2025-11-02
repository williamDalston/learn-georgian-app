# Georgian Text-to-Speech (TTS) Setup Guide

Since you don't have a native speaker to record audio at the moment, here are ML/AI solutions for generating high-quality Georgian audio.

---

## 🎯 Recommended Solutions

### 1. **Google Cloud Text-to-Speech** ⭐⭐⭐⭐⭐ (Recommended)

**Why:** Excellent Georgian support, high quality, affordable pricing

**Features:**
- ✅ Native Georgian language support
- ✅ Multiple voices available (Neural2 voices are best quality)
- ✅ SSML support for pronunciation control
- ✅ Affordable: $4 per 1M characters (~$0.004 per 1000 words)
- ✅ Fast API response

**Setup:**
```bash
npm install @google-cloud/text-to-speech
```

**Environment Variables:**
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
# OR use ADC (Application Default Credentials) in production
```

**Example:**
```typescript
import textToSpeech from '@google-cloud/text-to-speech'

const client = new textToSpeech.TextToSpeechClient()

async function generateAudio(text: string, filename: string) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { 
      languageCode: 'ka-GE', // Georgian
      name: 'ka-GE-Neural2-A', // or 'ka-GE-Neural2-B'
      ssmlGender: 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      sampleRateHertz: 24000,
    },
  })

  // Save to public/audio/
  fs.writeFileSync(`public/audio/${filename}.mp3`, response.audioContent, 'binary')
}
```

**Cost:** ~$4 per 1M characters (very affordable)

---

### 2. **Azure Cognitive Services** ⭐⭐⭐⭐

**Why:** Good Georgian support, Microsoft reliability

**Features:**
- ✅ Georgian language support
- ✅ Neural voices
- ✅ SSML support
- ✅ Good pricing: $15 per 1M characters

**Setup:**
```bash
npm install microsoft-cognitiveservices-speech-sdk
```

**Environment Variables:**
```env
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=your-region
```

---

### 3. **Amazon Polly** ⭐⭐⭐

**Why:** AWS reliability, but Georgian support is limited

**Features:**
- ⚠️ Georgian support may be limited (check current status)
- ✅ Good quality if supported
- ✅ Pay-as-you-go pricing

**Note:** Check if Georgian (ka-GE) is currently supported.

---

### 4. **ElevenLabs** ⭐⭐⭐⭐

**Why:** Best voice quality, but may not support Georgian

**Features:**
- ⚠️ Georgian language support needs verification
- ✅ Excellent voice quality
- ✅ Can clone voices (if you have Georgian samples)
- ⚠️ More expensive (~$22 per 100k characters)

**Note:** Check Georgian language support first.

---

### 5. **Local TTS Solutions** ⭐⭐

**Coqui TTS** (Open Source):
- Can train custom models
- Requires technical setup
- Free but needs training data

---

## 🚀 Quick Start: Google Cloud TTS (Recommended)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "learn-georgian-tts"
3. Enable "Cloud Text-to-Speech API"

### Step 2: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Create service account
3. Add role: "Cloud Text-to-Speech API User"
4. Create JSON key and download

### Step 3: Install Dependencies

```bash
npm install @google-cloud/text-to-speech
```

### Step 4: Set Environment Variables (Vercel)

In Vercel dashboard:
- `GOOGLE_CLOUD_PROJECT_ID`: your-project-id
- `GOOGLE_APPLICATION_CREDENTIALS`: (paste service account JSON content as env var, or use secrets)

### Step 5: Create Audio Generation Script

Create `scripts/generate-georgian-audio.ts`:

```typescript
import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import path from 'path'

const client = new textToSpeech.TextToSpeechClient()

async function generateAudio(
  text: string,
  outputPath: string,
  voiceName = 'ka-GE-Neural2-A'
) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'ka-GE',
      name: voiceName,
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      sampleRateHertz: 24000,
    },
  })

  const audioDir = path.dirname(outputPath)
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, response.audioContent as Buffer, 'binary')
  console.log(`✅ Generated: ${outputPath}`)
}

// Example usage
async function generateAllLetters() {
  const letters = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'
  
  for (const letter of letters) {
    await generateAudio(
      letter,
      `public/audio/letters/${letter}.mp3`
    )
    // Rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

generateAllLetters().catch(console.error)
```

---

## 📝 Implementation Strategy

### Phase 1: Basic Audio (Week 1)
1. Set up Google Cloud TTS
2. Generate 33 letter sounds
3. Generate 50 most common words
4. Test quality

### Phase 2: Expand Vocabulary (Week 2)
1. Generate A1 vocabulary (~200 words)
2. Generate common phrases (~100 phrases)
3. Generate minimal pairs (~50 pairs)

### Phase 3: Full Coverage (Week 3-4)
1. Generate all lesson vocabulary
2. Generate all phrases
3. Quality control and normalization

---

## 💰 Cost Estimation

**Google Cloud TTS Pricing:**
- Standard voices: $4 per 1M characters
- Neural2 voices: $4 per 1M characters

**Estimated characters:**
- 33 letters: ~33 characters = ~$0.00013
- 500 words: ~5,000 characters = ~$0.02
- 200 phrases: ~10,000 characters = ~$0.04
- **Total initial generation: ~$0.06 - $0.10**

**Ongoing:** Free (pre-generated files)

---

## 🎯 Next Steps

1. ✅ Set up Google Cloud account
2. ✅ Enable Text-to-Speech API
3. ✅ Create service account
4. ✅ Add credentials to Vercel
5. ✅ Create generation script
6. ✅ Generate initial audio files
7. ✅ Test audio quality
8. ✅ Upload to public/audio/

---

## 📚 Resources

- [Google Cloud TTS Docs](https://cloud.google.com/text-to-speech/docs)
- [Georgian Language Code: ka-GE](https://cloud.google.com/text-to-speech/docs/voices)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Recommendation:** Start with Google Cloud TTS. It's the most reliable, affordable, and has proven Georgian support.

