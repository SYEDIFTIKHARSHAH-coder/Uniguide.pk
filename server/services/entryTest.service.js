// entryTest.service.js
// ──────────────────────────────────────────────────────────────────────────────
// PURPOSE: Fetch entry test data for the public EntryTestDashboard page.
// FIX:     Previous implementation used hardcoded mock data and never touched
//          Firestore. Now connects to the 'entryTests' collection and auto-seeds
//          canonical Pakistani entry tests on first run if the collection is empty.
// ──────────────────────────────────────────────────────────────────────────────

import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

// ─── Canonical entry test seed data ────────────────────────────────────────────
// These are inserted into Firestore on first run. After seeding, all reads and
// updates come from the DB — edits via admin panel will persist correctly.
const SEED_TESTS = [
  {
    name: "MDCAT (Medical & Dental College Admission Test)",
    organizingBody: "PMDC (Pakistan Medical & Dental Council)",
    description: "Standardized test for admissions to medical and dental colleges in Pakistan.",
    registrationLink: "https://pmdc.pk/mdcat",
    registrationDeadline: "2027-08-15T23:59:59Z",
    testDate: "2027-09-10T09:00:00Z",
    eligibilityCriteria: [
      "FSc Pre-Medical or equivalent with minimum 65% marks.",
      "Must have CNIC or B-Form."
    ],
    syllabusFileUrl: "",
    preparationMaterials: [],
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    name: "ECAT (Engineering College Admission Test)",
    organizingBody: "UET Lahore",
    description: "Prerequisite for admission in Engineering and Technology programs.",
    registrationLink: "https://admission.uet.edu.pk",
    registrationDeadline: "2027-06-01T23:59:59Z",
    testDate: "2027-07-15T10:00:00Z",
    eligibilityCriteria: [
      "FSc Pre-Engineering or ICS with minimum 60% marks."
    ],
    syllabusFileUrl: "",
    preparationMaterials: [],
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    name: "NTS (National Testing Service) NAT",
    organizingBody: "National Testing Service Pakistan",
    description: "General aptitude test used by many public sector universities for graduate and postgraduate admissions.",
    registrationLink: "https://www.nts.org.pk",
    registrationDeadline: null,
    testDate: null,
    eligibilityCriteria: [
      "Minimum Intermediate or equivalent qualification.",
      "Valid CNIC required for registration."
    ],
    syllabusFileUrl: "",
    preparationMaterials: [],
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    name: "GAT (Graduate Assessment Test)",
    organizingBody: "National Testing Service Pakistan",
    description: "Required for MS / M.Phil admissions at HEC-recognized universities.",
    registrationLink: "https://www.nts.org.pk/gat",
    registrationDeadline: null,
    testDate: null,
    eligibilityCriteria: [
      "16-year Bachelor's degree (BS / BCS / BBA etc.) with minimum 50% marks."
    ],
    syllabusFileUrl: "",
    preparationMaterials: [],
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    name: "LAT (Law Admission Test)",
    organizingBody: "Higher Education Commission (HEC)",
    description: "Mandatory for admission to LLB 5-year programs at Pakistani universities.",
    registrationLink: "https://www.hec.gov.pk/lat",
    registrationDeadline: null,
    testDate: null,
    eligibilityCriteria: [
      "Minimum FSc / A-Levels or equivalent with at least 45% marks."
    ],
    syllabusFileUrl: "",
    preparationMaterials: [],
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  },
];

// ─── Auto-seed helper — runs once if collection is empty ───────────────────────
async function seedIfEmpty() {
  try {
    const snapshot = await db.collection("entryTests").limit(1).get();
    if (snapshot.empty) {
      console.log("[EntryTests] Collection is empty — seeding canonical entry tests...");
      const batch = db.batch();
      for (const test of SEED_TESTS) {
        const ref = db.collection("entryTests").doc();
        batch.set(ref, test);
      }
      await batch.commit();
      console.log(`[EntryTests] Seeded ${SEED_TESTS.length} entry tests successfully.`);
    }
  } catch (err) {
    console.error("[EntryTests] seedIfEmpty error:", err.message);
  }
}

// Map a Firestore document to the API shape
function mapTest(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    name: d.name || "",
    organizingBody: d.organizingBody || "",
    description: d.description || "",
    registrationLink: d.registrationLink || null,
    registrationDeadline: d.registrationDeadline || null,
    testDate: d.testDate || null,
    eligibilityCriteria: d.eligibilityCriteria || [],
    syllabusFileUrl: d.syllabusFileUrl || null,
    preparationMaterials: d.preparationMaterials || [],
    isActive: d.isActive !== false, // default true
    createdAt: d.createdAt?.toDate?.()?.toISOString?.() || null,
  };
}

// ─── Public: Get all active entry tests (summary, no prep materials) ───────────
export const getAllEntryTests = async () => {
  try {
    await seedIfEmpty();

    const snapshot = await db
      .collection("entryTests")
      .where("isActive", "==", true)
      .get();

    const tests = snapshot.docs.map((doc) => {
      const { preparationMaterials, syllabusFileUrl, ...summary } = mapTest(doc);
      return summary;
    });

    // Sort in memory to avoid requiring a composite index in Firestore
    tests.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log(`[EntryTests] getAllEntryTests: returned ${tests.length} tests`);
    return tests;
  } catch (err) {
    console.error("[EntryTests] getAllEntryTests error:", err.message);
    return [];
  }
};

// ─── Public: Get full entry test detail including prep materials ────────────────
export const getEntryTestDetail = async (testId) => {
  try {
    const doc = await db.collection("entryTests").doc(testId).get();
    if (!doc.exists) return null;
    return mapTest(doc);
  } catch (err) {
    console.error(`[EntryTests] getEntryTestDetail(${testId}) error:`, err.message);
    return null;
  }
};

// ─── Public: Get test calendar (date/deadline only) ────────────────────────────
export const getTestCalendar = async () => {
  try {
    await seedIfEmpty();

    const snapshot = await db
      .collection("entryTests")
      .where("isActive", "==", true)
      .get();

    return snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || "",
        testDate: d.testDate || null,
        registrationDeadline: d.registrationDeadline || null,
      };
    });
  } catch (err) {
    console.error("[EntryTests] getTestCalendar error:", err.message);
    return [];
  }
};
