# Google Cloud TTS - Quick Start Guide

**5-Minute Setup** to start generating Georgian audio files.

---

## ⚡ Quick Setup (Local Development)

### 1. Create Google Cloud Project (2 minutes)

1. Go to https://console.cloud.google.com/
2. Click **"Create Project"**
3. Name: `learn-georgian-tts`
4. Click **"Create"**

### 2. Enable API (30 seconds)

1. In project, go to **"APIs & Services"** > **"Library"**
2. Search: `Cloud Text-to-Speech API`
3. Click **"Enable"**

### 3. Create Service Account (1 minute)

1. Go to **"IAM & Admin"** > **"Service Accounts"**
2. Click **"Create Service Account"**
3. Name: `tts-service`
4. Click **"Create and Continue"**
5. Add role: **"Cloud Text-to-Speech API User"**
6. Click **"Done"**

### 4. Create Key (30 seconds)

1. Click the service account you created
2. Go to **"Keys"** tab
3. Click **"Add Key"** > **"Create new key"**
4. Choose **"JSON"**
5. **Download** the JSON file
6. Save it somewhere safe (NOT in project root for now)

### 5. Set Environment Variables (30 seconds)

Create `.env.local` in project root:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/downloaded-json-file.json
```

**Replace:**
- `your-project-id-here` with your actual project ID (from step 1)
- `/full/path/to/downloaded-json-file.json` with the actual path to your downloaded JSON file

**Example:**
```env
GOOGLE_CLOUD_PROJECT_ID=learn-georgian-tts-123456
GOOGLE_APPLICATION_CREDENTIALS=/Users/williamalston/Downloads/learn-georgian-tts-123456-abc123.json
```

---

## 🎙️ Generate Your First Audio

### Test with one letter:

```bash
npm run generate:audio:custom "ა" "test-letter" word
```

**Check output:**
```bash
ls public/audio/words/test-letter.mp3
```

### Generate all 33 letters:

```bash
npm run generate:audio:letters
```

This creates:
- `public/audio/letters/ა.mp3`
- `public/audio/letters/ბ.mp3`
- ... all 33 letters

**Time:** ~10 seconds (with rate limiting delays)

---

## 🚀 Generate Vocabulary

Generate audio for all vocabulary words:

```bash
npm run generate:audio:vocab
```

Or for a specific lesson:

```bash
npm run generate:audio:vocab a1-1
```

---

## 📋 For Vercel (Production)

### Step 1: Get Service Account JSON Content

1. Open your downloaded JSON file
2. Copy **entire contents** (it's a JSON object)

### Step 2: Add to Vercel Environment Variables

1. Go to Vercel dashboard > Your project
2. Go to **"Settings"** > **"Environment Variables"**
3. Add:

**Variable 1:**
- Key: `GOOGLE_CLOUD_PROJECT_ID`
- Value: `your-project-id` (from Google Cloud Console)
- Environments: Production, Preview, Development

**Variable 2:**
- Key: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Value: (paste entire JSON content from service account file)
- Environments: Production, Preview, Development

**Important:** For `GOOGLE_APPLICATION_CREDENTIALS_JSON`, paste the entire JSON file content. It should start with `{"type":"service_account"...}`

### Step 3: Generate Audio Locally First

Since audio generation takes time, generate files locally first, then commit them:

```bash
# Generate all letters
npm run generate:audio:letters

# Generate vocabulary (optional, can do in batches)
npm run generate:audio:vocab

# Commit generated files
git add public/audio/
git commit -m "Add generated Georgian audio files"
git push
```

Files are then served from your repository (no runtime generation needed).

---

## ✅ Testing Checklist

- [ ] Google Cloud project created
- [ ] Text-to-Speech API enabled
- [ ] Service account created with correct role
- [ ] Service account key downloaded
- [ ] `.env.local` configured
- [ ] Test audio generated: `npm run generate:audio:custom "ა" "test" word`
- [ ] All letters generated: `npm run generate:audio:letters`
- [ ] Files exist in `public/audio/letters/`

---

## 🔍 Troubleshooting

**"Could not load the default credentials"**
- Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Use absolute path, not relative

**"The caller does not have permission"**
- Verify service account has "Cloud Text-to-Speech API User" role
- Verify API is enabled

**"Project not found"**
- Check `GOOGLE_CLOUD_PROJECT_ID` matches your project ID
- Verify project exists in Google Cloud Console

---

## 💰 Costs

**Free Tier:** $300 free credit for new accounts

**After free tier:**
- $4 per 1 million characters
- 33 letters: ~$0.00013 (practically free)
- 500 words: ~$0.02
- **Total initial: ~$0.06-0.10**

**Ongoing:** $0 (pre-generated files stored in repo)

---

**Ready! 🎉** Generate your first audio:

```bash
npm run generate:audio:custom "გამარჯობა" "hello" phrase
```

