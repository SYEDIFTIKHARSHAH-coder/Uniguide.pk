// ============================================================
// routes/auth.routes.js
//
// SINGLE-TENANT / SINGLE-ADMIN AUTH SYSTEM
//
// Two login paths:
//   1. POST /api/auth/google   — Google Sign-In (verifies Firebase ID token server-side)
//      → ssyediftikharshah49@gmail.com always gets super_admin
//      → all others get student
//
//   2. POST /api/auth/admin-login — Hardcoded admin credentials (bcrypt-hashed password)
//      → issues JWT with role: "admin"
//
// JWT is issued as HttpOnly, Secure, SameSite=Strict cookie.
// ============================================================

import express from "express";
import bcrypt from "bcryptjs";
import admin from "../firebase/admin.js";
import { issueSessionCookie, clearSessionCookie, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Environment variables ────────────────────────────────────────────────────
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.toLowerCase().trim();
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD;

if (!SUPER_ADMIN_EMAIL) {
  console.error("❌ SUPER_ADMIN_EMAIL is not set in .env — Google super_admin login will not work");
}
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_PLAIN) {
  console.error("❌ ADMIN_USERNAME or ADMIN_PASSWORD is not set in .env — hardcoded admin login will not work");
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in .env — all JWT operations will fail");
}

// ─── On startup: hash the admin password once in memory ──────────────────────
// The plaintext ADMIN_PASSWORD is used only here, then discarded from active use.
// The hash is stored in memory only — never written to disk or returned to clients.
let ADMIN_PASSWORD_HASH = null;

async function initAdminPasswordHash() {
  if (!ADMIN_PASSWORD_PLAIN) {
    console.error("ADMIN_PASSWORD_PLAIN is empty!");
    return;
  }
  console.log("Plain password length:", ADMIN_PASSWORD_PLAIN.length);
  ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD_PLAIN, 12);
  console.log("🔒 Admin password hash initialized (plaintext discarded from active use)");
}

initAdminPasswordHash();

// ─── Route 1: Verify Firebase ID Token (Google & Email/Password) ──────────────────
// Client sends the Firebase ID token obtained from signInWithPopup or signInWithEmailAndPassword.
// We verify it SERVER-SIDE using Firebase Admin SDK.
//
// POST /api/auth/verify-firebase-token
// Body: { idToken: string }
router.post("/verify-firebase-token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: "Missing idToken" });
  }

  try {
    // Verify the Firebase ID token server-side
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const verifiedEmail = decodedToken.email?.toLowerCase().trim();
    const uid = decodedToken.uid;
    const name = decodedToken.name || "";

    if (!verifiedEmail) {
      return res.status(400).json({ success: false, message: "Token has no email claim" });
    }

    // ── SUPER ADMIN CHECK ──────────────────────────────────────────────────────
    const role = verifiedEmail === SUPER_ADMIN_EMAIL ? "super_admin" : "student";

    // Create or update the user document in Firestore to ensure it exists
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      await userRef.set({
        userId: uid,
        email: verifiedEmail,
        fullName: name,
        role: role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Ensure super_admin role is applied if they match the email but previously had student role
      if (role === "super_admin" && userDoc.data().role !== "super_admin") {
         await userRef.update({ role: "super_admin" });
      }
    }

    // Issue JWT session cookie
    issueSessionCookie(res, { uid, email: verifiedEmail, role, name });

    console.log(`[AUTH] Firebase sign-in verified: ${verifiedEmail} → role: ${role}`);

    return res.json({
      success: true,
      message: "Session created successfully",
      data: { uid, email: verifiedEmail, role, name },
    });
  } catch (err) {
    console.error("[AUTH] Firebase token verification failed:", err.message);

    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ success: false, message: "Firebase token expired. Please sign in again." });
    }
    if (err.code === "auth/argument-error") {
      return res.status(401).json({ success: false, message: "Invalid Firebase ID token" });
    }

    return res.status(401).json({ success: false, message: "Firebase authentication failed" });
  }
});

// ─── Route 2: Hardcoded Admin Login ──────────────────────────────────────────
// Completely separate from Firebase. Uses bcrypt-hashed password.
// Only one account can log in here: ADMIN_USERNAME / ADMIN_PASSWORD from .env
//
// POST /api/auth/admin-login
// Body: { username: string, password: string }
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  // Check username (case-insensitive)
  if (username.toLowerCase().trim() !== ADMIN_USERNAME) {
    console.log("Username mismatch:", username, "vs", ADMIN_USERNAME);
    // Deliberate generic message — don't reveal which field is wrong
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Check password hash — NEVER compare plaintext
  if (!ADMIN_PASSWORD_HASH) {
    console.log("No hash initialized");
    return res.status(503).json({ success: false, message: "Admin auth not initialized" });
  }

  console.log("Comparing password, length:", password.length);
  const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!passwordMatch) {
    console.warn(`[AUTH] Failed admin login attempt for: ${username}`);
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Issue JWT session cookie with admin role
  issueSessionCookie(res, {
    uid: "admin_syed_iftikhar",
    email: ADMIN_USERNAME,
    role: "admin",
    name: "Syed Iftikhar Shah",
  });

  console.log(`[AUTH] Admin login success: ${ADMIN_USERNAME} → role: admin`);

  return res.json({
    success: true,
    message: "Admin logged in successfully",
    data: {
      uid: "admin_syed_iftikhar",
      email: ADMIN_USERNAME,
      role: "admin",
      name: "Syed Iftikhar Shah",
    },
  });
});

// ─── Route 3: Get current session ────────────────────────────────────────────
// GET /api/auth/me
router.get("/me", verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// ─── Route 4: Logout ─────────────────────────────────────────────────────────
// POST /api/auth/logout
router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
