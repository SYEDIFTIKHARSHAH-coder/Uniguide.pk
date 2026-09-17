import cron from "node-cron";
import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

export function initExpiryCronJobs() {
  console.log("⏰ Initializing Cron Jobs: Expiry Checker scheduled for daily at midnight (0 0 * * *)");

  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log(`\n[CRON] Executing scheduled Expiry Checker Job - ${new Date().toISOString()}`);
    await runExpiryCheck();
  });
}

export async function runExpiryCheck() {
  const db = admin.firestore();
  let archivedCount = { admissions: 0, scholarships: 0, courses: 0 };
  const batch = db.batch();

  try {
    const now = new Date();
    
    // Helper to check expiry with a 24-hour grace period (treating deadline as end-of-day PKT)
    const isExpired = (deadlineVal) => {
      if (!deadlineVal) return false;
      
      let deadlineDate;
      // Handle Firestore Timestamp
      if (deadlineVal.toDate) {
        deadlineDate = deadlineVal.toDate();
      } else {
        // Handle ISO string or YYYY-MM-DD
        deadlineDate = new Date(deadlineVal);
      }
      
      // If invalid date, skip
      if (isNaN(deadlineDate.getTime())) return false;

      // Add 24 hours (86400000 ms) for grace period (ensures we cover up to midnight of that day in PKT)
      const expiryThreshold = new Date(deadlineDate.getTime() + 86400000);
      
      return now > expiryThreshold;
    };

    // // TODO: Add real deadline re-verification once live AI extraction is wired in
    // e.g. aiService.verifyDeadlineExtension(doc.data().sourceUrl)

    // 1. Check Universities (Admissions)
    const uniSnapshot = await db.collection("universities").get();
    for (const doc of uniSnapshot.docs) {
      const data = doc.data();
      if (isExpired(data.deadline)) {
        const archiveRef = db.collection("archived_admissions").doc(doc.id);
        batch.set(archiveRef, { ...data, archivedAt: FieldValue.serverTimestamp(), archiveReason: "expired" });
        batch.delete(doc.ref);
        archivedCount.admissions++;
      }
    }

    // 2. Check Scholarships
    const scholarshipSnapshot = await db.collection("scholarships").get();
    for (const doc of scholarshipSnapshot.docs) {
      const data = doc.data();
      if (isExpired(data.deadline)) {
        const archiveRef = db.collection("archived_scholarships").doc(doc.id);
        batch.set(archiveRef, { ...data, archivedAt: FieldValue.serverTimestamp(), archiveReason: "expired" });
        batch.delete(doc.ref);
        archivedCount.scholarships++;
      }
    }

    // 3. Check Courses
    const courseSnapshot = await db.collection("courses").get();
    for (const doc of courseSnapshot.docs) {
      const data = doc.data();
      if (isExpired(data.deadline)) {
        const archiveRef = db.collection("archived_courses").doc(doc.id);
        batch.set(archiveRef, { ...data, archivedAt: FieldValue.serverTimestamp(), archiveReason: "expired" });
        batch.delete(doc.ref);
        archivedCount.courses++;
      }
    }

    // Commit all archives and deletions
    if (archivedCount.admissions > 0 || archivedCount.scholarships > 0 || archivedCount.courses > 0) {
      await batch.commit();
      
      // Log summary to AI activity log
      const totalArchived = archivedCount.admissions + archivedCount.scholarships + archivedCount.courses;
      await db.collection("ai_activity_log").add({
        type: "archived",
        timestamp: FieldValue.serverTimestamp(),
        message: `${totalArchived} items auto-archived: ${archivedCount.admissions} admissions, ${archivedCount.scholarships} scholarships, ${archivedCount.courses} courses`,
        details: archivedCount
      });
      
      console.log(`[CRON] Expiry check complete. Archived ${totalArchived} items.`);
    } else {
      console.log(`[CRON] Expiry check complete. No items expired.`);
    }

  } catch (error) {
    console.error("[CRON] Expiry check failed:", error);
  }
}
