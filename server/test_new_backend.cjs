const http = require("http");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const BASE_URL = "http://localhost:5000/api";
let cookie = "";
let addedUniId = "";

const adminCreds = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

const makeRequest = (path, method = "GET", body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie
      }
    };
    
    const req = http.request(options, (res) => {
      let data = "";
      
      if (res.headers["set-cookie"]) {
        cookie = res.headers["set-cookie"].map(c => c.split(';')[0]).join('; ');
      }
      
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    
    req.on("error", err => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  try {
    // 1. Admin Login
    const loginRes = await makeRequest("/auth/admin-login", "POST", adminCreds);
    if (loginRes.status === 200) {
      console.log("[LOGIN] Admin login successful");
    } else {
      console.error("Login failed:", loginRes.body);
      return;
    }
    
    // 2. Add University
    const uniPayload = {
      name: "Test University of Engineering",
      city: "Lahore",
      sector: "Public",
      email: "info@tuet.edu.pk",
      officialWebsite: "https://www.tuet.edu.pk"
    };
    
    const addRes = await makeRequest("/admin/universities", "POST", uniPayload);
    console.log(`[API] Add University: ${addRes.status}`);
    const addBody = JSON.parse(addRes.body);
    console.log("[API] Add Uni Response:", JSON.stringify(addBody, null, 2));
    
    addedUniId = addBody.data?.id;
    
    // 3. Trigger AI Crawler
    const crawlRes = await makeRequest("/ai-admissions/trigger-crawl", "POST");
    console.log(`[API] Trigger AI Crawler: ${crawlRes.status}`);
    console.log("[API] Crawler Response:", crawlRes.body);
    
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

runTests();
