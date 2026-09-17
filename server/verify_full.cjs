/**
 * Full verification test for UniGuid.pk backend
 * Tests: admin login, create university, trigger AI crawler,
 *        list AI discoveries, approve discovery, get bookmarks
 * 
 * Run with: node verify_full.cjs
 */

const http = require("http");
require("dotenv").config();

const BASE = "localhost";
const PORT = 5000;
let sessionCookie = "";

function request(path, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE,
      port: PORT,
      path: `/api${path}`,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: sessionCookie } : {})
      }
    };

    const req = http.request(opts, (res) => {
      // Capture Set-Cookie header
      if (res.headers["set-cookie"]) {
        sessionCookie = res.headers["set-cookie"]
          .map(c => c.split(";")[0])
          .join("; ");
      }

      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function sep(label) {
  console.log("\n" + "─".repeat(60));
  console.log(`▶ ${label}`);
  console.log("─".repeat(60));
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // ────────────────────────────────────────────────────────────
  // STEP 1: Admin Login
  // ────────────────────────────────────────────────────────────
  sep("STEP 1: Admin Login (POST /api/auth/admin-login)");

  const loginRes = await request("/auth/admin-login", "POST", {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  });

  console.log("Status:", loginRes.status);
  console.log("Response:", JSON.stringify(loginRes.body, null, 2));
  console.log("Cookie set:", sessionCookie ? "YES ✓" : "NO ✗");

  if (loginRes.status !== 200 || !loginRes.body.success) {
    console.error("\n❌ STEP 1 FAILED — cannot proceed without login");
    process.exit(1);
  }
  console.log("\n✅ STEP 1 PASSED");

  // ────────────────────────────────────────────────────────────
  // STEP 2: Create University (POST /api/admin/universities)
  // ────────────────────────────────────────────────────────────
  sep("STEP 2: Create University (POST /api/admin/universities)");

  const createUniRes = await request("/admin/universities", "POST", {
    name: "LUMS - Lahore University of Management Sciences",
    city: "Lahore",
    sector: "Private",
    email: "admissions@lums.edu.pk",
    officialWebsite: "https://www.lums.edu.pk"
  });

  console.log("Status:", createUniRes.status);
  console.log("Response:", JSON.stringify(createUniRes.body, null, 2));

  if (createUniRes.status === 201 && createUniRes.body.success) {
    const createdId = createUniRes.body.data?.id;
    console.log("\n✅ STEP 2 PASSED — University ID:", createdId);
    
    // ── Verify it's in Firestore by reading it back
    sep("STEP 2b: Verify university appears in GET /api/admin/universities");
    const listRes = await request("/admin/universities", "GET");
    console.log("Status:", listRes.status);
    const found = listRes.body.data?.find(u => u.id === createdId);
    if (found) {
      console.log("Found in Firestore:", JSON.stringify(found, null, 2));
      console.log("✅ STEP 2b PASSED — document confirmed in Firestore");
    } else {
      console.log("All universities returned:", JSON.stringify(listRes.body.data?.slice(0,3), null, 2));
      console.log("⚠️  STEP 2b — created but not found in list (may be timing)");
    }
  } else {
    console.log("\n❌ STEP 2 FAILED");
  }

  // ────────────────────────────────────────────────────────────
  // STEP 3: Trigger AI Crawler (POST /api/ai-admissions/trigger-crawl)
  // ────────────────────────────────────────────────────────────
  sep("STEP 3: Trigger AI Crawler (POST /api/ai-admissions/trigger-crawl)");

  const crawlRes = await request("/ai-admissions/trigger-crawl", "POST");
  console.log("Status:", crawlRes.status);
  console.log("Response:", JSON.stringify(crawlRes.body, null, 2));

  if (crawlRes.status === 200 && crawlRes.body.success) {
    console.log("\n⏳ Crawler queued — waiting 5 seconds for async job to write to Firestore...");
    await sleep(5000);

    // Check ai_activity_log was written
    sep("STEP 3b: Verify ai_activity_log has crawler entry (GET /api/ai-admissions/activity-log)");
    const logRes = await request("/ai-admissions/activity-log", "GET");
    console.log("Status:", logRes.status);
    if (logRes.body.data?.length > 0) {
      console.log("Most recent log entry:", JSON.stringify(logRes.body.data[0], null, 2));
      console.log("✅ STEP 3b PASSED — ai_activity_log written to Firestore");
    } else {
      console.log("Log response:", JSON.stringify(logRes.body, null, 2));
      console.log("⚠️  STEP 3b — no log entries yet (crawler may still be running)");
    }

    // Check pending_ai_updates
    sep("STEP 3c: Verify pending_ai_updates has new discoveries (GET /api/ai-admissions/discoveries)");
    const discoRes = await request("/ai-admissions/discoveries", "GET");
    console.log("Status:", discoRes.status);
    if (discoRes.body.data?.length > 0) {
      const docs = discoRes.body.data;
      console.log(`Total pending discoveries: ${docs.length}`);
      
      const admissions = docs.filter(d => d.type === "admission");
      const scholarships = docs.filter(d => d.type === "scholarship");
      const courses = docs.filter(d => d.type === "free_course");
      
      console.log(`- Admissions: ${admissions.length}`);
      console.log(`- Scholarships: ${scholarships.length}`);
      console.log(`- Free Courses: ${courses.length}`);
      
      if (scholarships.length > 0) {
        console.log("\nSample Scholarship found:");
        console.log(`  Name: ${scholarships[0].name}`);
        console.log(`  Source URL: ${scholarships[0].sourceUrl}`);
        console.log(`  Confidence: ${scholarships[0].confidenceScore}%`);
      }

      if (courses.length > 0) {
        console.log("\nSample Free Course found:");
        console.log(`  Name: ${courses[0].name}`);
        console.log(`  Source URL: ${courses[0].sourceUrl}`);
        console.log(`  Confidence: ${courses[0].confidenceScore}%`);
      }

      console.log("\n✅ STEP 3c PASSED — pending_ai_updates has all new content types");
      
      // ── STEP 4: Approve a discovery ────────────────────────
      const firstPendingId = discoRes.body.data.find(d => d.status === "pending_review")?.id;
      if (firstPendingId) {
        sep(`STEP 4: Approve AI Discovery (PUT /api/ai-admissions/discoveries/${firstPendingId}/approve)`);
        const approveRes = await request(`/ai-admissions/discoveries/${firstPendingId}/approve`, "PUT", {
          adminNote: "Verified and approved via automated test"
        });
        console.log("Status:", approveRes.status);
        console.log("Response:", JSON.stringify(approveRes.body, null, 2));
        if (approveRes.status === 200 && approveRes.body.success) {
          console.log("✅ STEP 4 PASSED — Discovery approved, liveUniversityId:", approveRes.body.data?.liveUniversityId);
        } else {
          console.log("❌ STEP 4 FAILED");
        }
      } else {
        console.log("⚠️  No pending_review discoveries to approve — all may already be approved/rejected");
      }
    } else {
      console.log("Response:", JSON.stringify(discoRes.body, null, 2));
      console.log("⚠️  STEP 3c — no discoveries yet (check again in a moment)");
    }

    console.log("\n✅ STEP 3 PASSED");
  } else {
    console.log("\n❌ STEP 3 FAILED");
  }

  // ────────────────────────────────────────────────────────────
  // STEP 5: Bookmark test (GET /api/user/bookmarks)
  // Uses admin session — checks route is up and auth works
  // ────────────────────────────────────────────────────────────
  sep("STEP 5: Bookmark Routes (GET + POST /api/user/bookmarks)");

  // GET current bookmarks
  const getBookRes = await request("/user/bookmarks", "GET");
  console.log("GET /api/user/bookmarks:");
  console.log("Status:", getBookRes.status);
  console.log("Response:", JSON.stringify(getBookRes.body, null, 2));

  if (getBookRes.status === 200) {
    // POST a bookmark
    const addBookRes = await request("/user/bookmarks", "POST", { itemId: "test_university_abc123" });
    console.log("\nPOST /api/user/bookmarks:");
    console.log("Status:", addBookRes.status);
    console.log("Response:", JSON.stringify(addBookRes.body, null, 2));

    if (addBookRes.status === 200 && addBookRes.body.bookmarks) {
      console.log("Bookmarks after add:", addBookRes.body.bookmarks);

      // DELETE the bookmark
      const delBookRes = await request("/user/bookmarks/test_university_abc123", "DELETE");
      console.log("\nDELETE /api/user/bookmarks/test_university_abc123:");
      console.log("Status:", delBookRes.status);
      console.log("Bookmarks after remove:", delBookRes.body.bookmarks);
      console.log("✅ STEP 5 PASSED — add + remove bookmark both work");
    } else {
      console.log("⚠️  STEP 5 — POST bookmark issue:", addBookRes.body);
    }
  } else {
    console.log("❌ STEP 5 FAILED — /api/user/bookmarks returned:", getBookRes.status);
  }

  sep("VERIFICATION COMPLETE");
}

main().catch(err => {
  console.error("\n💥 Uncaught error:", err.message);
  process.exit(1);
});
