import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

export const getAllDiscoveries = async (status = "all") => {
  let query = db.collection("pending_ai_updates");
  if (status !== "all" && status) query = query.where("status", "==", status);
  
  const snapshot = await query.orderBy("timestamp", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDiscoveryById = async (id) => {
  const doc = await db.collection("pending_ai_updates").doc(id).get();
  if (!doc.exists) throw new Error("Discovery not found");
  return { id: doc.id, ...doc.data() };
};

export const approveDiscovery = async (id, adminName, adminNote = "") => {
  const pendingRef = db.collection("pending_ai_updates").doc(id);
  const logRef = db.collection("ai_activity_log").doc();

  // Run as transaction or batch
  const batch = db.batch();

  const doc = await pendingRef.get();
  if (!doc.exists) throw new Error("Discovery not found");
  
  const data = doc.data();
  if (data.status === "approved") throw new Error("Already approved");

  let targetCollection = "universities";
  if (data.type === "scholarship") targetCollection = "scholarships";
  if (data.type === "free_course") targetCollection = "courses";
  if (data.type === "article") targetCollection = "articles";
  if (data.type === "entry_test") targetCollection = "entry_tests";
  
  const liveRef = db.collection(targetCollection).doc();

  // Prepare live data
  const liveData = {
    ...data,
    status: "approved",
    publishedAt: FieldValue.serverTimestamp(),
    approvedBy: adminName,
  };
  
  // Cleanup fields not needed in live collection
  delete liveData.confidenceScore;
  delete liveData.timestamp;
  if (adminNote) liveData.adminNote = adminNote;

  // 1. Add to live collection
  batch.set(liveRef, liveData);

  // 2. Update pending document status (or delete it, but let's keep it as approved for history)
  batch.update(pendingRef, {
    status: "approved",
    approvedBy: adminName,
    publishedAt: FieldValue.serverTimestamp(),
    adminNote: adminNote,
    liveId: liveRef.id,
    targetCollection
  });

  // 3. Log the activity
  batch.set(logRef, {
    type: "approved",
    message: `${data.universityName || data.name} approved by ${adminName}`,
    timestamp: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { id: pendingRef.id, ...data, status: "approved", liveId: liveRef.id, targetCollection };
};

export const rejectDiscovery = async (id, reason, adminName) => {
  const pendingRef = db.collection("pending_ai_updates").doc(id);
  const logRef = db.collection("ai_activity_log").doc();
  
  const batch = db.batch();
  
  const doc = await pendingRef.get();
  if (!doc.exists) throw new Error("Discovery not found");

  batch.update(pendingRef, {
    status: "rejected",
    rejectionReason: reason,
    rejectedBy: adminName,
  });

  batch.set(logRef, {
    type: "rejected",
    message: `${doc.data().universityName} rejected: ${reason}`,
    timestamp: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { id, ...doc.data(), status: "rejected" };
};

export const editDiscovery = async (id, updatedData, adminName) => {
  const pendingRef = db.collection("pending_ai_updates").doc(id);
  const logRef = db.collection("ai_activity_log").doc();

  const doc = await pendingRef.get();
  if (!doc.exists) throw new Error("Discovery not found");
  
  const currentData = doc.data();
  const newDataField = { ...currentData.data, ...updatedData };

  const batch = db.batch();

  batch.update(pendingRef, {
    data: newDataField,
    lastEditedBy: adminName,
    lastEditedAt: FieldValue.serverTimestamp(),
  });

  batch.set(logRef, {
    type: "edit",
    message: `${currentData.universityName} data edited by ${adminName}`,
    timestamp: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { id, ...currentData, data: newDataField };
};

export const getActivityLog = async (limitNum = 50) => {
  const snapshot = await db.collection("ai_activity_log")
    .orderBy("timestamp", "desc")
    .limit(limitNum)
    .get();
    
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp ? data.timestamp.toDate() : null
    };
  });
};

export const getDashboardStats = async () => {
  // Simple aggregations. In production with huge datasets, we'd use Firestore aggregations.
  const pendingCount = (await db.collection("pending_ai_updates").where("status", "==", "pending_review").count().get()).data().count;
  const approvedCount = (await db.collection("pending_ai_updates").where("status", "==", "approved").count().get()).data().count;
  const rejectedCount = (await db.collection("pending_ai_updates").where("status", "==", "rejected").count().get()).data().count;
  
  // Get recently archived count from ai_activity_log (archived in last 30 days or total, for simplicity total here)
  const archivedCountRes = await db.collection("ai_activity_log").where("type", "==", "archived").count().get();
  const recentlyArchivedCount = archivedCountRes.data().count || 0;

  const snapshot = await db.collection("pending_ai_updates").get();
  let totalConf = 0;
  snapshot.forEach(doc => { totalConf += (doc.data().confidenceScore || 0); });
  const avgConfidence = snapshot.size > 0 ? totalConf / snapshot.size : 0;

  return {
    totalDiscoveries: snapshot.size,
    pendingReview: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    recentlyArchived: recentlyArchivedCount,
    changesDetected: 0, 
    avgConfidenceScore: parseFloat(avgConfidence.toFixed(2)),
    lastCrawlTime: new Date().toISOString(),
    universitiesCovered: snapshot.size, // Kept for backwards compatibility
  };
};

export const triggerManualCrawl = async (adminName) => {
  // This is replaced by the controller actually calling the runner, but kept for signature compatibility
  throw new Error("Use aiCrawler.service.js runAICrawler instead");
};
