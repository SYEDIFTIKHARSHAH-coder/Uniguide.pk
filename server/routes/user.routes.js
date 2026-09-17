import express from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("student", "admin", "super_admin")); // Anyone logged in can bookmark

router.get("/bookmarks", userController.getBookmarks);
router.post("/bookmarks", userController.addBookmark);
router.delete("/bookmarks/:id", userController.removeBookmark);

export default router;
