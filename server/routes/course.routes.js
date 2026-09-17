import express from "express";
import * as courseController from "../controllers/course.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes – no authentication required
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseDetail);

// Protected student routes – requires login
router.post("/:id/enroll", verifyToken, requireRole("student"), courseController.enrollInCourse);
router.get("/student/my-courses", verifyToken, requireRole("student"), courseController.getMyEnrollments);

export default router;
