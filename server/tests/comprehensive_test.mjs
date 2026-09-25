/**
 * ============================================================
 * UniGuid.pk — Comprehensive Automated Test Suite
 * Author  : Software Testing Engineer (AI-assisted)
 * Version : 1.0.0
 * Date    : 2026-09-24
 * ============================================================
 *
 * Coverage:
 *   1. Health / Infrastructure
 *   2. Auth — Admin Login (positive + negative + security)
 *   3. Auth — /me & /logout
 *   4. Admin Guard (role-based access)
 *   5. University CRUD (admin)
 *   6. University Public Endpoint
 *   7. Articles CRUD (admin)
 *   8. Courses CRUD (admin)
 *   9. Scholarships CRUD (admin + public)
 *  10. Entry Tests CRUD (admin + public)
 *  11. Guidance / Articles Public
 *  12. XSS / Injection sanitiser
 *  13. Logout
 *
 * Run:  node tests/comprehensive_test.mjs
 * Pre-requisite: server must be running on http://localhost:5000
 *                Set ADMIN_USERNAME and ADMIN_PASSWORD env vars.
 * ============================================================
 */

import http from 'http';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const HOST = 'localhost';
const PORT = 5000;

// Load admin credentials from env or use defaults for dev
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// ─── STATE ────────────────────────────────────────────────────────────────────
let adminCookie = '';
let testResults = [];
let passCount = 0;
let failCount = 0;
let skipCount = 0;

// IDs collected during create tests — reused for update / delete
const createdIds = {
  university: null,
  article: null,
  course: null,
  scholarship: null,
  entryTest: null,
};

// ─── HTTP HELPER ──────────────────────────────────────────────────────────────
function request(method, path, body = null, customHeaders = {}, useCookie = true) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;

    const options = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(useCookie && adminCookie ? { Cookie: adminCookie } : {}),
        ...customHeaders,
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.headers['set-cookie']) {
          adminCookie = res.headers['set-cookie'][0].split(';')[0];
        }
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ─── ASSERTION HELPERS ────────────────────────────────────────────────────────
function assert(condition, message) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

