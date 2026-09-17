import express from "express";
import * as appController from "../controllers/application.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all student application routes
router.use(verifyToken, requireRole("student"));

// Fetch list of applications for the logged-in student
router.get("/", appController.getMyApplications);

// Fetch detailed view of a specific application
router.get("/:id", appController.getApplicationDetail);

// Withdraw an application
router.post("/:id/withdraw", appController.withdrawApplication);

export default router;
