import express from "express";
import * as entryTestController from "../controllers/entryTest.controller.js";

const router = express.Router();

// Public routes for fetching entry test information
// No auth middleware required because this is public discovery data

router.get("/calendar", entryTestController.getCalendar);
router.get("/", entryTestController.getEntryTests);
router.get("/:id", entryTestController.getEntryTestDetail);

export default router;
