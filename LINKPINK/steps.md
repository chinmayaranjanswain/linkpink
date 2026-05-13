# LINKPINK — Complete Setup Guide (Beginner-Friendly)

---

## ⚠️ OpenAI API — Is It Free?

**NO, OpenAI API is NOT free.** Here's the breakdown:

| What | Cost |
|------|------|
| ChatGPT (website) | Free tier exists |
| OpenAI API (for apps) | **Paid only** — $5 minimum credit to start |
| text-embedding-ada-002 | ~$0.0001 per 1K tokens (cheap but not free) |
| GPT-4o mini | ~$0.15 per 1M input tokens |

**For LINKPINK, you DON'T need OpenAI.** We can use:
- YouTube Data API (FREE — 10,000 units/day)
- Open-source AI models (Ollama, free local)
- Supabase built-in features (free tier)

---

## Phase 1: Supabase Backend (FREE)

### Step 1 — Create Supabase Project
1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `linkpink`
   - **Database Password:** make something strong, save it somewhere
   - **Region:** pick closest to you (e.g., Mumbai for India)
5. Wait 2 minutes for project to create

### Step 2 — Get Your API Keys
1. In Supabase Dashboard → click **⚙️ Settings** (left sidebar, gear icon)
2. Click **API** under "Configuration"
3. You'll see:
   - **Project URL** → looks like `https://abcdef.supabase.co`
   - **anon public key** → starts with `eyJ...` (long string)
4. Copy both

### Step 3 — Setup Database Tables
1. In Supabase Dashboard → click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase/schema.sql` from your project
4. Copy-paste the ENTIRE file content into the SQL editor
5. Click **"Run"** (green button)
6. You should see "Success" message
7. Verify: Go to **Table Editor** → you should see tables: `users`, `saves`, `collections`, etc.

### Step 4 — Configure Your App
1. In your project, open `.env` file (or create from `.env.example`)
2. Fill in:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key
   ```
3. Save the file

### Step 5 — Enable Authentication
1. Supabase Dashboard → **Authentication** (left sidebar)
2. Click **Providers**
3. Email is already enabled by default ✅
4. To add Google login:
   - Toggle **Google** ON
   - You need Google OAuth Client ID (from Google Cloud Console)
   - For now, skip this — email auth works fine

---

## Phase 2: YouTube Data API (FREE — 100% Free)

YouTube gives you **10,000 free API units per day** — enough for ~100-200 video lookups daily.

### Step 6 — Create Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Sign in with your Google account
3. At the top, click the project dropdown → **"New Project"**
4. Name it `linkpink` → Click **"Create"**
5. Wait 10 seconds, then select your new project from the dropdown

### Step 7 — Enable YouTube Data API

1. In Google Cloud Console → left sidebar → **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it → Click **"ENABLE"** (blue button)
4. Wait for it to activate

### Step 8 — Create API Key

1. Left sidebar → **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at top → select **"API Key"**
3. A popup shows your new API key (looks like `AIzaSy...`)
4. **Copy this key immediately!**
5. (Optional but recommended) Click **"Edit API Key"** → under "API restrictions":
   - Select **"Restrict key"**
   - Check only **"YouTube Data API v3"**
   - Click **Save**

### Step 9 — Add Key to Your App

1. Open your `.env` file
2. Add this line:
   ```
   EXPO_PUBLIC_YOUTUBE_API_KEY=AIzaSy...your-key-here
   ```
3. Save

### Step 10 — How It Works

With this API key, your app can now fetch:
```
GET https://www.googleapis.com/youtube/v3/videos
  ?id=VIDEO_ID
  &part=snippet,contentDetails,statistics
  &key=YOUR_API_KEY
```

Response gives you:
- **Title** of the video
- **Description**
- **Thumbnail URLs** (multiple sizes)
- **Channel name**
- **Duration** (e.g., "PT15M33S" = 15 min 33 sec)
- **View count, like count**

