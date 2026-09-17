import http from 'http';

const loginPayload = JSON.stringify({
  username: 'ssyediftikharshah49@gmail.com',
  password: 'SYEDIFTI100myproject@#100'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/admin-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginPayload)
  }
}, (res) => {
  console.log(`\n--- POST /api/auth/admin-login ---`);
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, JSON.stringify(res.headers['set-cookie'], null, 2));
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`BODY:`, data);
    
    // Now test GET /api/auth/me WITHOUT cookie
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET'
    }, (res2) => {
      console.log(`\n--- GET /api/auth/me (No Cookie) ---`);
      console.log(`STATUS: ${res2.statusCode}`);
      
      // Now test POST /api/auth/logout
      const req3 = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/logout',
        method: 'POST'
      }, (res3) => {
        console.log(`\n--- POST /api/auth/logout ---`);
        console.log(`STATUS: ${res3.statusCode}`);
        console.log(`HEADERS:`, JSON.stringify(res3.headers['set-cookie'], null, 2));
      });
      req3.end();
    });
    req2.end();
  });
});
req.write(loginPayload);
req.end();
