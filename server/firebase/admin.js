// ============================================================
// firebase/admin.js
// Firebase Admin SDK initialization — server-side only.
// Used to verify Google ID tokens from clients.
// SINGLE-TENANT SETUP — ssyediftikharshah49@gmail.com is the only super_admin.
// ============================================================

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

let adminApp;

export function getAdminApp() {
  if (adminApp) return adminApp;

  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      let serviceAccount = JSON.parse(serviceAccountJson);
      if (typeof serviceAccount === "string") {
        serviceAccount = JSON.parse(serviceAccount);
      }
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("✅ Firebase Admin SDK initialized with Render environment credentials");
      return adminApp;
    } catch (e) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e.message);
    }
  }

  if (existsSync(serviceAccountPath)) {
    // ── PRODUCTION: Use service account JSON from file ──
    try {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("✅ Firebase Admin SDK initialized with service account");
    } catch (e) {
      console.error("❌ Failed to parse firebase-service-account.json:", e.message);
      process.exit(1);
    }
  } else {
    // ── DEVELOPMENT FALLBACK: Use Application Default Credentials ──
    try {
      adminApp = initializeApp({
        projectId: "uniguid-pk",
      });
      console.log("⚠️  Firebase Admin SDK initialized without credentials (limited mode)");
      console.warn("    To verify Google Sign-In tokens server-side, ensure firebase-service-account.json is in the server root.");
    } catch (e) {
      console.error("❌ Firebase Admin init failed:", e.message);
    }
  }

  return adminApp;
}

// Initialize on import
getAdminApp();

export default {
  auth: () => getAuth(adminApp),
  firestore: () => getFirestore(adminApp)
};