**Cost:** Each video lookup = 1 unit. You get 10,000/day FREE = ~200 lookups/day.

---

## Phase 3: Build Real App (APK for Android / IPA for iOS)

### Option A: EAS Build (Recommended — Cloud Build)

EAS = Expo Application Services. Builds your app on Expo's servers.

**Free tier:** 30 builds/month on free plan.

#### Step 11 — Create Expo Account

1. Go to **https://expo.dev**
2. Click **"Sign Up"** → create account (use GitHub or email)
3. In your terminal, run:
   ```bash
   npx eas login
   ```
4. Enter your Expo email and password

#### Step 12 — Configure EAS

1. In your terminal (inside LINKPINK folder):
   ```bash
   npx eas build:configure
   ```
2. It creates `eas.json` file. The defaults are fine.
3. Your `eas.json` should look like:
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {}
     }
   }
   ```

#### Step 13 — Build Android APK

This builds an APK you can install on any Android phone:

```bash
npx eas build --platform android --profile preview
```

**What happens:**
1. Your code gets uploaded to Expo's servers
2. They compile it into a real Android app (takes 10-20 minutes)
3. You get a download link for the `.apk` file
4. Download it → transfer to your phone → install

**First time only:** It will ask you to create a keystore. Just press Enter to let Expo handle it.

#### Step 14 — Build iOS App

**Requirements:** You need an Apple Developer account ($99/year)

For testing WITHOUT Apple Developer account:
```bash
npx eas build --platform ios --profile development
```
This creates a development build you can run on iOS Simulator.

For real device testing with Apple Developer:
```bash
npx eas build --platform ios --profile preview
```

#### Step 15 — Install on Your Phone

**Android:**
1. After build finishes, you get a URL like `https://expo.dev/artifacts/eas/...`
2. Open that URL on your Android phone
3. Download the APK
4. Open it → "Install Unknown Apps" → Allow → Install
5. Done! LINKPINK is now on your phone 🎉

**iOS:**
1. After build, you get a link
2. Open on your iPhone → it installs via TestFlight or Ad-Hoc profile
3. Go to Settings → General → VPN & Device Management → Trust the developer

---

### Option B: Local Build (No Internet Needed)

If you want to build locally without Expo's servers:

#### Android Local Build

**Requirements:** 
- Java JDK 17
- Android Studio installed
- Android SDK

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

#### iOS Local Build

**Requirements:**
- macOS only (cannot build iOS on Windows)
- Xcode installed

```bash
npx expo prebuild --platform ios
cd ios
xcodebuild -workspace LinkPink.xcworkspace -scheme LinkPink -configuration Release
```

---

## Quick Commands Reference

| What | Command |
|------|---------|
| Start dev server | `npx expo start` |
| Run on web | `npx expo start --web` |
| Run on Android emulator | `npx expo start --android` |
| Run on iOS simulator | `npx expo start --ios` |
| Build Android APK (cloud) | `npx eas build --platform android --profile preview` |
| Build iOS (cloud) | `npx eas build --platform ios --profile preview` |
| Build both (cloud) | `npx eas build --platform all` |
| Login to Expo | `npx eas login` |
| Check build status | `npx eas build:list` |

---

## Summary: What's Free, What's Not

| Service | Free? | Limit |
|---------|-------|-------|
| **Supabase** | ✅ Yes | 500MB DB, 1GB storage, 50K monthly users |
| **YouTube Data API** | ✅ Yes | 10,000 units/day (~200 video lookups) |
| **Expo / EAS Build** | ✅ Yes | 30 builds/month |
| **OpenAI API** | ❌ No | $5 minimum (we don't need this) |
| **Apple Developer** | ❌ $99/year | Required only for iOS App Store |
| **Google Play Console** | ❌ $25 one-time | Required only for Play Store publishing |

**Total cost to test on your phone: $0** (Android APK via EAS free tier)
