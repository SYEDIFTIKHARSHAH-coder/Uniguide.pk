import * as entryTestService from "../services/entryTest.service.js";
import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

// ─── Public ───────────────────────────────────────────────────────────────────
export const getEntryTests = async (req, res) => {
  try {
    const tests = await entryTestService.getAllEntryTests();
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getEntryTestDetail = async (req, res) => {
  try {
    const testId = req.params.id;
    const testDetail = await entryTestService.getEntryTestDetail(testId);
    if (!testDetail) {
      return res.status(404).json({ success: false, message: "Entry test not found" });
    }
    res.status(200).json({ success: true, data: testDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getCalendar = async (req, res) => {
  try {
    const calendarEvents = await entryTestService.getTestCalendar();
    res.status(200).json({ success: true, data: calendarEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Admin CRUD ───────────────────────────────────────────────────────────────
export const getEntryTestsForAdmin = async (req, res) => {
  try {
    const snapshot = await db.collection("entryTests").get();
    const tests = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        createdAt: d.createdAt?.toDate?.()?.toISOString?.() || null,
      };
    });
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Error fetching entry tests for admin:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const createEntryTestAdmin = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.organizingBody || !body.description) {
      return res.status(400).json({ success: false, message: "name, organizingBody, and description are required." });
    }
    const newDoc = await db.collection("entryTests").add({
      name: body.name,
      organizingBody: body.organizingBody,
      description: body.description,
      registrationLink: body.registrationLink || null,
      registrationDeadline: body.registrationDeadline || null,
      testDate: body.testDate || null,
      eligibilityCriteria: body.eligibilityCriteria || [],
      syllabusFileUrl: body.syllabusFileUrl || null,
      preparationMaterials: [],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(201).json({ success: true, data: { id: newDoc.id } });
  } catch (error) {
    console.error("Error creating entry test:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateEntryTestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateData = {};
    const allowed = ["name", "organizingBody", "description", "registrationLink", "registrationDeadline", "testDate", "eligibilityCriteria", "syllabusFileUrl", "isActive"];
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }
    await db.collection("entryTests").doc(id).update(updateData);
    res.status(200).json({ success: true, message: "Entry test updated successfully" });
  } catch (error) {
    console.error("Error updating entry test:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteEntryTestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("entryTests").doc(id).delete();
    res.status(200).json({ success: true, message: "Entry test deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry test:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
