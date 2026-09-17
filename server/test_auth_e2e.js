import http from 'http';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env to get JWT_SECRET
const envContent = readFileSync(path.join(__dirname, '.env'), 'utf-8');
const jwtSecretLine = envContent.split('\n').find(l => l.startsWith('JWT_SECRET='));
const JWT_SECRET = jwtSecretLine ? jwtSecretLine.split('=')[1].trim() : null;

async function runTests() {
  console.log("=== COMPREHENSIVE AUTHENTICATION TESTS ===\n");

  // ---------------------------------------------------------
  // 3. Hardcoded Admin Login
  // ---------------------------------------------------------
  const loginPayload = JSON.stringify({
    username: 'ssyediftikharshah49@gmail.com',
    password: 'SYEDIFTI100myproject@#100'
  });

  const loginRes = await makeRequest('/api/auth/admin-login', 'POST', loginPayload);
  console.log(`[TEST 3: Admin Login]`);
  console.log(`STATUS: ${loginRes.statusCode}`);
  const cookieHeader = loginRes.headers['set-cookie']?.[0];
  console.log(`COOKIE SET: ${cookieHeader ? 'YES' : 'NO'}`);
  if (cookieHeader) {
    console.log(`HttpOnly present: ${cookieHeader.includes('HttpOnly')}`);
    console.log(`SameSite=Strict present: ${cookieHeader.includes('SameSite=Strict')}`);
  }
  const loginBody = JSON.parse(loginRes.body);
  console.log(`ROLE IN RESPONSE: ${loginBody.data?.role}\n`);

  // Extract just the cookie value for subsequent requests
  const validCookie = cookieHeader ? cookieHeader.split(';')[0] : '';

  // ---------------------------------------------------------
  // 4. Session Cookie (JWT) Tests
  // ---------------------------------------------------------
  
  // 4a. GET /api/auth/me WITH cookie
  const meRes = await makeRequest('/api/auth/me', 'GET', null, { 'Cookie': validCookie });
  console.log(`[TEST 4a: GET /me (With Cookie)]`);
  console.log(`STATUS: ${meRes.statusCode}`);
  const meBody = JSON.parse(meRes.body);
  console.log(`ROLE RETURNED: ${meBody.data?.role}\n`);

  // 4b. GET /api/auth/me WITHOUT cookie
  const meNoCookieRes = await makeRequest('/api/auth/me', 'GET');
  console.log(`[TEST 4b: GET /me (No Cookie)]`);
  console.log(`STATUS: ${meNoCookieRes.statusCode}`);
  console.log(`BODY: ${meNoCookieRes.body}\n`);

  // 4c. GET /api/auth/me TAMPERED cookie
  const tamperedCookie = 'uniguid_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjMifQ.invalid_signature';
  const meTamperedRes = await makeRequest('/api/auth/me', 'GET', null, { 'Cookie': tamperedCookie });
  console.log(`[TEST 4c: GET /me (Tampered Cookie)]`);
  console.log(`STATUS: ${meTamperedRes.statusCode}`);
  console.log(`BODY: ${meTamperedRes.body}\n`);

  // 4d. POST /api/auth/logout
  const logoutRes = await makeRequest('/api/auth/logout', 'POST');
  console.log(`[TEST 4d: POST /logout]`);
  console.log(`STATUS: ${logoutRes.statusCode}`);
  console.log(`COOKIE CLEARED (Expires 1970): ${logoutRes.headers['set-cookie']?.[0].includes('1970')}\n`);

  // ---------------------------------------------------------
  // 5. Role-Based Route Protection
  // ---------------------------------------------------------
  
  // 5a. Access admin route with no session (401)
  const adminRouteNoAuthRes = await makeRequest('/api/admin/dashboard', 'GET');
  console.log(`[TEST 5a: Access Admin Route (No Auth)]`);
  console.log(`STATUS: ${adminRouteNoAuthRes.statusCode} (Expected: 401)\n`);

  // 5b. Access admin route with STUDENT session (403)
  // We'll generate a valid student JWT to test the 403 Forbidden logic
  const studentJwt = jwt.sign(
    { uid: 'student123', email: 'student@example.com', role: 'student' },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
  const studentCookie = `uniguid_session=${studentJwt}`;
  const adminRouteStudentAuthRes = await makeRequest('/api/admin/dashboard', 'GET', null, { 'Cookie': studentCookie });
  console.log(`[TEST 5b: Access Admin Route (Student Auth)]`);
  console.log(`STATUS: ${adminRouteStudentAuthRes.statusCode} (Expected: 403)`);
  console.log(`BODY: ${adminRouteStudentAuthRes.body}\n`);

  // ---------------------------------------------------------
  // 6. Rate Limiting Check
  // ---------------------------------------------------------
  console.log(`[TEST 6: Rate Limiting on Login (Rapid Requests)]`);
  let rateLimitHit = false;
  let rateLimitStatus = 0;
  // Send 12 rapid login requests (limit is 10)
  for (let i = 0; i < 12; i++) {
    const res = await makeRequest('/api/auth/admin-login', 'POST', loginPayload);
    if (res.statusCode === 429) {
      rateLimitHit = true;
      rateLimitStatus = res.statusCode;
      console.log(`Request #${i+1} STATUS: ${res.statusCode} (Rate Limit Hit!)`);
      console.log(`BODY: ${res.body}`);
      break;
    }
  }
  if (!rateLimitHit) console.log("Did not hit rate limit within 12 requests.");
  console.log("");
}

// Helper for making HTTP requests
function makeRequest(path, method, body = null, headers = {}) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { ...headers }
    };
    
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    
    if (body) req.write(body);
    req.end();
  });
}

runTests();