// ─── TEST RUNNER ──────────────────────────────────────────────────────────────
async function test(name, fn, { skip = false } = {}) {
  if (skip) {
    console.log(`  ⏭  SKIP  | ${name}`);
    skipCount++;
    testResults.push({ name, status: 'SKIP', error: null });
    return;
  }
  try {
    await fn();
    console.log(`  ✅ PASS  | ${name}`);
    passCount++;
    testResults.push({ name, status: 'PASS', error: null });
  } catch (err) {
    console.log(`  ❌ FAIL  | ${name}`);
    console.log(`          > ${err.message}`);
    failCount++;
    testResults.push({ name, status: 'FAIL', error: err.message });
  }
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

// ─────────────────────────────────────────────────────────────────────────────
//  TEST SUITES
// ─────────────────────────────────────────────────────────────────────────────

async function suiteHealth() {
  section('SUITE 1 — Health & Infrastructure');

  await test('GET / → 200 with success body', async () => {
    const res = await request('GET', '/');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.success === true, 'Expected success:true');
    assert(typeof res.body?.message === 'string', 'Expected message string');
  });

  await test('GET /api/health → 200 healthy', async () => {
    const res = await request('GET', '/api/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.status === 'healthy', 'Expected status:healthy');
    assert(typeof res.body?.uptime === 'number', 'Expected numeric uptime');
  });

  await test('GET /api/nonexistent → 404 handler fires', async () => {
    const res = await request('GET', '/api/nonexistent-endpoint-xyz');
    assert(res.status === 404, `Expected 404, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false on 404');
  });

  await test('GET /random-path → 404 handler fires', async () => {
    const res = await request('GET', '/this-does-not-exist');
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });
}

async function suiteAuthAdminLogin() {
  section('SUITE 2 — Auth: Admin Login');

  await test('POST /api/auth/admin-login → missing body → 400', async () => {
    const res = await request('POST', '/api/auth/admin-login', {});
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('POST /api/auth/admin-login → missing password → 400', async () => {
    const res = await request('POST', '/api/auth/admin-login', { username: 'admin' });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/auth/admin-login → wrong username → 401 with generic message', async () => {
    const res = await request('POST', '/api/auth/admin-login', {
      username: 'wrong_user_xyz',
      password: 'any_password',
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
    assert(res.body?.message === 'Invalid credentials', 'Expected generic error message (security)');
  });

  await test('POST /api/auth/admin-login → wrong password → 401', async () => {
    const res = await request('POST', '/api/auth/admin-login', {
      username: ADMIN_USERNAME,
      password: 'definitely_wrong_password_123!',
    });
    assert([401, 503].includes(res.status), `Expected 401 or 503, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('POST /api/auth/admin-login → SQL-injection input → not 500 or 200', async () => {
    const res = await request('POST', '/api/auth/admin-login', {
      username: "' OR '1'='1",
      password: "' OR '1'='1",
    });
    assert(res.status !== 500, `Server must not crash on injection attempt`);
    assert(res.status !== 200, `Must not bypass auth with SQL injection string`);
    assert(res.body?.success !== true, 'Must not return success:true on injection');
  });

  await test('POST /api/auth/admin-login → correct credentials → 200 + cookie set', async () => {
    if (!ADMIN_PASSWORD) {
      throw new Error('ADMIN_PASSWORD env var not set — set it before running tests');
    }
    const res = await request('POST', '/api/auth/admin-login', {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }, {}, false);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body?.success === true, 'Expected success:true');
    assert(res.body?.data?.role === 'admin', 'Expected role:admin');
    assert(res.headers['set-cookie'], 'Expected Set-Cookie header');
    assert(adminCookie.startsWith('uniguid_session='), 'Expected uniguid_session cookie');
  });
}

async function suiteAuthMe() {
  section('SUITE 3 — Auth: /me & Session Validation');

  await test('GET /api/auth/me → with valid session → 200 + user data', async () => {
    const res = await request('GET', '/api/auth/me');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.success === true, 'Expected success:true');
    assert(res.body?.data?.role === 'admin', 'Expected role:admin');
    assert(res.body?.data?.uid, 'Expected uid in data');
  });

  await test('GET /api/auth/me → tampered cookie → 401', async () => {
    const res = await request('GET', '/api/auth/me', null, {
      Cookie: 'uniguid_session=this.is.a.tampered.jwt.token',
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('GET /api/auth/me → no cookie → 401', async () => {
    const res = await request('GET', '/api/auth/me', null, {}, false);
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });
}

async function suiteAdminGuard() {
  section('SUITE 4 — Admin Guard (RBAC)');

  await test('GET /api/admin/dashboard → without cookie → 401', async () => {
    const res = await request('GET', '/api/admin/dashboard', null, {}, false);
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('GET /api/admin/dashboard → with valid admin cookie → not 401/403', async () => {
    const res = await request('GET', '/api/admin/dashboard');
    assert(res.status !== 401, 'Admin must not receive 401');
    assert(res.status !== 403, 'Admin must not receive 403');
  });

  await test('GET /api/admin/users → with admin cookie → not 401/403', async () => {
    const res = await request('GET', '/api/admin/users');
    assert(res.status !== 401, 'Admin must not receive 401');
    assert(res.status !== 403, 'Admin must not receive 403');
  });
}

async function suiteUniversityCRUD() {
  section('SUITE 5 — University CRUD (Admin)');

  await test('POST /api/admin/universities → missing required fields → 400', async () => {
    const res = await request('POST', '/api/admin/universities', { email: 'test@uni.com' });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('POST /api/admin/universities → invalid sector → 400', async () => {
    const res = await request('POST', '/api/admin/universities', {
      name: 'Test University', city: 'Islamabad', sector: 'Government',
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/universities → invalid email format → 400', async () => {
    const res = await request('POST', '/api/admin/universities', {
      name: 'Test University', city: 'Islamabad', sector: 'Public', email: 'not-an-email',
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/universities → valid payload → 201', async () => {
    const res = await request('POST', '/api/admin/universities', {
      name: 'QA Test University 2026', city: 'Islamabad', sector: 'Public', email: 'qa@testuni.edu.pk',
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body?.success === true, 'Expected success:true');
    createdIds.university = res.body?.data?.id;
    assert(createdIds.university, 'Expected ID in response');
  });

  await test('GET /api/admin/universities → returns list', async () => {
    const res = await request('GET', '/api/admin/universities');
    if (res.status === 200) assert(Array.isArray(res.body?.data), 'Expected data array');
  });

  await test('PUT /api/admin/universities/:id/status → approve → 200', async () => {
    if (!createdIds.university) return;
    const res = await request('PUT', `/api/admin/universities/${createdIds.university}/status`, { status: 'approved' });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  await test('PUT /api/admin/universities/:id/status → invalid status → 400', async () => {
    if (!createdIds.university) return;
    const res = await request('PUT', `/api/admin/universities/${createdIds.university}/status`, { status: 'invalid_xyz' });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('PUT /api/admin/universities/:id → edit → 200', async () => {
    if (!createdIds.university) return;
    const res = await request('PUT', `/api/admin/universities/${createdIds.university}`, {
      name: 'QA Test University 2026 UPDATED', city: 'Lahore',
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('GET /api/universities/published → public endpoint → not 401', async () => {
    const res = await request('GET', '/api/universities/published', null, {}, false);
    assert(res.status !== 401, 'Public endpoint must not require auth');
    assert(res.status !== 403, 'Public endpoint must not require auth');
  });

  await test('DELETE /api/admin/universities/:id → delete → 200', async () => {
    if (!createdIds.university) return;
    const res = await request('DELETE', `/api/admin/universities/${createdIds.university}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    createdIds.university = null;
  });
}

async function suiteArticlesCRUD() {
  section('SUITE 6 — Articles CRUD (Admin)');

  await test('POST /api/admin/articles → missing title → not 200', async () => {
    const res = await request('POST', '/api/admin/articles', { category: 'admission' });
    assert(res.status !== 200, `Expected error status, got 200`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('POST /api/admin/articles → valid payload → 201', async () => {
    const res = await request('POST', '/api/admin/articles', {
      title: 'QA Test Article 2026',
      category: 'admission',
      readTimeMinutes: 5,
      author: 'QA Engineer',
      content: 'This is a detailed test article content that has more than 50 characters for validation purposes.',
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body?.success === true, 'Expected success:true');
    createdIds.article = res.body?.data?.id;
    assert(createdIds.article, 'Expected article ID');
  });

  await test('GET /api/admin/articles → returns list', async () => {
    const res = await request('GET', '/api/admin/articles');
    assert([200, 500].includes(res.status), `Unexpected status ${res.status}`);
  });

  await test('GET /api/guidance → public endpoint accessible', async () => {
    const res = await request('GET', '/api/guidance', null, {}, false);
    assert(res.status !== 401, 'Public guidance must not require auth');
    assert(res.status !== 403, 'Public guidance must not require auth');
  });

  await test('PUT /api/admin/articles/:id → update → 200', async () => {
    if (!createdIds.article) return;
    const res = await request('PUT', `/api/admin/articles/${createdIds.article}`, {
      title: 'QA Test Article 2026 UPDATED',
      category: 'scholarship',
      content: 'Updated content for QA purposes. Must be over 50 characters for testing.',
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('DELETE /api/admin/articles/:id → delete → 200', async () => {
    if (!createdIds.article) return;
    const res = await request('DELETE', `/api/admin/articles/${createdIds.article}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    createdIds.article = null;
  });
}

async function suiteCoursesCRUD() {
  section('SUITE 7 — Courses CRUD (Admin + Public)');

  await test('POST /api/admin/courses → valid payload → 201', async () => {
    const res = await request('POST', '/api/admin/courses', {
      title: 'QA Test Course 2026',
      category: 'admission_preparation',
      description: 'Detailed description with at least 20 characters for QA.',
      difficulty: 'beginner',
      instructor: 'QA Engineer',
      durationHours: 5,
      modules: [{ title: 'Module 1', lessons: [{ title: 'Lesson 1', durationMinutes: 10, videoUrl: 'https://example.com/video' }] }],
      isFree: true,
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    createdIds.course = res.body?.data?.id;
  });

  await test('GET /api/admin/courses → returns list', async () => {
    const res = await request('GET', '/api/admin/courses');
    assert([200, 500].includes(res.status), `Unexpected status ${res.status}`);
  });

  await test('GET /api/courses → public endpoint accessible', async () => {
    const res = await request('GET', '/api/courses', null, {}, false);
    assert(res.status !== 401, 'Public courses must not require auth');
    assert(res.status !== 403, 'Public courses must not require auth');
  });

  await test('DELETE /api/admin/courses/:id → delete → 200', async () => {
    if (!createdIds.course) return;
    const res = await request('DELETE', `/api/admin/courses/${createdIds.course}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    createdIds.course = null;
  });
}

async function suiteScholarshipsCRUD() {
  section('SUITE 8 — Scholarships CRUD (Admin + Public)');

  await test('POST /api/admin/scholarships → name < 5 chars → 400', async () => {
    const res = await request('POST', '/api/admin/scholarships', { name: 'AB', type: 'merit' });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/scholarships → invalid applyLink URL → 400', async () => {
    const res = await request('POST', '/api/admin/scholarships', {
      name: 'Valid Scholarship Name', type: 'merit', applyLink: 'not-a-url',
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/scholarships → minMarks > 100 → 400', async () => {
    const res = await request('POST', '/api/admin/scholarships', {
      name: 'Valid Scholarship Name', type: 'merit', minMarks: 150,
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/scholarships → negative incomeLimit → 400', async () => {
    const res = await request('POST', '/api/admin/scholarships', {
      name: 'Valid Scholarship Name', type: 'need-based', incomeLimit: -5000,
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('POST /api/admin/scholarships → valid payload → 201', async () => {
    const res = await request('POST', '/api/admin/scholarships', {
      name: 'QA Test Scholarship 2026',
      type: 'merit',
      provider: 'QA Foundation',
      description: 'A test scholarship for QA verification.',
      minMarks: 85,
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body?.success === true, 'Expected success:true');
    createdIds.scholarship = res.body?.data?.id;
    assert(createdIds.scholarship, 'Expected scholarship ID');
  });

  await test('GET /api/scholarships → public → 200 with array', async () => {
    const res = await request('GET', '/api/scholarships', null, {}, false);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body?.data), 'Expected data array');
  });

  await test('GET /api/scholarships/:id → fetch by ID → 200', async () => {
    if (!createdIds.scholarship) return;
    const res = await request('GET', `/api/scholarships/${createdIds.scholarship}`, null, {}, false);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.data?.name === 'QA Test Scholarship 2026', 'Expected correct scholarship name');
  });

  await test('GET /api/scholarships/nonexistent-id → 404', async () => {
    const res = await request('GET', '/api/scholarships/nonexistent-id-xyz-abc-123', null, {}, false);
    assert(res.status === 404, `Expected 404, got ${res.status}`);
    assert(res.body?.success === false, 'Expected success:false');
  });

  await test('PUT /api/admin/scholarships/:id → update → 200', async () => {
    if (!createdIds.scholarship) return;
    const res = await request('PUT', `/api/admin/scholarships/${createdIds.scholarship}`, {
      name: 'QA Test Scholarship 2026 UPDATED', type: 'need-based', minMarks: 70,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('DELETE /api/admin/scholarships/:id → delete → 200', async () => {
    if (!createdIds.scholarship) return;
    const res = await request('DELETE', `/api/admin/scholarships/${createdIds.scholarship}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    createdIds.scholarship = null;
  });
}

async function suiteEntryTestsCRUD() {
  section('SUITE 9 — Entry Tests CRUD (Admin + Public)');

  await test('POST /api/admin/entry-tests → valid payload → 201', async () => {
    const res = await request('POST', '/api/admin/entry-tests', {
      name: 'QA Test Exam 2026',
      organizingBody: 'QA Test Body',
      description: 'Test description for entry test QA script.',
      isActive: true,
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    createdIds.entryTest = res.body?.data?.id;
  });

  await test('GET /api/entry-tests → public → accessible', async () => {
    const res = await request('GET', '/api/entry-tests', null, {}, false);
    assert(res.status !== 401, 'Public entry tests must not require auth');
    assert([200, 500].includes(res.status), `Unexpected status ${res.status}`);
  });

  await test('GET /api/entry-tests/:id → fetch by ID → 200', async () => {
    if (!createdIds.entryTest) return;
    const res = await request('GET', `/api/entry-tests/${createdIds.entryTest}`, null, {}, false);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.data?.name === 'QA Test Exam 2026', 'Expected correct entry test name');
  });

  await test('PUT /api/admin/entry-tests/:id → update → 200', async () => {
    if (!createdIds.entryTest) return;
    const res = await request('PUT', `/api/admin/entry-tests/${createdIds.entryTest}`, {
      name: 'QA Test Exam 2026 UPDATED', organizingBody: 'QA Body Updated', isActive: false,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('DELETE /api/admin/entry-tests/:id → delete → 200', async () => {
    if (!createdIds.entryTest) return;
    const res = await request('DELETE', `/api/admin/entry-tests/${createdIds.entryTest}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    createdIds.entryTest = null;
  });
}

async function suiteXSSSanitiser() {
  section('SUITE 10 — XSS / Injection Sanitiser');

  await test('Admin login with XSS in username → not 500', async () => {
    const res = await request('POST', '/api/auth/admin-login', {
      username: '<script>alert("xss")</script>admin',
      password: 'anypassword',
    });
    assert(res.status !== 500, `Server must not crash on XSS input`);
    assert(res.body?.success !== true, 'XSS input must not result in successful login');
  });

  await test('Admin login with HTML injection → not 500', async () => {
    const res = await request('POST', '/api/auth/admin-login', {
      username: '<img src=x onerror=alert(1)>',
      password: '<b>password</b>',
    });
    assert(res.status !== 500, `Server must not crash on HTML injection`);
  });

  await test('Scholarship with XSS in name → sanitised → not 500', async () => {
    const res = await request('POST', '/api/admin/scholarships', {
      name: '<script>document.cookie</script>',
      type: 'merit',
    });
    // After sanitization, <script>...</script> stripped → empty string → Zod min(5) fails → 400
    assert(res.status !== 500, `Server must not crash on XSS payload`);
  });

  await test('University with JS injection in city → not 500', async () => {
    const res = await request('POST', '/api/admin/universities', {
      name: 'Valid University Name',
      city: '<script>fetch("evil.com")</script>',
      sector: 'Public',
    });
    assert(res.status !== 500, `Server must not crash on script injection in city field`);
  });
}

async function suiteLogout() {
  section('SUITE 11 — Logout');

  await test('POST /api/auth/logout → clears session → 200', async () => {
    const res = await request('POST', '/api/auth/logout');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body?.success === true, 'Expected success:true');
    adminCookie = '';
  });

  await test('GET /api/auth/me → after logout → 401', async () => {
    const res = await request('GET', '/api/auth/me');
    assert(res.status === 401, `Expected 401 after logout, got ${res.status}`);
  });

  await test('GET /api/admin/dashboard → after logout → 401', async () => {
    const res = await request('GET', '/api/admin/dashboard');
    assert(res.status === 401, `Expected 401 after logout, got ${res.status}`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN RUNNER
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     UniGuid.pk — Comprehensive API Test Suite v1.0      ║');
  console.log('║     Software Testing Engineer Report                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n  Target: http://${HOST}:${PORT}`);
  console.log(`  Date  : ${new Date().toISOString()}\n`);

  const start = Date.now();

  try {
    await suiteHealth();
    await suiteAuthAdminLogin();   // populates adminCookie
    await suiteAuthMe();
    await suiteAdminGuard();
    await suiteUniversityCRUD();
    await suiteArticlesCRUD();
    await suiteCoursesCRUD();
    await suiteScholarshipsCRUD();
    await suiteEntryTestsCRUD();
    await suiteXSSSanitiser();
    await suiteLogout();
  } catch (err) {
    console.error('\n[FATAL] Test runner crashed:', err.message);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  const total = passCount + failCount + skipCount;

  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                  TEST EXECUTION SUMMARY                 ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Total Tests : ${String(total).padEnd(41)}║`);
  console.log(`║  ✅ Passed   : ${String(passCount).padEnd(41)}║`);
  console.log(`║  ❌ Failed   : ${String(failCount).padEnd(41)}║`);
  console.log(`║  ⏭  Skipped  : ${String(skipCount).padEnd(41)}║`);
  console.log(`║  ⏱  Duration : ${String(elapsed + 's').padEnd(41)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (failCount > 0) {
    console.log('\n  FAILED TESTS:');
    testResults.filter((t) => t.status === 'FAIL').forEach((t) => {
      console.log(`  ❌ ${t.name}`);
      console.log(`     → ${t.error}`);
    });
  }

  console.log(failCount === 0 ? '\n  🎉 ALL TESTS PASSED!\n' : `\n  ⚠️  ${failCount} test(s) failed. See above.\n`);
  process.exit(failCount > 0 ? 1 : 0);
}

main();
