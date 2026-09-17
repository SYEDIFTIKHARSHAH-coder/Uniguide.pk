import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

// ─── Platform Stats ────────────────────────────────────────────────────────────
export const getPlatformAnalytics = async () => {
  const usersCount = (await db.collection("users").count().get()).data().count;
  const unisCount = (await db.collection("universities").count().get()).data().count;
  const appsCount = (await db.collection("admissions").count().get()).data().count;

  return {
    totalUsers: usersCount,
    totalUniversities: unisCount,
    totalApplications: appsCount,
    totalRevenue: 2500000,
    admin: {
      name: "Syed Iftikhar Shah",
      email: "ifitkharbusiness100@gmail.com",
      role: "super_admin",
    },
    revenueByMonth: [
      { name: "Jan", revenue: 150000 }, { name: "Feb", revenue: 200000 },
      { name: "Mar", revenue: 250000 }, { name: "Apr", revenue: 400000 },
      { name: "May", revenue: 600000 }, { name: "Jun", revenue: 900000 },
    ],
    userGrowth: [
      { name: "Jan", students: 5000, universities: 30 }, { name: "Feb", students: 7000, universities: 32 },
      { name: "Mar", students: 9000, universities: 35 }, { name: "Apr", students: 11000, universities: 40 },
      { name: "May", students: 13500, universities: 42 }, { name: "Jun", students: usersCount, universities: unisCount },
    ],
  };
};

// ─── Documents ─────────────────────────────────────────────────────────────────
export const getPendingDocuments = async () => {
  const snapshot = await db.collection("documents").where("status", "==", "pending").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllDocuments = async () => {
  const snapshot = await db.collection("documents").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const verifyDocument = async (documentId, status, reason = "") => {
  const docRef = db.collection("documents").doc(documentId);
  const updateData = {
    status,
    verifiedBy: "Syed Iftikhar Shah",
    verifiedAt: FieldValue.serverTimestamp()
  };
  if (status === "rejected") updateData.rejectionReason = reason;
  await docRef.update(updateData);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = async (role = "all") => {
  let query = db.collection("users");
  if (role !== "all") query = query.where("role", "==", role);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserStatus = async (userId, status) => {
  const docRef = db.collection("users").doc(userId);
  await docRef.update({ status, updatedAt: FieldValue.serverTimestamp() });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

export const editUser = async (userId, data) => {
  const docRef = db.collection("users").doc(userId);
  await docRef.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const getAllApplications = async (status = "all") => {
  let query = db.collection("admissions");
  if (status !== "all" && status) query = query.where("status", "==", status);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateApplicationStatus = async (appId, status, adminName, note = "") => {
  const docRef = db.collection("admissions").doc(appId);
  const updateData = {
    status,
    processedBy: adminName,
    processedAt: FieldValue.serverTimestamp()
  };
  if (status === "approved") updateData.approvedBy = adminName;
  if (status === "rejected") updateData.rejectionReason = note;
  await docRef.update(updateData);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

export const editApplication = async (appId, data) => {
  const docRef = db.collection("admissions").doc(appId);
  await docRef.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── Universities ─────────────────────────────────────────────────────────────
export const createUniversity = async (data) => {
  const newUni = {
    ...data,
    status: "approved",
    admissionStatus: data.admissionStatus || "open",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  const docRef = await db.collection("universities").add(newUni);
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const getUniversities = async (status = "all") => {
  let query = db.collection("universities").orderBy("name");
  if (status !== "all" && status) query = db.collection("universities").where("status", "==", status);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUniversityStatus = async (uniId, status, adminName) => {
  const docRef = db.collection("universities").doc(uniId);
  await docRef.update({
    status,
    approvedBy: adminName,
    approvedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── NEW: Update admission status (open/closed) ───────────────────────────────
export const updateAdmissionStatus = async (uniId, admissionStatus) => {
  const docRef = db.collection("universities").doc(uniId);
  await docRef.update({
    admissionStatus,
    updatedAt: FieldValue.serverTimestamp()
  });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── NEW: Delete university ───────────────────────────────────────────────────
export const deleteUniversity = async (uniId) => {
  await db.collection("universities").doc(uniId).delete();
};

export const editUniversity = async (uniId, data) => {
  // Never overwrite name with empty string — preserve original if not provided
  const safeData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== "")
  );
  const docRef = db.collection("universities").doc(uniId);
  await docRef.update({ ...safeData, updatedAt: FieldValue.serverTimestamp() });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// ─── Articles ─────────────────────────────────────────────────────────────────
export const getArticles = async ({ category, featured, search, limit: lim = 100, page = 1 } = {}) => {
  let query = db.collection("articles");

  if (category) query = query.where("category", "==", category);
  if (featured === "true" || featured === true) query = query.where("featured", "==", true);

  const snapshot = await query.orderBy("createdAt", "desc").limit(Number(lim)).get();
  let articles = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
  }));

  // Client-side search filter (Firestore doesn't support full-text search)
  if (search) {
    const s = search.toLowerCase();
    articles = articles.filter(a =>
      a.title?.toLowerCase().includes(s) ||
      a.category?.toLowerCase().includes(s) ||
      a.excerpt?.toLowerCase().includes(s) ||
      a.author?.toLowerCase().includes(s)
    );
  }

  return articles;
};

export const createArticle = async (data) => {
  const newArticle = {
    title: data.title || "",
    category: data.category || "General",
    excerpt: data.excerpt || "",
    content: data.content || "",
    author: data.author || "Admin",
    thumbnailUrl: data.thumbnailUrl || "",
    featured: data.featured || false,
    published: true,
    manualEntry: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const docRef = await db.collection("articles").add(newArticle);
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const updateArticle = async (articleId, data) => {
  const docRef = db.collection("articles").doc(articleId);
  await docRef.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const updated = await docRef.get();
  return {
    id: updated.id,
    ...updated.data(),
    createdAt: updated.data().createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: updated.data().updatedAt?.toDate?.()?.toISOString() || null,
  };
};

export const deleteArticle = async (articleId) => {
  await db.collection("articles").doc(articleId).delete();
};

// ─── Courses (Admin) ─────────────────────────────────────────────────────────
export const getAllCoursesAdmin = async () => {
  const snapshot = await db.collection("courses").orderBy("title").limit(200).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createCourseAdmin = async (data) => {
  const newCourse = {
    title: data.title || "",
    universityName: data.universityName || "",
    category: data.category || "General",
    degreeLevel: data.degreeLevel || "BS",
    duration: data.duration || "",
    feeStructure: data.feeStructure || "",
    eligibilityCriteria: data.eligibilityCriteria || "",
    courseUrl: data.courseUrl || "",
    manualEntry: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const docRef = await db.collection("courses").add(newCourse);
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const deleteCourseAdmin = async (courseId) => {
  await db.collection("courses").doc(courseId).delete();
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const getSystemSettings = async () => {
  const docRef = db.collection("settings").doc("global");
  const doc = await docRef.get();
  if (!doc.exists) {
    return {
      platformFeePercentage: 5,
      globalAnnouncement: "Welcome to UniGuid.pk!",
      maintenanceMode: false,
    };
  }
  return doc.data();
};

export const updateSystemSettings = async (newSettings) => {
  const docRef = db.collection("settings").doc("global");
  await docRef.set(newSettings, { merge: true });
  const doc = await docRef.get();
  return doc.data();
};
