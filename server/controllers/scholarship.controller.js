import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";
import { scholarshipSchema } from "../validators/scholarship.validator.js";

const db = admin.firestore();

// PUBLIC
export const getScholarships = async (req, res) => {
  try {
    const snapshot = await db.collection("scholarships").get();
    const scholarships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("scholarships").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    
    res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching scholarship detail:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ADMIN
export const createScholarshipAdmin = async (req, res) => {
  try {
    const validatedData = scholarshipSchema.parse(req.body);
    const newDoc = await db.collection("scholarships").add({
      ...validatedData,
      createdAt: FieldValue.serverTimestamp()
    });
    res.status(201).json({ success: true, data: { id: newDoc.id, ...validatedData } });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    console.error("Error creating scholarship:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateScholarshipAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = scholarshipSchema.parse(req.body);
    await db.collection("scholarships").doc(id).update(validatedData);
    res.status(200).json({ success: true, message: "Scholarship updated successfully" });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    console.error("Error updating scholarship:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteScholarshipAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("scholarships").doc(id).delete();
    res.status(200).json({ success: true, message: "Scholarship deleted successfully" });
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
