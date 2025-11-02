# Google Cloud TTS Setup Guide

Complete setup guide for generating Georgian audio files using Google Cloud Text-to-Speech.

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it: `learn-georgian-tts` (or any name)
4. Click "Create"

### Step 2: Enable Text-to-Speech API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Cloud Text-to-Speech API"
3. Click on it and click "Enable"

### Step 3: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `tts-service`
4. Click "Create and Continue"
5. Add role: **"Cloud Text-to-Speech API User"**
6. Click "Done"

### Step 4: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON"
5. Download the JSON file
6. **Keep this file secure!** (Don't commit to git)

### Step 5: Set Up Environment Variables

#### For Local Development:

1. Copy the service account JSON file to your project root (or secure location)
2. Create `.env.local`:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/service-account-key.json
```

#### For Vercel (Production):

1. In Vercel dashboard, go to your project
2. Go to **Settings** > **Environment Variables**
3. Add:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**Important:** For `GOOGLE_APPLICATION_CREDENTIALS_JSON`:
- Open your service account JSON file
- Copy the entire contents
- Paste it as the value (it should be valid JSON)

---

## 📦 Installation

The package is already installed:
```bash
npm install @google-cloud/text-to-speech
```

---

## 🎙️ Generating Audio Files

### Generate All 33 Georgian Letters

```bash
npm run generate:audio:letters
```

This will generate:
- `public/audio/letters/ა.mp3`
- `public/audio/letters/ბ.mp3`
- ... all 33 letters

### Generate Vocabulary Audio

```bash
# Generate all vocabulary from all lessons
npm run generate:audio:vocab

# Generate vocabulary for specific lesson
npm run generate:audio:vocab a1-1
```

This will generate:
- `public/audio/words/a1-1/a1-1-voc1.mp3`
- `public/audio/words/a1-1/a1-1-voc2.mp3`
- ... for each word in vocabulary.json

### Generate Custom Audio

```bash
# Generate a phrase
npm run generate:audio:custom "გამარჯობა" "gamarjoba" phrase

# Generate a word
npm run generate:audio:custom "სახლი" "sakhli" word
```

---

## 📋 Available Scripts

Add these to your `package.json` (already added):

```json
{
  "scripts": {
    "generate:audio:letters": "ts-node scripts/generate-georgian-audio.ts letters",
    "generate:audio:vocab": "ts-node scripts/generate-georgian-audio.ts vocab",
    "generate:audio:custom": "ts-node scripts/generate-georgian-audio.ts custom"
  }
}
```

---

## 💰 Pricing & Costs

**Google Cloud TTS Pricing:**
- **Standard voices:** $4 per 1 million characters
- **Neural2 voices:** $4 per 1 million characters (we use these)

**Estimated Costs:**
- 33 letters: ~33 characters = **$0.00013** (negligible)
- 500 words (avg 10 chars each): ~5,000 characters = **$0.02**
- 200 phrases (avg 50 chars each): ~10,000 characters = **$0.04**
- **Total initial generation: ~$0.06 - $0.10**

**Ongoing costs:** $0 (files are pre-generated and stored)

**Free Tier:** Google Cloud gives $300 free credit for new accounts (plenty for this project!)

---

## 🎯 Georgian Voices Available

Google Cloud TTS supports Georgian with these voices:

- `ka-GE-Neural2-A` (Recommended - high quality)
- `ka-GE-Neural2-B` (Alternative voice)
- `ka-GE-Standard-A` (Standard voice, lower quality)
- `ka-GE-Standard-B` (Standard voice, alternative)

**We use `ka-GE-Neural2-A` by default** (best quality).

---

## ✅ Testing

### Test Local Setup

1. Make sure `.env.local` is set:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

2. Test with a single letter:
```bash
npm run generate:audio:custom "ა" "test-letter" word
```

3. Check output:
```bash
ls -la public/audio/words/test-letter.mp3
```

### Test Production (Vercel)

1. Set environment variables in Vercel
2. Generate via API route (create one if needed)
3. Check Vercel function logs

---

## 🔧 Troubleshooting

### Error: "Could not load the default credentials"

**Solution:**
- Make sure `GOOGLE_APPLICATION_CREDENTIALS` points to the JSON file (local)
- OR set `GOOGLE_APPLICATION_CREDENTIALS_JSON` with full JSON content (Vercel)

### Error: "The caller does not have permission"

**Solution:**
- Make sure service account has "Cloud Text-to-Speech API User" role
- Make sure Text-to-Speech API is enabled

### Error: "Project not found"

**Solution:**
- Check `GOOGLE_CLOUD_PROJECT_ID` matches your project ID
- Verify project exists in Google Cloud Console

### Rate Limiting

The script includes a 200ms delay between requests to avoid rate limits. If you hit limits:
- Increase `DELAY_BETWEEN_REQUESTS` in `scripts/generate-georgian-audio.ts`
- Or split generation into batches

---

## 📁 Generated File Structure

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
        a1-1-voc2.mp3
        ...
      a1-2/
        ...
    phrases/
      ... (phrase audio)
```

---

## 🚀 Next Steps

1. ✅ Set up Google Cloud project
2. ✅ Enable Text-to-Speech API
3. ✅ Create service account
4. ✅ Add environment variables
5. ✅ Generate 33 letters: `npm run generate:audio:letters`
6. ✅ Generate vocabulary: `npm run generate:audio:vocab`
7. ✅ Update audio manifest: `public/audio/manifest.json`

---

## 📚 Resources

- [Google Cloud TTS Docs](https://cloud.google.com/text-to-speech/docs)
- [Georgian Voices List](https://cloud.google.com/text-to-speech/docs/voices#ka-GE)
- [Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🔒 Security Notes

**NEVER commit service account JSON files to git!**

- ✅ Add `*.json` (service account keys) to `.gitignore`
- ✅ Use environment variables in production (Vercel)
- ✅ Store JSON files securely (local only)
- ✅ Rotate keys if exposed

---

**Ready to generate Georgian audio! 🎙️🇬🇪**

