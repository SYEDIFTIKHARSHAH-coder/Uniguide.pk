import http from 'http';

const loginPayload = JSON.stringify({
  username: 'ssyediftikharshah49@gmail.com',
  password: 'SYEDIFTI100myproject@#100'
});

async function runTests() {
  const loginRes = await makeRequest('/api/auth/admin-login', 'POST', loginPayload);
  const validCookie = loginRes.headers['set-cookie']?.[0].split(';')[0];
  console.log(`[LOGIN] Admin login successful`);

  // 1. Add a real university
  const addUniversityPayload = JSON.stringify({
    name: "Lahore University of Management Sciences (LUMS)",
    city: "Lahore",
    type: "Private",
    ranking: 1
  });
  const addUniRes = await makeRequest('/api/universities', 'POST', addUniversityPayload, { 'Cookie': validCookie });
  console.log(`[API] Add University: ${addUniRes.statusCode}`);
  const addUniBody = JSON.parse(addUniRes.body);
  console.log(`[API] University ID: ${addUniBody.data?.id}`);
  
  // 2. Trigger AI Crawler
  const triggerAiRes = await makeRequest('/api/ai-admissions/trigger-crawl', 'POST', null, { 'Cookie': validCookie });
  console.log(`[API] Trigger AI Crawler: ${triggerAiRes.statusCode}`);
  console.log(`[API] Crawler Response:`, triggerAiRes.body);
}

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
