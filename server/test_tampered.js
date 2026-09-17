import http from 'http';

const req2 = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/me',
  method: 'GET',
  headers: {
    'Cookie': 'uniguid_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_payload.fake_signature;'
  }
}, (res2) => {
  console.log(`\n--- GET /api/auth/me (Tampered Cookie) ---`);
  console.log(`STATUS: ${res2.statusCode}`);
  let data = '';
  res2.on('data', chunk => data += chunk);
  res2.on('end', () => {
    console.log(`BODY:`, data);
  });
});
req2.end();
