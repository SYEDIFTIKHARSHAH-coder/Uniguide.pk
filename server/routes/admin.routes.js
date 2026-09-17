import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as scholarshipController from "../controllers/scholarship.controller.js";
import * as entryTestAdminController from "../controllers/entryTest.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// ALL admin routes are strictly protected
router.use(verifyToken, requireRole("admin", "super_admin"));

// Dashboard Analytics
router.get("/dashboard", adminController.getDashboardAnalytics);

// User Management
router.get("/users", adminController.getUsers);
router.put("/users/:userId/status", adminController.updateUserStatus);
router.put("/users/:userId", adminController.editUser);

// Document Verification
router.get("/documents/pending", adminController.getPendingDocuments);
router.get("/documents", adminController.getAllDocuments);
router.put("/documents/:documentId/verify", adminController.verifyDocument);

// Application Approval
router.get("/applications", adminController.getApplicationsForAdmin);
router.put("/applications/:appId/approve", adminController.approveApplication);
router.put("/applications/:appId/reject", adminController.rejectApplication);
router.put("/applications/:appId", adminController.editApplication);

// University Management
router.post("/universities", adminController.createUniversity);
router.get("/universities", adminController.getUniversitiesForAdmin);
router.put("/universities/:uniId/approve", adminController.approveUniversity);
router.put("/universities/:uniId/status", adminController.updateUniversityStatusAdmin);
router.put("/universities/:uniId/admission-status", adminController.updateAdmissionStatusAdmin);
router.delete("/universities/:uniId", adminController.deleteUniversity);
router.put("/universities/:uniId", adminController.editUniversity);

// Articles Management
router.get("/articles", adminController.getArticles);
router.post("/articles", adminController.createArticle);
router.put("/articles/:articleId", adminController.updateArticle);
router.delete("/articles/:articleId", adminController.deleteArticle);

// Courses Management (admin)
router.get("/courses", adminController.getCoursesForAdmin);
router.post("/courses", adminController.createCourseAdmin);
router.delete("/courses/:courseId", adminController.deleteCourseAdmin);

// System Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

// Scholarships Management (admin)
router.get("/scholarships", scholarshipController.getScholarships);
router.post("/scholarships", scholarshipController.createScholarshipAdmin);
router.put("/scholarships/:id", scholarshipController.updateScholarshipAdmin);
router.delete("/scholarships/:id", scholarshipController.deleteScholarshipAdmin);

// Entry Tests Management (admin)
router.get("/entry-tests", entryTestAdminController.getEntryTestsForAdmin);
router.post("/entry-tests", entryTestAdminController.createEntryTestAdmin);
router.put("/entry-tests/:id", entryTestAdminController.updateEntryTestAdmin);
router.delete("/entry-tests/:id", entryTestAdminController.deleteEntryTestAdmin);

export default router;
