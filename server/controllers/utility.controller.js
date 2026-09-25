import * as utilityService from "../services/utility.service.js";
import { reviewSchema, favoriteSchema } from "../validators/utility.validator.js";
import Groq from "groq-sdk";
import admin from "../firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

// ─── Helper: Groq with automatic retry ────────────────────────────────────────
async function callGroqWithRetry(messages, options = {}, maxRetries = 2) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages,
        model: options.model || DEFAULT_GROQ_MODEL,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 600,
        ...options,
      });
      return completion.choices[0]?.message?.content || "I am currently unable to process your request.";
    } catch (err) {
      lastError = err;
      // Rate limit — don't retry, propagate immediately
      if (err.status === 429) throw err;
      // On other errors, wait briefly and retry
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// ─── Helper: Fetch local university context ───────────────────────────────────
async function getUniversityContext() {
  try {
    const openSnapshot = await db.collection("universities")
      .where("admissionStatus", "==", "open")
      .where("status", "==", "approved")
      .limit(30)
      .get();

    const openUniversities = openSnapshot.docs.map(d => {
      const u = d.data();
      return `- ${u.name || "Unknown"} (${u.province || ""}, ${u.sector || ""}) — Admission: OPEN`;
    }).join("\n");

    const allSnapshot = await db.collection("universities")
      .where("status", "==", "approved")
      .limit(10)
      .get();

    const totalApproved = allSnapshot.size;
    return { openUniversities, totalApproved };
  } catch (e) {
    console.error("[AI Tiger] Failed to fetch university context:", e.message);
    return { openUniversities: "", totalApproved: 0 };
  }
}

// ─── Build enriched system prompt ─────────────────────────────────────────────
function buildSystemPrompt(openUniversities, totalApproved) {
  return `You are AI Tiger, an expert university admission and career counselor exclusively for Pakistani students. 
You have deep knowledge of Pakistan's higher education system including:

🎓 UNIVERSITIES & REGULATORY BODIES:
- HEC (Higher Education Commission of Pakistan)
- NUST, LUMS, QAU, UET Lahore, UET Taxila, FAST-NUCES, COMSATS, IBA, NED, UET Peshawar
- All public and private universities across Punjab, Sindh, KPK, Balochistan, Islamabad

📋 ENTRY TESTS:
- NTS (National Testing Service): Used by many public universities
- ECAT (Engineering College Admission Test): For engineering programs
- MDCAT (Medical and Dental Colleges Admission Test): For MBBS/BDS
- NUMS Test: National University of Medical Sciences
- UET Entry Test: University of Engineering & Technology
- GAT (Graduate Assessment Test): For postgraduate programs
- LAT (Law Admission Test): For law programs

💰 SCHOLARSHIPS:
- HEC Scholarships (Need-based, Merit, Indigenous)
- Prime Minister's Laptop & Fee Reimbursement Scheme
- Punjab Educational Endowment Fund (PEEF)
- Ehsaas Scholarship
- Aga Khan Foundation Scholarships
- LUMS National Outreach Program (NOP)
- NUST Financial Aid
- DAAD, Fulbright, Chevening (International)

🆓 FREE COURSES & LEARNING:
- Coursera, edX, Khan Academy, YouTube
- NAVTTC, DigiSkills.pk (Government free courses)
- Google Career Certificates
- Microsoft Learn
- Coursera for Campus

📊 LOCAL DATABASE (from UniGuid.pk — ${totalApproved} approved universities):
Universities with OPEN Admissions right now:
${openUniversities || "No universities currently have open admissions in our database."}

DATA PRIORITY: Always use local UniGuid.pk data first. If asked about information not in the database, use your training knowledge and clearly label it as general information (not from local database).

RESPONSE STYLE: Be concise, encouraging, and Pakistan-specific. Use bullet points for lists. Keep responses under 400 words unless asked for detail.`;
}

// --- REVIEWS ---

export const getTargetReviews = async (req, res) => {
  try {
    const { targetId, targetType } = req.query;
    if (!targetId || !targetType) {
      return res.status(400).json({ success: false, message: "targetId and targetType query params required" });
    }
    const reviews = await utilityService.getReviews(targetId, targetType);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const postReview = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userName = req.user.name || "Student";
    const validated = reviewSchema.parse(req.body);
    const result = await utilityService.addReview(userId, userName, validated);
    res.status(201).json({ success: true, data: result, message: "Review posted successfully" });
  } catch (error) {
    if (error.message === "You have already reviewed this.") {
      return res.status(409).json({ success: false, message: error.message });
    }
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// --- FAVORITES ---

export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.uid;
    const type = req.query.type || "all";
    const favs = await utilityService.getUserFavorites(userId, type);
    res.status(200).json({ success: true, data: favs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const validated = favoriteSchema.parse(req.body);
    const { title, subtitle } = req.body;
    const result = await utilityService.toggleFavorite(userId, validated.targetId, validated.targetType, title, subtitle);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const checkFavoriteStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { targetId } = req.params;
    const isFavorite = await utilityService.checkIsFavorite(userId, targetId);
    res.status(200).json({ success: true, data: { isFavorite } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// --- AI TIGER CHAT ---
export const chatWithTiger = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: "AI service is currently unavailable. Please check server configuration." });
    }

    // Fetch university context from local database
    const { openUniversities, totalApproved } = await getUniversityContext();
    const systemPrompt = buildSystemPrompt(openUniversities, totalApproved);

    const response = await callGroqWithRetry([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt.trim() }
    ], { max_tokens: 600 });

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    // Log full error details server-side for easy diagnosis
    console.error("[AI Tiger] Chat error — status:", error.status, "| message:", error.message);
    if (error.error) console.error("[AI Tiger] Groq error body:", JSON.stringify(error.error));

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI Tiger is receiving too many questions right now. Please wait a moment and try again!"
      });
    }
    if (error.status === 401) {
      console.error("[AI Tiger] CRITICAL: Groq API key is invalid or revoked. Update GROQ_API_KEY in .env");
      return res.status(500).json({
        success: false,
        message: "AI Tiger is misconfigured. Please contact the admin."
      });
    }
    res.status(500).json({
      success: false,
      message: "AI Tiger is temporarily unavailable. Please try again in a few seconds.",
      // Only expose error detail in non-production
      detail: process.env.NODE_ENV !== "production" ? `${error.status || ""} ${error.message}` : undefined
    });
  }
};

