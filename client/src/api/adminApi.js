import axios from "axios";

const adminApi = axios.create({ baseURL: "/api/admin", withCredentials: true });
const aiApi = axios.create({ baseURL: "/api/ai-admissions", withCredentials: true });
const utilityAdminApi = axios.create({ baseURL: "/api/utilities", withCredentials: true });

// ─── Admin ────────────────────────────────────────────────────────────────────
export const fetchDashboardAnalytics = () => adminApi.get("/dashboard").then(r => r.data.data);
export const fetchPendingDocuments = () => adminApi.get("/documents/pending").then(r => r.data.data);
export const fetchAllDocuments = () => adminApi.get("/documents").then(r => r.data.data);
export const verifyDocument = (payload) =>
  adminApi.put(`/documents/${payload.documentId}/verify`, { status: payload.status, reason: payload.reason }).then(r => r.data);
export const fetchUsers = (role = "all") => adminApi.get(`/users?role=${role}`).then(r => r.data.data);
export const updateUserStatus = (payload) =>
  adminApi.put(`/users/${payload.userId}/status`, { status: payload.status }).then(r => r.data);
export const editUser = (payload) =>
  adminApi.put(`/users/${payload.userId}`, payload.data).then(r => r.data);
export const fetchSystemSettings = () => adminApi.get("/settings").then(r => r.data.data);
export const updateSystemSettings = (data) => adminApi.put("/settings", data).then(r => r.data);

export const fetchApplicationsForAdmin = (status = "all") =>
  adminApi.get(`/applications?status=${status}`).then(r => r.data.data);
export const approveApplication = (appId, note = "") =>
  adminApi.put(`/applications/${appId}/approve`, { note }).then(r => r.data);
export const rejectApplication = (appId, reason) =>
  adminApi.put(`/applications/${appId}/reject`, { reason }).then(r => r.data);
export const editApplication = (appId, data) =>
  adminApi.put(`/applications/${appId}`, data).then(r => r.data);

export const fetchUniversitiesForAdmin = (status = "all") =>
  adminApi.get(`/universities?status=${status}`).then(r => r.data.data);
export const createUniversity = (data) =>
  adminApi.post("/universities", data).then(r => r.data);
export const approveUniversity = (uniId) =>
  adminApi.put(`/universities/${uniId}/approve`).then(r => r.data);
export const updateUniversityStatus = (uniId, status) =>
  adminApi.put(`/universities/${uniId}/status`, { status }).then(r => r.data);
export const updateAdmissionStatus = (uniId, admissionStatus) =>
  adminApi.put(`/universities/${uniId}/admission-status`, { admissionStatus }).then(r => r.data);
export const editUniversity = (uniId, data) =>
  adminApi.put(`/universities/${uniId}`, data).then(r => r.data);

// ─── AI Admissions ─────────────────────────────────────────────────────────────
export const fetchAiDashboardStats = () => aiApi.get("/dashboard").then(r => r.data.data);
export const fetchAiDiscoveries = (status = "all") =>
  aiApi.get(`/discoveries?status=${status}`).then(r => r.data.data);
export const fetchAiDiscoveryDetail = (id) =>
  aiApi.get(`/discoveries/${id}`).then(r => r.data.data);
export const approveAiDiscovery = (id, adminNote = "") =>
  aiApi.put(`/discoveries/${id}/approve`, { adminNote }).then(r => r.data);
export const rejectAiDiscovery = (id, reason) =>
  aiApi.put(`/discoveries/${id}/reject`, { reason }).then(r => r.data);
export const editAiDiscovery = (id, data) =>
  aiApi.put(`/discoveries/${id}/edit`, data).then(r => r.data);
export const fetchActivityLog = () => aiApi.get("/activity-log").then(r => r.data.data);
export const triggerAiCrawl = () => aiApi.post("/trigger-crawl").then(r => r.data);
export const fetchCooldownStatus = () => aiApi.get("/cooldown-status").then(r => r.data.data);

// Public
export const fetchPublishedAdmissions = () =>
  axios.get("/api/universities/published").then(r => r.data.data);

// ─── Articles ─────────────────────────────────────────────────────────────────
export const fetchArticlesForAdmin = () => adminApi.get("/articles").then(r => r.data.data);
export const createArticle = (data) => adminApi.post("/articles", data).then(r => r.data);
export const updateArticle = (id, data) => adminApi.put(`/articles/${id}`, data).then(r => r.data);
export const deleteArticle = (id) => adminApi.delete(`/articles/${id}`).then(r => r.data);

// ─── IFTI AI Admin ───────────────────────────────────────────────────────────
export const triggerIftiAiScan = () => utilityAdminApi.post("/ai-tiger/scan").then(r => r.data);

// ─── Courses (Admin) ─────────────────────────────────────────────────────────
export const fetchCoursesForAdmin = () => adminApi.get("/courses").then(r => r.data.data);
export const createCourseAdmin = (data) => adminApi.post("/courses", data).then(r => r.data);
export const deleteCourseAdmin = (courseId) => adminApi.delete(`/courses/${courseId}`).then(r => r.data);

// ─── Scholarships (Admin) ─────────────────────────────────────────────────────
export const fetchScholarshipsForAdmin = () => adminApi.get("/scholarships").then(r => r.data.data);
export const createScholarshipAdmin = (data) => adminApi.post("/scholarships", data).then(r => r.data);
export const updateScholarshipAdmin = (id, data) => adminApi.put(`/scholarships/${id}`, data).then(r => r.data);
export const deleteScholarshipAdmin = (id) => adminApi.delete(`/scholarships/${id}`).then(r => r.data);

// ─── Entry Tests (Admin) ──────────────────────────────────────────────────────
export const fetchEntryTestsForAdmin = () => adminApi.get("/entry-tests").then(r => r.data.data);
export const createEntryTestAdmin = (data) => adminApi.post("/entry-tests", data).then(r => r.data);
export const updateEntryTestAdmin = (id, data) => adminApi.put(`/entry-tests/${id}`, data).then(r => r.data);
export const deleteEntryTestAdmin = (id) => adminApi.delete(`/entry-tests/${id}`).then(r => r.data);
