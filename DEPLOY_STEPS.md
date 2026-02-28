# Step-by-Step Deployment Guide

Follow these steps to deploy Public Connect so everyone can use it.

---

## Part 1: Deploy the API Server (Render)

### Step 1.1: Push your code to GitHub

1. Create a GitHub account at [github.com](https://github.com) if you don't have one.
2. Create a new repository (e.g. `public-connect`).
3. In your project folder, run:
   ```powershell
   cd c:\Users\Ravikiran\.gemini\antigravity\scratch\public-connect
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/public-connect.git
   git push -u origin main
   ```
4. Replace `YOUR_USERNAME` with your GitHub username.

### Step 1.2: Create Render account and deploy

1. Go to [render.com](https://render.com) and sign up (free).
2. Click **New** → **Web Service**.
3. Connect your GitHub repo `public-connect`.
4. Configure:
   - **Name:** `public-connect-api` (or any name)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Click **Advanced** → **Add Environment Variable** and add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your full Atlas URI (same as in .env)
   - `CORS_ORIGIN` = `https://your-web-app.vercel.app` (we'll get this after Part 2; for now use `*` to allow all, or leave empty for dev)
   - `ADMIN_PHONE_NUMBERS` = your phone (comma-separated if multiple)
   - `ADMIN_EMAILS` = your email (comma-separated if multiple)
   - `FIREBASE_SERVICE_ACCOUNT` = paste your Firebase service account JSON as a single line
6. Click **Create Web Service**.
7. Wait for the build. Copy your API URL, e.g. `https://public-connect-api.onrender.com` (no trailing slash).

### Step 1.3: Verify API

- Open `https://YOUR_API_URL/health` in a browser. You should see `{"status":"ok","db":"connected"}`.
- The first deploy auto-seeds schemes; no manual seed needed.

---

## Part 2: Deploy the Web App (Vercel)

### Step 2.1: Add client env file

1. In `client/`, create or edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_API_URL/api
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   ```
2. Replace `YOUR_API_URL` with your Render URL (e.g. `https://public-connect-api.onrender.com`).
3. Get Firebase values from [Firebase Console](https://console.firebase.google.com) → Project Settings → General.

### Step 2.2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free).
2. Click **Add New** → **Project**.
3. Import your GitHub repo `public-connect`.
4. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (default)
   - Add environment variables (same as `.env.local`):
     - `NEXT_PUBLIC_API_URL` = `https://YOUR_API_URL/api`
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. Click **Deploy**.
6. Copy your web app URL, e.g. `https://public-connect.vercel.app`.

### Step 2.3: Update CORS on server

1. In Render dashboard → Your service → **Environment**.
2. Set `CORS_ORIGIN` = `https://public-connect.vercel.app` (your Vercel URL).
3. Redeploy if needed.

---

## Part 3: Build Android APK for distribution

### Step 3.1: Build client with production API

1. In `client/.env.local`, ensure:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_RENDER_URL/api
   ```
2. Build and sync:
   ```powershell
   cd client
   npm run build
   npx cap sync android
   ```

### Step 3.2: Build debug APK

```powershell
cd android
./gradlew assembleDebug
```

APK output: `client/android/app/build/outputs/apk/debug/app-debug.apk`

### Step 3.3: Build release APK (for Play Store)

1. Create a keystore and sign the app (see [Android signing docs](https://developer.android.com/studio/publish/app-signing)).
2. Configure `android/app/build.gradle` with your signing config.
3. Run: `./gradlew assembleRelease`

---

## Summary of URLs

| What        | Example URL                               |
|-------------|-------------------------------------------|
| API (Render)| `https://public-connect-api.onrender.com` |
| Web (Vercel)| `https://public-connect.vercel.app`       |
| Health check| `https://YOUR_API/health`                 |

---

## Troubleshooting

- **API returns 503:** Check Render logs; MongoDB connection or env vars may be wrong.
- **CORS errors:** Set `CORS_ORIGIN` on Render to your Vercel URL (no trailing slash).
- **Schemes empty:** Server auto-seeds on first connect; check MongoDB Atlas Network Access has `0.0.0.0/0`.
- **Firebase auth fails:** Ensure Firebase project has your domain in Authorized domains (Firebase Console → Authentication → Settings).
