// ============================================================
// middleware/auth.middleware.js
//
// SINGLE-TENANT / SINGLE-ADMIN SYSTEM:
//   - ssyediftikharshah49@gmail.com → super_admin (Google Sign-In only)
//   - Separate admin login endpoint → admin role via JWT
//   - All other users → student (via registration)
//
// JWT is stored in HttpOnly, Secure, SameSite=Strict cookie.
// NEVER stored in localStorage or sessionStorage.
// ============================================================

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "uniguid_session";

// ─── Issue a signed JWT and set it as HttpOnly cookie ────────────────────────
export function issueSessionCookie(res, payload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in environment variables");

  const token = jwt.sign(
    {
      uid: payload.uid,
      email: payload.email,
      role: payload.role,
      name: payload.name || "",
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: "7d", algorithm: "HS256" }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,                          // JS cannot read this cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",                      // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in ms
    path: "/",
  });

  return token;
}

// ─── Clear the session cookie (logout) ───────────────────────────────────────
export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// ─── Verify JWT from HttpOnly cookie ─────────────────────────────────────────
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session cookie",
    });
  }

  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    // Reject if required fields are missing (tampered payload)
    if (!decoded.uid || !decoded.email || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token structure",
      });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid or tampered token" });
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ─── Role-based access control guard ─────────────────────────────────────────
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    res.status(403).json({
      success: false,
      message: `Forbidden: Requires one of [${roles.join(", ")}] role`,
    });
  };
};

// ─── Input sanitizer (XSS protection) ────────────────────────────────────────
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") return obj.replace(/<[^>]*>?/gm, "");
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === "object") {
      const out = {};
      for (const [k, v] of Object.entries(obj)) out[k] = sanitize(v);
      return out;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) for (const k in req.query) req.query[k] = sanitize(req.query[k]);
  if (req.params) for (const k in req.params) req.params[k] = sanitize(req.params[k]);
  next();
};
