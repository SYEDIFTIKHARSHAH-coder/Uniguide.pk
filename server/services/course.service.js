import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

export const getAllCourses = async (category) => {
  let query = db.collection("courses");
  if (category && category !== "all") {
    query = query.where("category", "==", category);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      totalModules: data.modules ? data.modules.length : 0
    };
  });
};

export const getCourseDetail = async (courseId) => {
  const doc = await db.collection("courses").doc(courseId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const enrollStudent = async (studentId, courseId) => {
  const enrollmentRef = db.collection("enrollments").doc(`${studentId}_${courseId}`);
  const doc = await enrollmentRef.get();
  
  if (doc.exists) {
    return { success: false, message: "Already enrolled in this course" };
  }

  const enrollmentData = {
    studentId,
    courseId,
    enrolledAt: FieldValue.serverTimestamp(),
    progress: 0,
    completedLessons: []
  };

  await enrollmentRef.set(enrollmentData);
  return { success: true, data: { id: enrollmentRef.id, ...enrollmentData } };
};

export const getStudentEnrollments = async (studentId) => {
  const snapshot = await db.collection("enrollments")
    .where("studentId", "==", studentId)
    .get();

  const enrollments = [];
  for (const doc of snapshot.docs) {
    const e = doc.data();
    const courseDoc = await db.collection("courses").doc(e.courseId).get();
    const course = courseDoc.exists ? courseDoc.data() : null;
    
    enrollments.push({
      id: doc.id,
      ...e,
      courseTitle: course?.title || course?.name || "Unknown Course",
      courseCategory: course?.category || "",
      courseThumbnail: course?.thumbnailUrl || "",
      courseInstructor: course?.instructor || course?.provider || ""
    });
  }
  return enrollments;
};