// --- AI TIGER ADMIN SCAN (triggers data refresh from AI knowledge) ---
export const triggerAiScan = async (req, res) => {
  const startTime = Date.now();
  const report = {
    universitiesChecked: 0,
    admissionsUpdated: 0,
    scholarshipsAdded: 0,
    freeCoursesAdded: 0,
    deadlinesUpdated: 0,
    duplicatesSkipped: 0,
    errors: 0,
    changes: [],
    duration: 0,
  };

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: "AI service is not configured." });
    }

    // Step 1: Fetch all existing universities from Firestore
    const snapshot = await db.collection("universities").orderBy("name").get();
    const existingUniversities = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    report.universitiesChecked = existingUniversities.length;

    const uniNames = existingUniversities.map(u => u.name).slice(0, 50).join(", ");

    // Step 2: Ask AI for updated admission status based on training knowledge
    const aiPrompt = `You are a data assistant for UniGuid.pk, a Pakistani university guidance platform.

Based on your knowledge of Pakistani universities, review the following universities and provide updated information in JSON format:

Universities to review: ${uniNames}

Return a JSON array (only the array, no other text) where each object has:
{
  "name": "exact university name matching the list",
  "admissionStatus": "open" or "closed",
  "scholarshipsAvailable": true or false,
  "scholarshipInfo": "brief scholarship description or null",
  "entryTest": "entry test name(s) or null",
  "deadline": "approximate deadline or null"
}

Base this on typical Pakistani university admission cycles (Spring/Fall). Be realistic about current dates (Pakistan academic year: Fall starts Aug-Sep, Spring starts Jan-Feb).
Return ONLY valid JSON array.`;

    let aiData = [];
    try {
      const aiResponse = await callGroqWithRetry([
        { role: "user", content: aiPrompt }
      ], { temperature: 0.2, max_tokens: 2000 });

      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("[AI Scan] Failed to parse AI response:", parseError.message);
      report.errors++;
    }

    // Step 3: Update only changed fields for matching universities
    const batch = db.batch();
    let batchCount = 0;

    for (const aiUni of aiData) {
      // Find exact or closest match in existing universities
      const match = existingUniversities.find(u =>
        u.name?.toLowerCase().trim() === aiUni.name?.toLowerCase().trim()
      );

      if (!match) {
        report.duplicatesSkipped++;
        continue;
      }

      const updates = {};
      let hasChanges = false;

      // Only update fields that have changed
      if (aiUni.admissionStatus && aiUni.admissionStatus !== match.admissionStatus) {
        updates.admissionStatus = aiUni.admissionStatus;
        hasChanges = true;
        report.admissionsUpdated++;
        report.changes.push(`${match.name}: admission → ${aiUni.admissionStatus}`);
      }

      if (aiUni.entryTest && !match.entryTest) {
        updates.entryTest = aiUni.entryTest;
        hasChanges = true;
      }

      if (aiUni.deadline && aiUni.deadline !== match.deadline) {
        updates.deadline = aiUni.deadline;
        hasChanges = true;
        report.deadlinesUpdated++;
      }

      if (aiUni.scholarshipsAvailable && !match.hasScholarships) {
        updates.hasScholarships = true;
        updates.scholarshipInfo = aiUni.scholarshipInfo || "";
        hasChanges = true;
        report.scholarshipsAdded++;
      }

      if (hasChanges) {
        updates.aiLastUpdated = FieldValue.serverTimestamp();
        updates.updatedAt = FieldValue.serverTimestamp();
        const docRef = db.collection("universities").doc(match.id);
        batch.update(docRef, updates);
        batchCount++;

        // Firestore batch limit is 500
        if (batchCount >= 490) break;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    // Step 4: Log the scan to Firestore for audit trail
    report.duration = Math.round((Date.now() - startTime) / 1000);
    await db.collection("ai_scan_logs").add({
      ...report,
      triggeredBy: req.user?.email || "admin",
      triggeredAt: FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "AI Scan completed successfully",
      report
    });

  } catch (error) {
    console.error("[AI Scan] Error:", error.message);
    report.errors++;
    report.duration = Math.round((Date.now() - startTime) / 1000);
    res.status(500).json({
      success: false,
      message: "AI Scan encountered an error. Partial updates may have been applied.",
      report,
      error: process.env.NODE_ENV !== "production" ? error.message : undefined
    });
  }
};

