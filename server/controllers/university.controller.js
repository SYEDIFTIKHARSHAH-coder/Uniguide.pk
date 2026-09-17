import * as uniService from "../services/university.service.js";
import { programSchema, admissionCycleSchema } from "../validators/university.validator.js";
import admin from "../firebase/admin.js";

export const getDashboard = async (req, res) => {
  try {
    const uniId = req.user.uid;
    const analytics = await uniService.getDashboardAnalytics(uniId);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const uniId = req.user.uid;
    // Validate request body
    const validatedData = programSchema.parse(req.body);
    const newProgram = await uniService.addProgram(uniId, validatedData);
    res.status(201).json({ success: true, data: newProgram });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const uniId = req.user.uid;
    const programs = await uniService.getPrograms(uniId);
    res.status(200).json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createAdmissionCycle = async (req, res) => {
  try {
    const uniId = req.user.uid;
    const validatedData = admissionCycleSchema.parse(req.body);
    const cycle = await uniService.openAdmissionCycle(uniId, validatedData);
    res.status(201).json({ success: true, data: cycle });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const uniId = req.user.uid;
    const apps = await uniService.getApplications(uniId);
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPublishedUniversities = async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection("universities").where("status", "==", "approved").get();
    const universities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    console.error("Error fetching published universities:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUniversityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    
    const db = admin.firestore();
    await db.collection("universities").doc(id).update({ status });
    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating university status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionStatus } = req.body; // 'open' or 'closed'
    
    if (!["open", "closed"].includes(admissionStatus)) {
      return res.status(400).json({ success: false, message: "Invalid admissionStatus" });
    }
    
    const db = admin.firestore();
    await db.collection("universities").doc(id).update({ admissionStatus });
    res.status(200).json({ success: true, message: "Admission status updated successfully" });
  } catch (error) {
    console.error("Error updating admission status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
