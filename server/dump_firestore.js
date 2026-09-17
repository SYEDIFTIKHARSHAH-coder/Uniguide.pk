import admin from './firebase/admin.js';
import "dotenv/config";

async function dumpDatabase() {
  const collections = ['courses', 'scholarships', 'universities', 'admissions', 'users', '_test_connection', 'pending_ai_updates'];
  const db = admin.firestore();
  
  console.log("=== FIRESTORE DATABASE DUMP ===\n");
  
  for (const coll of collections) {
    console.log(`\n--- COLLECTION: ${coll} ---`);
    try {
      const snapshot = await db.collection(coll).get();
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
      console.log(`  Error reading collection: ${e.message}`);
    }
  }
  
  process.exit(0);
}

dumpDatabase();
