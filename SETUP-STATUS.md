# Google Cloud TTS Setup Status

**Date:** Current Session  
**Status:** ✅ Infrastructure Ready - Manual Setup Required

---

## ✅ **What I've Already Done (Automated)**

### 1. Installed All Packages ✅
- ✅ `@google-cloud/text-to-speech` - Google Cloud TTS SDK
- ✅ `ts-node` - TypeScript execution
- ✅ `tsconfig-paths` - Path resolution

### 2. Created All Code Files ✅
- ✅ `lib/utils/tts.ts` - TTS utility functions
- ✅ `scripts/generate-georgian-audio.ts` - Audio generation script
- ✅ `app/api/tts/generate/route.ts` - API endpoint
- ✅ `tsconfig.scripts.json` - TypeScript config for scripts

### 3. Created NPM Scripts ✅
- ✅ `npm run generate:audio:letters`
- ✅ `npm run generate:audio:vocab`
- ✅ `npm run generate:audio:custom`

### 4. Set Up Security ✅
- ✅ Added service account JSON files to `.gitignore`
- ✅ Created `.env.local.example` template

### 5. Created Documentation ✅
- ✅ `GOOGLE-CLOUD-TTS-SETUP.md` - Complete guide
- ✅ `GOOGLE-CLOUD-SETUP-QUICK-START.md` - 5-minute quick start
- ✅ `README-GOOGLE-CLOUD-TTS.md` - Quick reference
- ✅ `SETUP-STATUS.md` - This file

### 6. Created Helper Script ✅
- ✅ `scripts/setup-google-cloud.sh` - Setup verification script

---

## 🔴 **What YOU Need to Do (Manual Steps)**

### Step 1: Create Google Cloud Project (2 minutes)

1. Go to: https://console.cloud.google.com/
2. Click **"Create Project"** (top right)
3. Project name: `learn-georgian-tts` (or any name you prefer)
4. Click **"Create"**
5. **Note your Project ID** (it's displayed after creation)

---

### Step 2: Enable Text-to-Speech API (1 minute)

1. In your new project, go to **"APIs & Services"** > **"Library"** (left sidebar)
2. Search for: `Cloud Text-to-Speech API`
3. Click on it
4. Click **"Enable"** button
5. Wait for it to enable (usually instant)

---

### Step 3: Create Service Account (2 minutes)

1. Go to **"IAM & Admin"** > **"Service Accounts"** (left sidebar)
2. Click **"Create Service Account"** (top)
3. Fill in:
   - **Service account name:** `tts-service`
   - **Service account ID:** (auto-filled)
   - Click **"Create and Continue"**
4. **Grant access:**
   - Click **"Select a role"**
   - Search for: `Cloud Text-to-Speech API User`
   - Select it
   - Click **"Continue"**
5. Click **"Done"** (skip optional steps)

---

### Step 4: Create Service Account Key (1 minute)

1. Click on the service account you just created (`tts-service`)
2. Go to **"Keys"** tab
3. Click **"Add Key"** > **"Create new key"**
4. Choose **"JSON"**
5. Click **"Create"**
6. **A JSON file will download** - save it somewhere safe (like Downloads)
7. **IMPORTANT:** This file contains sensitive credentials - don't share it!

---

### Step 5: Configure Local Environment (30 seconds)

1. In your project root, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/downloaded-json-file.json
   ```

   **Example:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID=learn-georgian-tts-123456
   GOOGLE_APPLICATION_CREDENTIALS=/Users/williamalston/Downloads/learn-georgian-tts-123456-abc123.json
   ```

   **Important:** Use the **full absolute path** to the JSON file!

---

### Step 6: Test It Works! (30 seconds)

Run the verification script:
```bash
./scripts/setup-google-cloud.sh
```

Or test directly:
```bash
npm run generate:audio:custom "ა" "test-letter" word
```

**Expected output:**
- ✅ Success: `Generated: public/audio/words/test-letter.mp3`
- Check file exists: `ls public/audio/words/test-letter.mp3`

---

## 📋 **Checklist - Copy & Paste**

- [ ] Created Google Cloud project
- [ ] Enabled Cloud Text-to-Speech API
- [ ] Created service account: `tts-service`
- [ ] Added role: "Cloud Text-to-Speech API User"
- [ ] Downloaded service account JSON key file
- [ ] Created `.env.local` file
- [ ] Added `GOOGLE_CLOUD_PROJECT_ID` to `.env.local`
- [ ] Added `GOOGLE_APPLICATION_CREDENTIALS` to `.env.local` (with full path)
- [ ] Tested: `npm run generate:audio:custom "ა" "test" word`
- [ ] Generated all 33 letters: `npm run generate:audio:letters`

---

## 🚀 **Once Setup is Complete**

### Generate Initial Audio Files:

```bash
# Generate all 33 Georgian letters (~10 seconds)
npm run generate:audio:letters

# Generate vocabulary for specific lesson
npm run generate:audio:vocab a1-1

# Generate all vocabulary (takes longer)
npm run generate:audio:vocab
```

### Commit Generated Files:

```bash
git add public/audio/
git commit -m "Add generated Georgian audio files"
git push
```

---

## 📧 **For Vercel Production**

After setting up locally, add these to **Vercel Environment Variables**:

1. Go to Vercel dashboard > Your project > Settings > Environment Variables

2. Add:
   - **Key:** `GOOGLE_CLOUD_PROJECT_ID`
   - **Value:** `your-project-id` (same as local)
   - **Environments:** Production, Preview, Development

3. Add:
   - **Key:** `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value:** (paste entire JSON content from your service account file)
   - **Environments:** Production, Preview, Development

   **Important:** For the JSON value:
   - Open your downloaded service account JSON file
   - Copy the **entire contents** (it's one JSON object)
   - Paste it as the value
   - It should start with `{"type":"service_account"...}`

---

## ✅ **Summary**

**I've Done:**
- ✅ Installed all packages
- ✅ Created all code files
- ✅ Set up scripts and configuration
- ✅ Added security (gitignore)
- ✅ Created documentation

**You Need to Do:**
- 🔴 Create Google Cloud project (2 min)
- 🔴 Enable Text-to-Speech API (1 min)
- 🔴 Create service account (2 min)
- 🔴 Download JSON key (1 min)
- 🔴 Configure `.env.local` (30 sec)
- 🔴 Test it works (30 sec)

**Total Time:** ~7 minutes

---

**Once you complete the manual steps, you're ready to generate Georgian audio!** 🎙️🇬🇪

