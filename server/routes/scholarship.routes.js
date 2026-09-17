import express from "express";
import * as scholarshipController from "../controllers/scholarship.controller.js";

const router = express.Router();

router.get("/", scholarshipController.getScholarships);
router.get("/:id", scholarshipController.getScholarshipById);

export default router;
