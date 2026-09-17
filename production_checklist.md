# 🚀 UniGuid.pk Production Readiness Checklist

Before officially launching UniGuid.pk to real users, go through this checklist to ensure everything is secure, optimized, and ready.

## 1. Security & Authentication
- [ ] **Firestore Rules Deployed:** Ensure `firestore.rules` is deployed so users cannot read/write each other's private data.
- [ ] **Disable Mock Data:** Remove or comment out the `MOCK_USERS` bypass in `server/middleware/auth.middleware.js` and uncomment the real Firebase Admin token verification.
- [ ] **Firebase Admin Service Account:** Make sure the real service account JSON is securely provided to the backend in production (never committed to GitHub).
- [ ] **CORS Configuration:** In `server/server.js`, ensure `allowedOrigins` strictly contains your actual frontend production domain (e.g., `https://uniguidpk.web.app`) and no `localhost` routes in production.
- [ ] **Environment Variables:** Double-check that all `.env.production` variables are correct and not leaked.

## 2. API & Backend
- [ ] **API Endpoint Prefixing:** Ensure the frontend `axios` instances point to your real Render backend URL (e.g., `https://uniguidpk-backend.onrender.com/api`).
- [ ] **Rate Limiting:** (Recommended) Implement `express-rate-limit` on the backend to prevent DDoS or spam on forms like "Contact Us" and "AI Crawl".
- [ ] **Error Handling:** Verify that production errors do not leak stack traces to the client.

## 3. Frontend Optimization
- [ ] **Production Build Check:** Run `npm run build` locally in the `client/` folder to ensure there are no build errors.
- [ ] **Performance (Lighthouse):** Run a Lighthouse audit in Chrome. Address any large bundle sizes (consider dynamic imports/lazy loading for large components like Admin pages).
- [ ] **SEO & Meta Tags:** Verify that `index.html` has proper title, description, and OpenGraph tags for sharing.

## 4. Workflows & Features
- [ ] **Admin Approval Flow:** Test the AI Admission "Approve/Reject/Edit" workflow end-to-end to ensure the dashboard updates correctly.
- [ ] **Contact Us Form:** Currently, it simulates sending a message. You must integrate a real mail service (like SendGrid, Nodemailer, or Resend) in the backend to actually email `ifitkharbusiness100@gmail.com`.
- [ ] **AI Crawler:** The current AI service uses mock data representing universities. For a true automated system, integrate an actual scraper (like Puppeteer) or an API (like Google Custom Search + Gemini) in `server/services/aiAdmission.service.js`.

## 5. Post-Launch Monitoring
- [ ] **Uptime Monitoring:** Set up a free service like UptimeRobot to ping `https://uniguidpk-backend.onrender.com/api/health` every 5 minutes (this also prevents Render free tiers from sleeping).
- [ ] **Analytics:** Integrate Google Analytics (GA4) in `index.html` to track user behavior.

---
**Prepared for Admin:** Syed Iftikhar Shah
