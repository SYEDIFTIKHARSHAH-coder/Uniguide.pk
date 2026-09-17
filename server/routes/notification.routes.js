import express from "express";
import * as notifController from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(verifyToken);

// Get all notifications for the logged-in user
router.get("/", notifController.getNotifications);

// Get unread notification count (for the bell badge)
router.get("/unread-count", notifController.getUnreadCount);

// Mark notifications as read
router.post("/mark-read", notifController.markAsRead);

export default router;
