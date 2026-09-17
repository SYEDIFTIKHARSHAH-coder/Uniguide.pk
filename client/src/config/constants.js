// ============================================================
// FILE: frontend/src/config/constants.js
// PURPOSE: Stores all constant values used throughout the app.
//   Using constants avoids "magic strings" in your code —
//   if a value needs to change, you only change it here.
// ============================================================

// -----------------------------------------------------------
// Application Information
// -----------------------------------------------------------
export const APP_NAME = "UniGuide.pk";
export const APP_TAGLINE = "Your Gateway to University Admissions in Pakistan";
export const APP_VERSION = "1.0.0";
export const SUPPORT_EMAIL = "support@uniguid.pk";

// -----------------------------------------------------------
// Single Admin Configuration
// -----------------------------------------------------------
export const SINGLE_ADMIN_EMAIL = "ssyediftikharshah49@gmail.com";

// -----------------------------------------------------------
// User Roles (must match what is stored in Firestore)
// -----------------------------------------------------------
export const USER_ROLES = {
  STUDENT: "student",
  UNIVERSITY: "university",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// -----------------------------------------------------------
// Application Status Values
// (Used in the Applications Firestore collection)
// -----------------------------------------------------------
export const APPLICATION_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WAITLISTED: "waitlisted",
};

// -----------------------------------------------------------
// Document Verification Status
// (Used when Admin or University verifies student documents)
// -----------------------------------------------------------
export const DOCUMENT_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

// -----------------------------------------------------------
// Admission Status Values
// -----------------------------------------------------------
export const ADMISSION_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  UPCOMING: "upcoming",
};

// -----------------------------------------------------------
// Payment Status Values
// -----------------------------------------------------------
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

// -----------------------------------------------------------
// University Type / Category Filters
// (Used in FR-016 — Filter Universities)
// -----------------------------------------------------------
export const UNIVERSITY_CATEGORIES = [
  "Public",
  "Private",
  "Medical",
  "Engineering",
  "Business",
  "Computer Science",
  "Arts & Humanities",
  "Agriculture",
  "Law",
];

// -----------------------------------------------------------
// Pakistani Provinces (used in search/filter)
// -----------------------------------------------------------
export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

// -----------------------------------------------------------
// Entry Test Types
// (Used in FR-080 to FR-086 — Entry Test Module)
// -----------------------------------------------------------
export const ENTRY_TESTS = [
  { id: "mdcat", name: "MDCAT", description: "Medical and Dental Colleges Admission Test" },
  { id: "ecat", name: "ECAT", description: "Engineering College Admission Test" },
  { id: "nts", name: "NTS", description: "National Testing Service" },
  { id: "nums", name: "NUMS", description: "National University of Medical Sciences Test" },
  { id: "lat", name: "LAT", description: "Law Admission Test" },
  { id: "gat", name: "GAT", description: "Graduate Assessment Test" },
];

// -----------------------------------------------------------
// Language Proficiency Levels
// (Used in FR-060 — Language Proficiency)
// -----------------------------------------------------------
export const LANGUAGE_PROFICIENCY = ["Basic", "Intermediate", "Fluent", "Native"];

// -----------------------------------------------------------
// File Upload Rules
// (Used in FR-013, FR-064, FR-065, FR-066)
// -----------------------------------------------------------
export const FILE_UPLOAD = {
  ALLOWED_TYPES: ["application/pdf", "image/jpeg", "image/png"],
  ALLOWED_EXTENSIONS: [".pdf", ".jpg", ".jpeg", ".png"],
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB in bytes
};

// -----------------------------------------------------------
// Notification Types
// -----------------------------------------------------------
export const NOTIFICATION_TYPES = {
  ADMISSION: "admission",
  SCHOLARSHIP: "scholarship",
  APPLICATION: "application",
  GENERAL: "general",
  DEADLINE: "deadline",
};

// -----------------------------------------------------------
// Route Paths — single source of truth for all page URLs
// -----------------------------------------------------------
export const ROUTES = {
  // Public / Guest routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  UNIVERSITIES: "/universities",
  UNIVERSITY_DETAILS: "/universities/:id",
  SCHOLARSHIPS: "/scholarships",
  SCHOLARSHIP_DETAILS: "/scholarships/:id",
  ADMISSIONS: "/admissions",
  ADMISSION_DETAILS: "/admissions/:id",
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_CONDITIONS: "/terms-conditions",
  ENTRY_TESTS: "/entry-tests",
  GUIDANCE: "/guidance",
  COURSES: "/courses",
  MERIT_CALCULATOR: "/merit-calculator",

  // Student portal routes
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_PROFILE: "/student/profile",
  STUDENT_APPLICATIONS: "/student/applications",
  STUDENT_NOTIFICATIONS: "/student/notifications",
  STUDENT_SAVED: "/student/saved",
  STUDENT_SETTINGS: "/student/settings",

  // University portal routes
  UNIVERSITY_DASHBOARD: "/university/dashboard",
  UNIVERSITY_PROGRAMS: "/university/programs",
  UNIVERSITY_SCHOLARSHIPS: "/university/scholarships",
  UNIVERSITY_ADMISSIONS: "/university/admissions",
  UNIVERSITY_APPLICATIONS: "/university/applications",
  UNIVERSITY_PROFILE: "/university/profile",

  // Admin portal routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_UNIVERSITIES: "/admin/universities",
  ADMIN_APPLICATIONS: "/admin/applications",
  ADMIN_SCHOLARSHIPS: "/admin/scholarships",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",

  // Error pages
  NOT_FOUND: "*",
};
