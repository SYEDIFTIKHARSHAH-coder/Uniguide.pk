import * as adminService from "../services/admin.service.js";
import { documentVerificationSchema, userStatusSchema, systemSettingsSchema, universityCreationSchema } from "../validators/admin.validator.js";

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getDashboardAnalytics = async (req, res) => {
  try {
    const stats = await adminService.getPlatformAnalytics();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Documents ────────────────────────────────────────────────────────────────
export const getPendingDocuments = async (req, res) => {
  try {
    const docs = await adminService.getPendingDocuments();
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await adminService.getAllDocuments();
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const validated = documentVerificationSchema.parse(req.body);
    const result = await adminService.verifyDocument(documentId, validated.status, validated.reason);
    res.json({ success: true, data: result, message: `Document ${validated.status} successfully` });
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const role = req.query.role || "all";
    const users = await adminService.getUsers(role);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const validated = userStatusSchema.parse(req.body);
    const result = await adminService.updateUserStatus(userId, validated.status);
    res.json({ success: true, data: result, message: `User status updated to ${validated.status}` });
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await adminService.editUser(userId, req.body);
    res.json({ success: true, data: result, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const getApplicationsForAdmin = async (req, res) => {
  try {
    const apps = await adminService.getAllApplications(req.query.status);
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await adminService.updateApplicationStatus(appId, "approved", adminName, req.body.note);
    res.json({ success: true, data: result, message: "Application approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: "Rejection reason required" });
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await adminService.updateApplicationStatus(appId, "rejected", adminName, reason);
    res.json({ success: true, data: result, message: "Application rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const result = await adminService.editApplication(appId, req.body);
    res.json({ success: true, data: result, message: "Application updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Universities ─────────────────────────────────────────────────────────────
export const createUniversity = async (req, res) => {
  try {
    const validated = universityCreationSchema.parse(req.body);
    const result = await adminService.createUniversity(validated);
    res.status(201).json({ success: true, data: result, message: "University created successfully" });
  } catch (err) {
    if (err.name === "ZodError") {
      const issues = err.errors.map(e => `${e.path.join(".")}: ${e.message}`);
      return res.status(400).json({ success: false, message: "Validation failed", errors: issues });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUniversitiesForAdmin = async (req, res) => {
  try {
    const unis = await adminService.getUniversities(req.query.status);
    res.json({ success: true, data: unis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveUniversity = async (req, res) => {
  try {
    const { uniId } = req.params;
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await adminService.updateUniversityStatus(uniId, "approved", adminName);
    res.json({ success: true, data: result, message: "University approved and published" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── NEW: Update university status (approve/reject/pending) ───────────────────
export const updateUniversityStatusAdmin = async (req, res) => {
  try {
    const { uniId } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status. Must be: approved, rejected, or pending" });
    }
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await adminService.updateUniversityStatus(uniId, status, adminName);
    res.json({ success: true, data: result, message: `University status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── NEW: Update admission status (open/closed) ───────────────────────────────
export const updateAdmissionStatusAdmin = async (req, res) => {
  try {
    const { uniId } = req.params;
    const { admissionStatus } = req.body;
    if (!["open", "closed"].includes(admissionStatus)) {
      return res.status(400).json({ success: false, message: "Invalid admissionStatus. Must be: open or closed" });
    }
    const result = await adminService.updateAdmissionStatus(uniId, admissionStatus);
    res.json({ success: true, data: result, message: `Admission status updated to ${admissionStatus}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── NEW: Delete university ───────────────────────────────────────────────────
export const deleteUniversity = async (req, res) => {
  try {
    const { uniId } = req.params;
    await adminService.deleteUniversity(uniId);
    res.json({ success: true, message: "University deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editUniversity = async (req, res) => {
  try {
    const { uniId } = req.params;
    const result = await adminService.editUniversity(uniId, req.body);
    res.json({ success: true, data: result, message: "University data updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Articles ─────────────────────────────────────────────────────────────────
export const getArticles = async (req, res) => {
  try {
    const { category, featured, search, limit: lim, page } = req.query;
    const articles = await adminService.getArticles({ category, featured, search, limit: lim, page });
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await adminService.createArticle({ ...req.body, author: req.body.author || adminName });
    res.status(201).json({ success: true, data: result, message: "Article published successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const result = await adminService.updateArticle(articleId, req.body);
    res.json({ success: true, data: result, message: "Article updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    await adminService.deleteArticle(articleId);
    res.json({ success: true, message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Courses (Admin) ─────────────────────────────────────────────────────────
export const getCoursesForAdmin = async (req, res) => {
  try {
    const courses = await adminService.getAllCoursesAdmin();
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCourseAdmin = async (req, res) => {
  try {
    const result = await adminService.createCourseAdmin(req.body);
    res.status(201).json({ success: true, data: result, message: "Course created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCourseAdmin = async (req, res) => {
  try {
    const { courseId } = req.params;
    await adminService.deleteCourseAdmin(courseId);
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    const settings = await adminService.getSystemSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const validated = systemSettingsSchema.parse(req.body);
    const result = await adminService.updateSystemSettings(validated);
    res.json({ success: true, data: result, message: "Settings updated successfully" });
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
    res.status(500).json({ success: false, message: err.message });
  }
};