// ─── GET /api/utilities/ai-tiger/health ───────────────────────────────────────
// Diagnostic endpoint: tests the Groq API key and returns a clear error reason.
// Useful for diagnosing chatbot failures without digging through server logs.
export const aiTigerHealth = async (req, res) => {
  const status = { keyPresent: false, keyValid: false, error: null, model: DEFAULT_GROQ_MODEL };

  if (!process.env.GROQ_API_KEY) {
    status.error = "GROQ_API_KEY is not set in environment variables";
    return res.status(500).json({ success: false, data: status });
  }

  status.keyPresent = true;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const test = await groq.chat.completions.create({
      model: status.model,
      messages: [{ role: "user", content: "Reply with just the word: OK" }],
      max_tokens: 5,
    });
    const reply = test.choices[0]?.message?.content?.trim();
    status.keyValid = true;
    status.testReply = reply;
    return res.json({ success: true, data: status });
  } catch (err) {
    status.error = `${err.status || ""} ${err.message}`;
    if (err.status === 401) status.error = "Invalid or revoked Groq API key — regenerate it at https://console.groq.com/keys";
    if (err.status === 429) status.error = "Groq rate limit exceeded — wait before retrying";
    console.error("[AI Tiger Health] Groq test failed:", status.error);
    return res.status(err.status === 401 ? 401 : 500).json({ success: false, data: status });
  }
};
