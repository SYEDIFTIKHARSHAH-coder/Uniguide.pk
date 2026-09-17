import express from "express";
import * as aiController from "../controllers/aiAdmission.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: get only approved discoveries (what students see)
router.get("/published", async (req, res) => {
  const { getAllDiscoveries } = await import("../services/aiAdmission.service.js");
  const data = await getAllDiscoveries("approved");
  res.json({ success: true, data });
});

// Admin-only routes
router.use(verifyToken, requireRole("admin", "super_admin"));

router.get("/dashboard", aiController.getDashboardStats);
router.get("/cooldown-status", aiController.getCooldownStatus); // persistent UI polling
router.get("/discoveries", aiController.getDiscoveries);
router.get("/discoveries/:id", aiController.getDiscoveryDetail);
router.put("/discoveries/:id/approve", aiController.approveDiscovery);
router.put("/discoveries/:id/reject", aiController.rejectDiscovery);
router.put("/discoveries/:id/edit", aiController.editDiscovery);
router.get("/activity-log", aiController.getActivityLog);
router.post("/trigger-crawl", aiController.triggerCrawl);

export default router;

