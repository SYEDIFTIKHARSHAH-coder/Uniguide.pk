import express from "express";
import * as uniController from "../controllers/university.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
// Accessible to anyone (students, guests)
router.get("/published", uniController.getPublishedUniversities);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
// Apply auth middleware to all university routes below this line
// Only users with role "admin" or "super_admin" can access these
router.use(verifyToken, requireRole("admin", "super_admin"));

// Dashboard Analytics
router.get("/dashboard", uniController.getDashboard);

// Programs
router.post("/programs", uniController.createProgram);
router.get("/programs", uniController.getPrograms);

// Admissions
router.post("/admissions", uniController.createAdmissionCycle);

// Applications
router.get("/applications", uniController.getApplications);

// Admin University Actions
router.put("/:id/status", uniController.updateUniversityStatus);
router.put("/:id/admission-status", uniController.updateAdmissionStatus);

export default router;
