/**
 * Manual test script for the Expiry Cron Job.
 * Run with: node test_expiry_cron.cjs
 */
import admin from "./firebase/admin.js";
import { runExpiryCheck } from "./cron/expiryCheck.cron.js";

async function main() {
  const db = admin.firestore();
  console.log("▶ Injecting mock expired data into live collections...");

  // 1. Create a mock university with an expired deadline
  const expiredUniRef = db.collection("universities").doc("test_expired_uni_1");
  await expiredUniRef.set({
    name: "Expired Test University",
    deadline: "2020-01-01T00:00:00Z", // Way in the past
    status: "approved"
  });

  // 2. Create a mock scholarship with an expired deadline
  const expiredScholRef = db.collection("scholarships").doc("test_expired_schol_1");
  await expiredScholRef.set({
    name: "Expired Test Scholarship",
    deadline: "2023-05-10T00:00:00Z",
    status: "approved"
  });

  // 3. Create a mock course with a FUTURE deadline (to prove it doesn't get archived)
  const futureCourseRef = db.collection("courses").doc("test_future_course_1");
  await futureCourseRef.set({
    name: "Future Test Course",
    deadline: "2099-12-31T00:00:00Z",
    status: "approved"
  });

  console.log("✅ Test data injected.");
  console.log("▶ Running Expiry Checker manually...");

  // 4. Run the expiry checker
  await runExpiryCheck();

  console.log("▶ Verifying results...");

  // 5. Check if they were archived and removed
  const checkUni = await expiredUniRef.get();
  const checkSchol = await expiredScholRef.get();
  const checkCourse = await futureCourseRef.get();

  const archivedUni = await db.collection("archived_admissions").doc("test_expired_uni_1").get();
  const archivedSchol = await db.collection("archived_scholarships").doc("test_expired_schol_1").get();
  const archivedCourse = await db.collection("archived_courses").doc("test_future_course_1").get();

  console.log("\nResults:");
  console.log(`- Expired Uni in live collection? ${checkUni.exists ? 'Yes ❌' : 'No ✅'}`);
  console.log(`- Expired Uni in archived collection? ${archivedUni.exists ? 'Yes ✅' : 'No ❌'}`);
  
  console.log(`- Expired Scholarship in live collection? ${checkSchol.exists ? 'Yes ❌' : 'No ✅'}`);
  console.log(`- Expired Scholarship in archived collection? ${archivedSchol.exists ? 'Yes ✅' : 'No ❌'}`);
  
  console.log(`- Future Course in live collection? ${checkCourse.exists ? 'Yes ✅' : 'No ❌'}`);
  console.log(`- Future Course in archived collection? ${archivedCourse.exists ? 'Yes ❌' : 'No ✅'}`);

  // 6. Check the ai_activity_log for the batch log
  const logSnapshot = await db.collection("ai_activity_log")
    .where("type", "==", "archived")
    .limit(1)
    .get();

  if (!logSnapshot.empty) {
    console.log(`\n✅ Found Activity Log:`);
    console.log(JSON.stringify(logSnapshot.docs[0].data(), null, 2));
  } else {
    console.log(`\n❌ Activity Log NOT found.`);
  }

  console.log("\nCleaning up test data...");
  await archivedUni.ref.delete();
  await archivedSchol.ref.delete();
  await futureCourseRef.delete();
  
  if (!logSnapshot.empty) {
    await logSnapshot.docs[0].ref.delete();
  }
  
  console.log("Done.");
  process.exit(0);
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
