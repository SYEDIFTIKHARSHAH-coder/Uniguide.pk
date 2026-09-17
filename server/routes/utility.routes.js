import express from "express";
import * as utilityController from "../controllers/utility.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/reviews", utilityController.getTargetReviews); // Fetch reviews (public)
router.post("/ai-tiger/chat", utilityController.chatWithTiger);
// Health check: tests Groq connectivity — useful for diagnosing chatbot errors
router.get("/ai-tiger/health", utilityController.aiTigerHealth);

// --- ADMIN ROUTES ---
router.post("/ai-tiger/scan", verifyToken, requireRole("admin", "super_admin"), utilityController.triggerAiScan);

// --- PROTECTED ROUTES (Student specific features) ---
router.use(verifyToken, requireRole("student"));

// Reviews
router.post("/reviews", utilityController.postReview);

// Favorites
router.get("/favorites", utilityController.getMyFavorites);
router.post("/favorites/toggle", utilityController.toggleFavorite);
router.get("/favorites/:targetId/check", utilityController.checkFavoriteStatus);

export default router;

