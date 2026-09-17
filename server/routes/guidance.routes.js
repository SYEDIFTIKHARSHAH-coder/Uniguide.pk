import express from "express";
import * as guidanceController from "../controllers/guidance.controller.js";

const router = express.Router();

// Public routes for fetching guidance content
// No auth middleware required because articles are public

// Get the latest articles across all categories (for the hub landing page)
router.get("/latest", guidanceController.getLatestGuides);

// Get articles filtered by a specific category (e.g. /api/guidance/category/career)
router.get("/category/:category", guidanceController.getGuidesByCategory);

// Get a specific article by ID
router.get("/article/:id", guidanceController.getGuideDetail);

export default router;
