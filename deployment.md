# 🚀 UniGuid.pk Deployment Guide

This guide outlines the steps to deploy the UniGuid.pk platform to production. The project is split into two parts:
1. **Frontend:** React + Vite (Deployed via Firebase Hosting)
2. **Backend:** Node.js + Express (Deployed via Render)
3. **Database & Auth:** Firebase

---

## 1. Prerequisites
Before deploying, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18+)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- A [Render](https://render.com/) account
- A [Firebase](https://console.firebase.google.com/) account

---

## 2. Firebase Setup (Auth, Firestore, Hosting)

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **UniGuid.pk**.
3. Enable **Firestore Database** and **Authentication** (Email/Password & Google Sign-in).

### Step 2: Configure the Backend Service Account
1. In Firebase Console, go to **Project Settings > Service Accounts**.
2. Click **Generate New Private Key** and download the `.json` file.
3. You will need the values from this file for your backend environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).

### Step 3: Deploy Firestore Rules
From the root of your project directory:
```bash
firebase login
firebase init firestore
# Select the project you just created
firebase deploy --only firestore:rules
```

---

## 3. Backend Deployment (Render)

### Step 1: Prepare the Environment Variables
Create a new Web Service on Render and link it to your GitHub repository. In the Render dashboard, set the following Environment Variables for the backend:

- `PORT`: `5000`
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://uniguidpk-prod.web.app` (Your Firebase hosting URL)
- `FIREBASE_PROJECT_ID`: (From the downloaded JSON)
- `FIREBASE_CLIENT_EMAIL`: (From the downloaded JSON)
- `FIREBASE_PRIVATE_KEY`: (From the downloaded JSON, ensure newlines are handled correctly or base64 encoded)

### Step 2: Configure Render Build Settings
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `server` (Important: since the backend is in the `/server` folder)

Click **Deploy** and wait for the backend to go live. Note the backend URL (e.g., `https://uniguidpk-backend.onrender.com`).

---

## 4. Frontend Deployment (Firebase Hosting)

### Step 1: Update Frontend Environment Variables
In the `/client` directory, create a `.env.production` file:

```env
VITE_API_BASE_URL=https://uniguidpk-backend.onrender.com/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=uniguidpk-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=uniguidpk-prod
VITE_FIREBASE_STORAGE_BUCKET=uniguidpk-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Build the Frontend
```bash
cd client
npm install
npm run build
```

### Step 3: Deploy to Firebase Hosting
From the root of your project directory (where `firebase.json` is located):
```bash
firebase deploy --only hosting
```

Your frontend is now live!

---

## 5. Final Verification
1. Visit the Firebase Hosting URL.
2. Open the browser console to ensure there are no CORS or API errors.
3. Test logging in as the Admin (`ifitkharbusiness100@gmail.com`).
4. Trigger an AI Crawl from the Admin Dashboard and ensure the backend processes it.
