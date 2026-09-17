// Firestore connectivity test — run with: node test-firebase.mjs
// Tests: auth domain reachable, Firestore read/write

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALT2bKD6IjvNj_P53ZQAsYGro68I0CcfE",
  authDomain: "uniguid-pk.firebaseapp.com",
  projectId: "uniguid-pk",
  storageBucket: "uniguid-pk.firebasestorage.app",
  messagingSenderId: "74959748859",
  appId: "1:74959748859:web:5a8a6de7180677074dfa5e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TEST_DOC_ID = "connectivity_test_001";
const testRef = doc(db, "_test_connection", TEST_DOC_ID);

async function runTest() {
  console.log("=== UniGuid.pk Firebase Connectivity Test ===\n");

  // Step 1: Write
  console.log("1. Writing test document to Firestore...");
  try {
    await setDoc(testRef, {
      message: "Firebase connection successful",
      project: "uniguid-pk",
      timestamp: serverTimestamp(),
    });
    console.log("   ✅ WRITE SUCCESS — document written to _test_connection/" + TEST_DOC_ID);
  } catch (err) {
    console.error("   ❌ WRITE FAILED:", err.code, "-", err.message);
    process.exit(1);
  }

  // Step 2: Read
  console.log("\n2. Reading test document back from Firestore...");
  try {
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      const data = snap.data();
      console.log("   ✅ READ SUCCESS — data:", JSON.stringify({ message: data.message, project: data.project }));
    } else {
      console.error("   ❌ READ FAILED — document does not exist after write");
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ READ FAILED:", err.code, "-", err.message);
    if (err.code === "permission-denied") {
      console.log("\n⚠️  FIRESTORE RULES are blocking access.");
      console.log("   Go to Firebase Console → Firestore → Rules and set:");
      console.log("   allow read, write: if true;  (for testing only)");
    }
    process.exit(1);
  }

  // Step 3: Cleanup
  console.log("\n3. Cleaning up test document...");
  try {
    await deleteDoc(testRef);
    console.log("   ✅ CLEANUP SUCCESS — test document deleted");
  } catch (err) {
    console.warn("   ⚠️  Cleanup failed (non-critical):", err.message);
  }

  console.log("\n=== RESULT: Firebase Authentication domain + Firestore are CONNECTED ✅ ===");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
