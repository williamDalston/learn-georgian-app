# Google Cloud TTS - Complete Setup

**Status:** ✅ Infrastructure Ready  
**Next Step:** Configure Google Cloud credentials

---

## 📦 What's Installed

- ✅ `@google-cloud/text-to-speech` - Google Cloud TTS SDK
- ✅ `ts-node` - TypeScript execution for scripts
- ✅ `tsconfig-paths` - Path resolution for scripts

---

## 🎯 What's Created

### 1. TTS Utility (`lib/utils/tts.ts`)
- `generateAudio()` - Main function to generate audio
- `generateLetterAudio()` - Generate letter sounds
- `generateWordAudio()` - Generate word audio
- `generatePhraseAudio()` - Generate phrase audio
- `getGeorgianVoices()` - List available Georgian voices

### 2. Generation Script (`scripts/generate-georgian-audio.ts`)
- Generate all 33 Georgian letters
- Generate vocabulary from lesson files
- Generate custom audio on-demand
- Rate limiting built-in

### 3. API Route (`app/api/tts/generate/route.ts`)
- On-demand audio generation via API
- Rate limiting
- Error handling

### 4. NPM Scripts (package.json)
- `npm run generate:audio:letters` - Generate all letters
- `npm run generate:audio:vocab` - Generate vocabulary
- `npm run generate:audio:custom` - Generate custom audio

---

## ⚙️ Configuration Required

### Local Development

Create `.env.local`:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/service-account-key.json
```

### Vercel Production

Add environment variables in Vercel dashboard:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
```

---

## 🚀 Quick Start

### Step 1: Set Up Google Cloud (5 minutes)

Follow `GOOGLE-CLOUD-SETUP-QUICK-START.md`

### Step 2: Generate Audio

```bash
# Generate all 33 letters
npm run generate:audio:letters

# Generate vocabulary
npm run generate:audio:vocab

# Test with one word
npm run generate:audio:custom "გამარჯობა" "gamarjoba" phrase
```

---

## 📁 Output Structure

```
public/
  audio/
    letters/
      ა.mp3
      ბ.mp3
      ... (33 files)
    words/
      a1-1/
        a1-1-voc1.mp3
        ...
      a1-2/
        ...
    phrases/
      ... (phrase audio)
```

---

## ✅ Next Steps

1. **Set up Google Cloud** (follow `GOOGLE-CLOUD-SETUP-QUICK-START.md`)
2. **Generate initial audio** (`npm run generate:audio:letters`)
3. **Test audio playback** in the app
4. **Generate vocabulary** as needed
5. **Commit audio files** to repository

---

**Full documentation:** See `GOOGLE-CLOUD-TTS-SETUP.md`

