import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALT2bKD6IjvNj_P53ZQAsYGro68I0CcfE",
  authDomain: "uniguid-pk.firebaseapp.com",
  projectId: "uniguid-pk",
  storageBucket: "uniguid-pk.firebasestorage.app",
  messagingSenderId: "74959748859",
  appId: "1:74959748859:web:5a8a6de7180677074dfa5e",
  measurementId: "G-SWD9489852"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function dumpDatabase() {
  const collections = ['courses', 'scholarships', 'universities', 'admissions', 'users', '_test_connection', 'pending_ai_updates'];
  
  console.log("=== FIRESTORE DATABASE DUMP ===\n");
  
  for (const coll of collections) {
    console.log(`\n--- COLLECTION: ${coll} ---`);
    try {
      const snapshot = await getDocs(collection(db, coll));
      if (snapshot.empty) {
        console.log("  (Empty)");
      } else {
        snapshot.forEach(doc => {
          console.log(`  DOC ID: ${doc.id}`);
          console.log(`  DATA:`, JSON.stringify(doc.data(), null, 2));
          console.log(`  - - - - - - - - - - - - -`);
        });
      }
    } catch (e) {
      console.log(`  Error reading collection (possibly rules issue): ${e.message}`);
    }
  }
  
  process.exit(0);
}

dumpDatabase();
