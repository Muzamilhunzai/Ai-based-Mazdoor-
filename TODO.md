# Cloud Run Deployment Plan for Mazdoor Market

## Project Analysis
- **Framework**: Next.js 14.2.0
- **Dockerfile**: Already configured with Node.js 18 and port 8080
- **Output Mode**: 'standalone' in next.config.js (optimized for containers)

## Environment Variables Required
The app requires the following environment variables to function properly:

### 1. GEMINI_API_KEY (Required for AI features)
Used in:
- `lib/gemini.js` - AI query parsing
- `app/api/ai/route.js` - AI chat endpoint
- `app/api/ai/bio/route.js` - AI bio generation

### 2. Firebase Config (Client-side)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

## Deployment Steps

### Step 1: Prerequisites
- [ ] Install Google Cloud SDK from https://cloud.google.com/sdk/docs/install
- [ ] Create a project on Google Cloud Console (if not already done)
- [ ] Redeem cloud credits in the project

### Step 2: Authentication
Run these commands in terminal:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy mazdoor-market \
 --source . \
 --region us-central1 \
 --allow-unauthenticated \
 --min-instances 0 \
 --quiet
```

### Step 4: Configure Environment Variables
1. Go to Cloud Run Console: https://console.cloud.google.com/run
2. Select your service (mazdoor-market)
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add these environment variables:
   - GEMINI_API_KEY = your_api_key_here
   - NEXT_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
   - NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id

### Step 5: Redeploy with Variables
After adding environment variables, click "Deploy"

## Deployment Commands Summary

```bash
# Step 2 - Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Step 3 - Deploy
gcloud run deploy mazdoor-market \
 --source . \
 --region us-central1 \
 --allow-unauthenticated \
 --min-instances 0 \
 --quiet
```

## Expected Output
After successful deployment, you'll get a Service URL like:
`https://mazdoor-market-xxxxx-uc.a.run.app`

## Important Notes
1. Keep `min-instances = 0` to enable scale-to-zero (no cost when idle)
2. The app uses the `standalone` output mode which is optimized for containers
3. Ensure your Google Skills profile is public for the AI Seekho competition
