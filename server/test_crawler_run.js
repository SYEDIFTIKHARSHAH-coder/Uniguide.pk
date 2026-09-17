import "dotenv/config";
import { runAICrawler } from "./services/aiCrawler.service.js";
import admin from "./firebase/admin.js";

async function main() {
  console.log("Triggering live crawler...");
  await runAICrawler();
  
  // Wait a moment for firestore to settle
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("\n--- Checking Pending Approvals Queue for the Result ---");
  const db = admin.firestore();
  
  // We just fetch the most recent item from the queue
  const snapshot = await db.collection("pending_ai_updates")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0].data();
    // Exclude firestore metadata so it's just the clean JSON
    const { timestamp, confidenceScore, status, ...cleanJson } = doc;
    console.log("RAW EXTRACTED JSON:");
    console.log(JSON.stringify(cleanJson, null, 2));
  } else {
    console.log("No data found in queue. Did extraction fail?");
  }
  
  process.exit(0);
}

main().catch(console.error);
