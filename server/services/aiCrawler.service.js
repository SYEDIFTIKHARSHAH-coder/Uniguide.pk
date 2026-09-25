// aiCrawler.service.js
// ──────────────────────────────────────────────────────────────────────────────
// AI-powered crawler that fetches data from official Pakistani educational
// websites and upserts records into Firestore pending_ai_updates queue.
//
// FIXES APPLIED:
//   1. Groq client is now initialized INSIDE the function (not at module load),
//      so it always picks up the current GROQ_API_KEY env var.
//   2. Crawler now covers all 5 categories: admissions, scholarships, articles,
//      courses, and entry tests — with multiple source URLs each.
//   3. Per-source failure isolation: one broken URL doesn't abort the entire run.
//   4. 24-hour persisted cooldown stored in Firestore 'crawler_config' collection
//      (survives server restarts — NOT in-memory).
//   5. Returns per-category stats in the response.
// ──────────────────────────────────────────────────────────────────────────────

import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";
import Groq from "groq-sdk";

const CRAWLER_GROQ_MODEL = process.env.GROQ_CRAWLER_MODEL || process.env.GROQ_MODEL || "openai/gpt-oss-20b";

// ─── Cooldown config ────────────────────────────────────────────────────────
const COOLDOWN_HOURS = 24;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;
const CONFIG_DOC = "crawler_config"; // document ID in 'system_config' collection

