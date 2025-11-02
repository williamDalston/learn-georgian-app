# Google Cloud TTS - Your Manual Steps

**Everything is set up!** You just need to configure Google Cloud credentials.

---

## ⚡ **Quick Checklist (7 Minutes Total)**

- [ ] Step 1: Create Google Cloud Project (2 min)
- [ ] Step 2: Enable Text-to-Speech API (1 min)
- [ ] Step 3: Create Service Account (2 min)
- [ ] Step 4: Download JSON Key (1 min)
- [ ] Step 5: Configure .env.local (30 sec)
- [ ] Step 6: Test It Works (30 sec)

---

## 📝 **Detailed Steps**

### Step 1: Create Google Cloud Project (2 minutes)

1. Go to: **https://console.cloud.google.com/**
2. Click **"Create Project"** button (top right)
3. Enter:
   - **Project name:** `learn-georgian-tts`
   - (Project ID will auto-generate)
4. Click **"Create"**
5. **Wait for project to be created** (usually 10-30 seconds)
6. **Note your Project ID** (visible at top or in project settings)

---

### Step 2: Enable Text-to-Speech API (1 minute)

1. In your new project, click **"APIs & Services"** in left sidebar
2. Click **"Library"**
3. In search box, type: `Cloud Text-to-Speech API`
4. Click on **"Cloud Text-to-Speech API"**
5. Click the big blue **"Enable"** button
6. Wait for it to enable (usually instant)

**✅ Done when you see:** "API enabled" message

---

### Step 3: Create Service Account (2 minutes)

1. In left sidebar, go to **"IAM & Admin"** > **"Service Accounts"**
2. Click **"Create Service Account"** (top of page)
3. Fill in:
   - **Service account name:** `tts-service`
   - **Service account ID:** (auto-fills, keep default)
   - **Description:** `Service account for Georgian TTS generation` (optional)
4. Click **"Create and Continue"**

5. **Grant access:**
   - Under **"Grant this service account access to project"**
   - Click **"Select a role"** dropdown
   - Type: `Cloud Text-to-Speech API User`
   - Select **"Cloud Text-to-Speech API User"** from list
   - Click **"Continue"**

6. (Skip optional step) Click **"Done"**

**✅ You should see:** Your new service account listed

---

### Step 4: Create & Download Key (1 minute)

1. Click on your service account (`tts-service`)
2. Click **"Keys"** tab
3. Click **"Add Key"** dropdown
4. Select **"Create new key"**
5. Choose **"JSON"** (not P12)
6. Click **"Create"**
7. **A JSON file will automatically download** - save it somewhere (like Downloads folder)

**⚠️ IMPORTANT:**
- This file contains sensitive credentials
- Don't share it publicly
- Don't commit it to git (already protected by .gitignore)

**✅ You now have:** A JSON file like `learn-georgian-tts-123456-abc123.json`

---

### Step 5: Configure .env.local (30 seconds)

1. In your project root, create `.env.local`:
   ```bash
   # If .env.local.example exists:
   cp .env.local.example .env.local
   
   # Or create manually:
   touch .env.local
   ```

2. Edit `.env.local` and add:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
   GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/your-downloaded-json-file.json
   ```

3. **Replace:**
   - `your-project-id-here` with your actual Project ID (from Step 1)
   - `/full/path/to/your-downloaded-json-file.json` with the actual path to your downloaded JSON file

   **Example:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID=learn-georgian-tts-123456
   GOOGLE_APPLICATION_CREDENTIALS=/Users/williamalston/Downloads/learn-georgian-tts-123456-abc123.json
   ```

   **Important:** Use **absolute path** (starting with `/`) not relative path!

---

### Step 6: Test It Works! (30 seconds)

**Option 1: Run verification script**
```bash
./scripts/setup-google-cloud.sh
```

**Option 2: Test directly**
```bash
npm run generate:audio:custom "ა" "test-letter" word
```

**Expected:**
- ✅ Console shows: `✅ Generated: public/audio/words/test-letter.mp3`
- Check file: `ls public/audio/words/test-letter.mp3`

**If it works:**
```bash
# Generate all 33 letters
npm run generate:audio:letters
```

---

## 🚨 **Common Issues & Fixes**

### "Could not load the default credentials"
**Fix:** Check that `GOOGLE_APPLICATION_CREDENTIALS` path is correct and absolute

### "The caller does not have permission"
**Fix:** Make sure service account has "Cloud Text-to-Speech API User" role

### "Project not found"
**Fix:** Check `GOOGLE_CLOUD_PROJECT_ID` matches your actual project ID

### "API not enabled"
**Fix:** Go back to Step 2 and enable the API

---

## 🎯 **Once Setup Works**

### Generate Initial Audio:

```bash
# All 33 letters (~10 seconds)
npm run generate:audio:letters

# Vocabulary for specific lesson
npm run generate:audio:vocab a1-1

# All vocabulary (takes longer)
npm run generate:audio:vocab
```

### Commit Files:

```bash
git add public/audio/
git commit -m "Add Georgian audio files generated via Google Cloud TTS"
git push
```

---

## 📧 **For Vercel (Production)**

After local setup works, add these in **Vercel Dashboard** > **Settings** > **Environment Variables**:

1. **`GOOGLE_CLOUD_PROJECT_ID`**
   - Value: Your project ID (same as local)
   - Environments: All

2. **`GOOGLE_APPLICATION_CREDENTIALS_JSON`**
   - Value: Paste **entire JSON content** from your service account file
   - Environments: All
   - **Important:** Open your JSON file, copy everything, paste as value

---

## ✅ **You're Done When...**

- ✅ `.env.local` is configured
- ✅ `npm run generate:audio:custom "ა" "test" word` succeeds
- ✅ `public/audio/words/test-letter.mp3` file exists
- ✅ You can run `npm run generate:audio:letters` successfully

---

## 📚 **Helpful Links**

- [Google Cloud Console](https://console.cloud.google.com/)
- [Cloud Text-to-Speech API](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
- [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
- [Full Documentation](GOOGLE-CLOUD-TTS-SETUP.md)

---

**Need help?** Check `SETUP-STATUS.md` for what's already done, or `GOOGLE-CLOUD-SETUP-QUICK-START.md` for detailed guide.

**Ready!** Follow the 6 steps above and you'll be generating Georgian audio in ~7 minutes! 🎙️🇬🇪

