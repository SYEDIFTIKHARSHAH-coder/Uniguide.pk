import "dotenv/config";
import admin from "./firebase/admin.js";

async function main() {
  const db = admin.firestore();
  
  const snapshot = await db.collection("universities").get();
  console.log(`\nTotal universities in Firestore: ${snapshot.size}`);
  
  if (snapshot.size === 0) {
    console.log("No universities found.");
  } else {
    snapshot.docs.forEach((doc, i) => {
      const d = doc.data();
      console.log(`\n[${i+1}] ID: ${doc.id}`);
      console.log(`    Name: ${d.name || d.universityName || "N/A"}`);
      console.log(`    City: ${d.city || "N/A"}`);
      console.log(`    Status: ${d.status || "N/A"}`);
    });
  }
  
  process.exit(0);
}

main().catch(console.error);