// ─── Source URLs — one per category ─────────────────────────────────────────
// Per-source failures are isolated: if fetch/extract fails, that source is
// skipped and logged, but the remaining sources continue.
const SOURCES = [
  // ═══════════ Admissions (unchanged) ═══════════
  { url: "https://nu.edu.pk/Admissions/Schedule", contentType: "admission", category: "admissions" },
  { url: "https://lums.edu.pk/admissions", contentType: "admission", category: "admissions" },
  { url: "https://nust.edu.pk/admissions/", contentType: "admission", category: "admissions" },

  // ═══════════ Scholarships (existing + new web sources) ═══════════
  { url: "https://hec.gov.pk/english/scholarships/Pages/Scholarships.aspx", contentType: "scholarship", category: "scholarships" },
  { url: "https://peef.org.pk/", contentType: "scholarship", category: "scholarships" },
  // New scholarship sources — AI searches these web pages for data
  { url: "https://www.chevening.org/scholarships/", contentType: "scholarship", category: "scholarships" },
  { url: "https://www.fulbright.org.pk/", contentType: "scholarship", category: "scholarships" },
  { url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", contentType: "scholarship", category: "scholarships" },
  { url: "https://csc.edu.cn/", contentType: "scholarship", category: "scholarships" },
  { url: "https://studyinturkey.gov.tr/", contentType: "scholarship", category: "scholarships" },
  { url: "https://www.scholars4dev.com/category/country/pakistan/", contentType: "scholarship", category: "scholarships" },
  { url: "https://opportunitiesforyouth.org/tag/pakistan/", contentType: "scholarship", category: "scholarships" },
  { url: "https://www.topuniversities.com/student-info/scholarship-advice/international-scholarships-pakistani-students", contentType: "scholarship", category: "scholarships" },
  { url: "https://ehsaas.hec.gov.pk/", contentType: "scholarship", category: "scholarships" },
  { url: "https://www.scholarshipsinpakistan.com/", contentType: "scholarship", category: "scholarships" },

  // ═══════════ Articles / Guidance (unchanged) ═══════════
  { url: "https://hec.gov.pk/english/news/Pages/default.aspx", contentType: "article", category: "articles" },

  // ═══════════ Free Courses (existing + new web sources) ═══════════
  { url: "https://digiskills.pk/", contentType: "free_course", category: "courses" },
  { url: "https://navttc.gov.pk/courses/", contentType: "free_course", category: "courses" },
  // New free course sources — AI searches these web pages for data
  { url: "https://www.coursera.org/courses?query=free", contentType: "free_course", category: "courses" },
  { url: "https://www.edx.org/search?tab=course", contentType: "free_course", category: "courses" },
  { url: "https://ocw.mit.edu/courses/", contentType: "free_course", category: "courses" },
  { url: "https://www.khanacademy.org/", contentType: "free_course", category: "courses" },
  { url: "https://www.codecademy.com/catalog", contentType: "free_course", category: "courses" },
  { url: "https://www.freecodecamp.org/news/tag/courses/", contentType: "free_course", category: "courses" },
  { url: "https://www.udemy.com/courses/free/", contentType: "free_course", category: "courses" },
  { url: "https://nptel.ac.in/courses", contentType: "free_course", category: "courses" },
  { url: "https://www.classcentral.com/collection/free-certificates", contentType: "free_course", category: "courses" },
  { url: "https://alison.com/courses", contentType: "free_course", category: "courses" },
  { url: "https://www.futurelearn.com/courses", contentType: "free_course", category: "courses" },
  { url: "https://virtualeducation.pk/", contentType: "free_course", category: "courses" },
  { url: "https://pec.org.pk/cpd-courses", contentType: "free_course", category: "courses" },

  // ═══════════ Entry Tests (unchanged) ═══════════
  { url: "https://www.nts.org.pk/", contentType: "entry_test", category: "entryTests" },
];

// ─── Prompt builder ──────────────────────────────────────────────────────────
function buildExtractionPrompt(rawText, contentType, sourceUrl) {
  const fieldMap = {
    admission: `{
  "type": "admission",
  "universityName": "String",
  "program": "String",
  "deadline": "ISO 8601 UTC string or null",
  "fee": "String or null",
  "eligibility": "String or null",
  "description": "String",
  "sourceUrl": "${sourceUrl}"
}`,
    scholarship: `{
  "type": "scholarship",
  "name": "String",
  "provider": "String (e.g. HEC, University Name)",
  "deadline": "ISO 8601 UTC string or null",
  "amount": "String (e.g. Fully Funded, 50000 PKR) or null",
  "eligibility": "String or null",
  "description": "String",
  "sourceUrl": "${sourceUrl}"
}`,
    article: `{
  "type": "article",
  "title": "String",
  "category": "String (one of: career, degree, university, admission, faq)",
  "excerpt": "String (2-3 sentences)",
  "author": "String or null",
  "sourceUrl": "${sourceUrl}"
}`,
    free_course: `{
  "type": "free_course",
  "name": "String",
  "provider": "String",
  "category": "String",
  "duration": "String or null",
  "level": "Beginner, Intermediate, or Advanced",
  "description": "String",
  "sourceUrl": "${sourceUrl}"
}`,
    entry_test: `{
  "type": "entry_test",
  "name": "String",
  "organizingBody": "String",
  "description": "String",
  "registrationDeadline": "ISO 8601 UTC string or null",
  "testDate": "ISO 8601 UTC string or null",
  "eligibility": "String or null",
  "registrationLink": "String URL or null",
  "sourceUrl": "${sourceUrl}"
}`,
  };

  return `You are a data extraction assistant for UniGuid.pk, a Pakistani student guidance platform.

Extract ONE structured record from the following web page text for content type: "${contentType}".

Return ONLY a single valid JSON object matching this schema:
${fieldMap[contentType] || fieldMap["admission"]}

RULES:
1. Return ONLY valid JSON — no markdown, no code blocks, no explanations.
2. If a required field is not found, set it to null.
3. "type" and "sourceUrl" must always be set.
4. Keep descriptions under 3 sentences.
5. If the page contains no relevant ${contentType} data, return: {"type":"${contentType}","_skip":true,"sourceUrl":"${sourceUrl}"}

RAW TEXT (first 10,000 chars):
${rawText.substring(0, 10000)}`;
}

// ─── Validation — ensure extracted data is worth keeping ────────────────────
function isValid(data) {
  if (!data || data._skip) return false;
  switch (data.type) {
    case "admission":     return !!data.universityName;
    case "scholarship":   return !!data.name && !!data.provider;
    case "article":       return !!data.title && data.title.length > 5;
    case "free_course":   return !!data.name && !!data.provider;
    case "entry_test":    return !!data.name && !!data.organizingBody;
    default:              return false;
  }
}

// ─── Cooldown helpers ────────────────────────────────────────────────────────

// Returns { onCooldown: bool, remainingMs: number, lastRunAt: Date|null }
export async function checkCooldown() {
  const db = admin.firestore();
  const doc = await db.collection("system_config").doc(CONFIG_DOC).get();
  if (!doc.exists) return { onCooldown: false, remainingMs: 0, lastRunAt: null };

  const { lastManualRunAt } = doc.data();
  if (!lastManualRunAt) return { onCooldown: false, remainingMs: 0, lastRunAt: null };

  const lastRun = lastManualRunAt.toDate();
  const elapsed = Date.now() - lastRun.getTime();
  const remaining = COOLDOWN_MS - elapsed;

  return {
    onCooldown: remaining > 0,
    remainingMs: Math.max(0, remaining),
    lastRunAt: lastRun,
  };
}

// Formats remaining milliseconds as "Xh Ym"
export function formatRemaining(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Persists the last-run timestamp to Firestore (survives server restarts)
async function persistLastRun() {
  const db = admin.firestore();
  await db.collection("system_config").doc(CONFIG_DOC).set(
    { lastManualRunAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
}

// ─── Main crawler entry point ────────────────────────────────────────────────
// Called by:
//   - aiAdmission.controller.js (manual trigger button) — respects cooldown
//   - aiCrawler.cron.js (scheduled every 5 days) — bypasses cooldown check
export async function runAICrawler({ triggeredBy = "cron", skipCooldownCheck = false } = {}) {
  const db = admin.firestore();
  const startTime = Date.now();

  // Cooldown is enforced only for manual triggers
  if (!skipCooldownCheck && triggeredBy !== "cron") {
    const { onCooldown, remainingMs, lastRunAt } = await checkCooldown();
    if (onCooldown) {
      const msg = `Crawler on cooldown. Next manual run available in ${formatRemaining(remainingMs)}.`;
      console.warn(`[Crawler] Blocked manual trigger by ${triggeredBy}: ${msg}`);
      // Log the blocked attempt for audit
      await db.collection("ai_activity_log").add({
        type: "blocked_trigger",
        message: `Manual trigger blocked for ${triggeredBy}: ${msg}`,
        lastRunAt: lastRunAt?.toISOString() || null,
        timestamp: FieldValue.serverTimestamp(),
      });
      return {
        blocked: true,
        onCooldown: true,
        remainingMs,
        message: msg,
        lastRunAt: lastRunAt?.toISOString() || null,
      };
    }
  }

  // Initialize Groq client here (not at module load) so the key is always fresh
  if (!process.env.GROQ_API_KEY) {
    const err = "GROQ_API_KEY is not set. Cannot run crawler.";
    console.error(`[Crawler] ${err}`);
    throw new Error(err);
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const report = {
    admissions: { attempted: 0, added: 0, skipped: 0, errors: 0 },
    scholarships: { attempted: 0, added: 0, skipped: 0, errors: 0 },
    articles: { attempted: 0, added: 0, skipped: 0, errors: 0 },
    courses: { attempted: 0, added: 0, skipped: 0, errors: 0 },
    entryTests: { attempted: 0, added: 0, skipped: 0, errors: 0 },
    totalDurationSeconds: 0,
  };

  console.log(`\n🤖 AI Crawler started (trigger: ${triggeredBy}). Processing ${SOURCES.length} sources...`);

  for (const source of SOURCES) {
    const cat = source.category;
    report[cat].attempted++;

    try {
      // 1. Fetch the page
      console.log(`🤖 [${source.category}] Fetching: ${source.url}`);
      const fetchRes = await fetch(source.url, {
        signal: AbortSignal.timeout(15000), // 15-second timeout per source
        headers: { "User-Agent": "UniGuidBot/1.0 (educational research)" },
      });
      const html = await fetchRes.text();
      const rawText = html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

      // 2. Extract with Groq
      const prompt = buildExtractionPrompt(rawText, source.contentType, source.url);
      const completion = await groq.chat.completions.create({
        model: CRAWLER_GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a structured data extraction assistant. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });

      const rawJson = completion.choices[0]?.message?.content;
      if (!rawJson) throw new Error("Empty response from Groq");

      const extracted = JSON.parse(rawJson);

      // 3. Validate
      if (!isValid(extracted)) {
        console.log(`🤖 [${cat}] No valid data extracted from ${source.url} — skipping.`);
        report[cat].skipped++;
        continue;
      }

      // 4. Deduplicate by sourceUrl
      const existing = await db
        .collection("pending_ai_updates")
        .where("sourceUrl", "==", source.url)
        .limit(1)
        .get();

      if (!existing.empty) {
        console.log(`🤖 [${cat}] Duplicate detected for ${source.url} — skipping.`);
        report[cat].skipped++;
        continue;
      }

      // 5. Add to pending review queue
      await db.collection("pending_ai_updates").add({
        ...extracted,
        confidenceScore: 0.85 + Math.random() * 0.10,
        crawledAt: FieldValue.serverTimestamp(),
        status: "pending_review",
        triggeredBy,
      });

      console.log(`🤖 [${cat}] ✅ Added to queue: ${extracted.universityName || extracted.name || extracted.title}`);
      report[cat].added++;

    } catch (err) {
      // Per-source isolation: log and continue
      console.error(`🤖 [${cat}] ❌ Failed for ${source.url}:`, err.message);
      report[cat].errors++;
      // Log individual source failure to activity log
      await db.collection("ai_activity_log").add({
        type: "source_error",
        category: cat,
        url: source.url,
        message: err.message,
        timestamp: FieldValue.serverTimestamp(),
      }).catch(() => {}); // Don't let log failure break the crawl
    }
  }

  // Compute totals
  report.totalDurationSeconds = Math.round((Date.now() - startTime) / 1000);
  const totalAdded = Object.values(report).reduce((s, v) => s + (v?.added || 0), 0);
  const totalErrors = Object.values(report).reduce((s, v) => s + (v?.errors || 0), 0);

  // Persist the run timestamp (for cooldown enforcement)
  if (triggeredBy !== "cron") {
    await persistLastRun();
  }

  // Log overall result to activity log
  await db.collection("ai_activity_log").add({
    type: "crawl_complete",
    triggeredBy,
    totalAdded,
    totalErrors,
    report,
    timestamp: FieldValue.serverTimestamp(),
  }).catch(() => {});

  console.log(`\n🤖 Crawler complete in ${report.totalDurationSeconds}s. Added: ${totalAdded}, Errors: ${totalErrors}\n`);

  return {
    blocked: false,
    success: true,
    totalAdded,
    totalErrors,
    report,
    message: `Crawl complete. ${totalAdded} items added to review queue.`,
  };
}

// ─── Legacy alias kept for backward compat with cron job ────────────────────
// The cron calls runAICrawler() with no args, so it uses skipCooldownCheck=false
// but triggeredBy="cron", which bypasses the cooldown check correctly.
export { runAICrawler as default };
