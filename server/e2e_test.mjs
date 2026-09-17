import http from 'http';

const BASE_URL = 'http://localhost:5000';
let adminCookie = '';

// Helper to make HTTP requests
const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      }
    };

    if (adminCookie) {
      options.headers['Cookie'] = adminCookie;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.headers['set-cookie']) {
          adminCookie = res.headers['set-cookie'][0].split(';')[0];
        }
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log("=== STARTING E2E API VERIFICATION ===");

  // 1. Admin Login
  console.log("\n[1] Admin Login");
  const loginRes = await request('POST', '/api/auth/admin-login', {
    username: 'ssyediftikharshah49@gmail.com',
    password: 'SYEDIFTI100myproject@#100'
  });
  if (loginRes.status !== 200) {
    console.error("Admin login failed!", loginRes.body);
    process.exit(1);
  }
  console.log("✅ Admin logged in successfully");

  // 2. Test University
  console.log("\n[2] Testing University Data Flow");
  let testUniId = null;
  try {
    const createUniRes = await request('POST', '/api/admin/universities', {
      name: "E2E Test University 2026",
      city: "Test City",
      sector: "Public"
    });
    if (createUniRes.status === 201 || createUniRes.status === 200) {
      console.log("✅ University created successfully");
      testUniId = createUniRes.body.data?.id; 
      
      if (!testUniId) {
        const getAdminUnis = await request('GET', '/api/admin/universities');
        const unis = getAdminUnis.body.data;
        testUniId = unis.find(u => u.name === "E2E Test University 2026")?.id;
      }
    } else {
      console.error("❌ Failed to create university", createUniRes.body);
    }

    if (testUniId) {
      // Approve it
      const approveRes = await request('PUT', `/api/admin/universities/${testUniId}/status`, { status: "approved" });
      if (approveRes.status === 200) console.log("✅ University approved");
      
      // Verify Public
      const publicUnis = await request('GET', '/api/universities/published'); // Assuming public route
      const found = publicUnis.body?.data?.find(u => u.name === "E2E Test University 2026");
      if (found) {
        console.log("✅ University appeared on public endpoint");
      } else {
        console.error("❌ University DID NOT appear on public endpoint");
      }

      // Update
      const editRes = await request('PUT', `/api/admin/universities/${testUniId}`, {
        name: "E2E Test University 2026 UPDATED",
        city: "Test City",
        sector: "Public"
      });
      if (editRes.status === 200) console.log("✅ University updated successfully");
      
      // Verify Public Update
      const publicUnis2 = await request('GET', '/api/universities/published');
      const foundUpdated = publicUnis2.body?.data?.find(u => u.name === "E2E Test University 2026 UPDATED");
      if (foundUpdated) console.log("✅ University update reflected on public endpoint");
      
      // Delete
      const deleteRes = await request('DELETE', `/api/admin/universities/${testUniId}`);
      if (deleteRes.status === 200) console.log("✅ University deleted via admin");
      else console.error("❌ Failed to delete university via admin", deleteRes.body);

      // Verify Deletion
      const publicUnis3 = await request('GET', '/api/universities/published');
      const foundDeleted = publicUnis3.body?.data?.find(u => u.id === testUniId);
      if (!foundDeleted) console.log("✅ University deletion reflected on public endpoint");
    }
  } catch(e) { console.error(e) }

  // 3. Test Guidance / Article
  console.log("\n[3] Testing Guidance/Articles Data Flow");
  let testArticleId = null;
  try {
    const createArticleRes = await request('POST', '/api/admin/articles', {
      title: "E2E Test Article 2026",
      category: "admission",
      readTimeMinutes: 5,
      author: "E2E Script",
      content: "This is a test content that has more than 50 characters so it passes the validation limit easily."
    });
    
    if (createArticleRes.status === 201 || createArticleRes.status === 200) {
      console.log("✅ Article created successfully");
      testArticleId = createArticleRes.body.data?.id;

      if (!testArticleId) {
        const getAdminArticles = await request('GET', '/api/admin/articles');
        testArticleId = getAdminArticles.body.data?.find(a => a.title === "E2E Test Article 2026")?.id;
      }
    } else {
      console.error("❌ Failed to create article", createArticleRes.body);
    }

    if (testArticleId) {
      // Verify Public
      const publicArticles = await request('GET', '/api/guidance'); 
      const found = publicArticles.body?.data?.find(a => a.title === "E2E Test Article 2026");
      if (found) console.log("✅ Article appeared on public endpoint");
      else console.error("❌ Article DID NOT appear on public endpoint", publicArticles.body);

      // Delete
      const deleteRes = await request('DELETE', `/api/admin/articles/${testArticleId}`);
      if (deleteRes.status === 200) console.log("✅ Article deleted via admin");
      else console.error("❌ Failed to delete article via admin", deleteRes.body);
    }
  } catch(e) { console.error(e) }

  // 4. Test Course
  console.log("\n[4] Testing Courses Data Flow");
  let testCourseId = null;
  try {
    const createCourseRes = await request('POST', '/api/admin/courses', {
      title: "E2E Test Course 2026",
      category: "admission_preparation",
      description: "This is a detailed description of the course that is over 20 characters long.",
      difficulty: "beginner",
      instructor: "E2E Script",
      durationHours: 10,
      modules: [{
        title: "Module 1",
        lessons: [{ title: "Lesson 1", durationMinutes: 10, videoUrl: "https://example.com/video" }]
      }],
      isFree: true
    });
    
    if (createCourseRes.status === 201 || createCourseRes.status === 200) {
      console.log("✅ Course created successfully");
      testCourseId = createCourseRes.body.data?.id;

      if (!testCourseId) {
        const getAdminCourses = await request('GET', '/api/admin/courses');
        testCourseId = getAdminCourses.body.data?.find(c => c.title === "E2E Test Course 2026")?.id;
      }
    } else {
      console.error("❌ Failed to create course", createCourseRes.body);
    }

    if (testCourseId) {
      // Verify Public
      const publicCourses = await request('GET', '/api/courses');
      const found = publicCourses.body?.data?.find(c => c.title === "E2E Test Course 2026");
      if (found) console.log("✅ Course appeared on public endpoint");
      else console.error("❌ Course DID NOT appear on public endpoint");

      // Delete
      const deleteRes = await request('DELETE', `/api/admin/courses/${testCourseId}`);
      if (deleteRes.status === 200) console.log("✅ Course deleted via admin");
      else console.error("❌ Failed to delete course via admin", deleteRes.body);
    }
  } catch(e) { console.error(e) }

  // 5. Test Scholarships
  console.log("\n[5] Testing Scholarships Data Flow");
  let testScholarshipId = null;
  try {
    const createScholarshipRes = await request('POST', '/api/admin/scholarships', {
      name: "E2E Test Scholarship 2026",
      type: "merit",
      minMarks: 85,
      provider: "E2E Foundation",
      description: "A test scholarship description for the e2e test run."
    });
    
    if (createScholarshipRes.status === 201 || createScholarshipRes.status === 200) {
      console.log("✅ Scholarship created successfully");
      testScholarshipId = createScholarshipRes.body.data?.id;
    } else {
      console.error("❌ Failed to create scholarship", createScholarshipRes.body);
    }

    if (testScholarshipId) {
      // Verify Public
      const publicScholarships = await request('GET', '/api/scholarships');
      const found = publicScholarships.body?.data?.find(s => s.name === "E2E Test Scholarship 2026");
      if (found) console.log("✅ Scholarship appeared on public endpoint");
      else console.error("❌ Scholarship DID NOT appear on public endpoint");

      // Verify Public By ID
      const singleRes = await request('GET', `/api/scholarships/${testScholarshipId}`);
      if (singleRes.status === 200 && singleRes.body?.data?.name === "E2E Test Scholarship 2026") {
        console.log("✅ Scholarship details fetched by ID successfully");
      } else {
        console.error("❌ Failed to fetch scholarship by ID", singleRes.body);
      }

      // Delete
      const deleteRes = await request('DELETE', `/api/admin/scholarships/${testScholarshipId}`);
      if (deleteRes.status === 200) console.log("✅ Scholarship deleted via admin");
      else console.error("❌ Failed to delete scholarship via admin", deleteRes.body);
    }
  } catch(e) { console.error(e) }

  // 6. Test Entry Tests
  console.log("\n[6] Testing Entry Tests Data Flow");
  let testEntryTestId = null;
  try {
    const createTestRes = await request('POST', '/api/admin/entry-tests', {
      name: "E2E Test Exam 2026",
      organizingBody: "Test Body",
      description: "Test description for entry test e2e script.",
      isActive: true
    });
    
    if (createTestRes.status === 201 || createTestRes.status === 200) {
      console.log("✅ Entry Test created successfully");
      testEntryTestId = createTestRes.body.data?.id;
    } else {
      console.error("❌ Failed to create Entry Test", createTestRes.body);
    }

    if (testEntryTestId) {
      // Verify Public
      const publicTests = await request('GET', '/api/entry-tests');
      const found = publicTests.body?.data?.find(t => t.name === "E2E Test Exam 2026");
      if (found) console.log("✅ Entry Test appeared on public endpoint");
      else console.error("❌ Entry Test DID NOT appear on public endpoint");

      // Verify Public By ID
      const singleRes = await request('GET', `/api/entry-tests/${testEntryTestId}`);
      if (singleRes.status === 200 && singleRes.body?.data?.name === "E2E Test Exam 2026") {
        console.log("✅ Entry Test details fetched by ID successfully");
      } else {
        console.error("❌ Failed to fetch Entry Test by ID", singleRes.body);
      }

      // Delete
      const deleteRes = await request('DELETE', `/api/admin/entry-tests/${testEntryTestId}`);
      if (deleteRes.status === 200) console.log("✅ Entry Test deleted via admin");
      else console.error("❌ Failed to delete Entry Test via admin", deleteRes.body);
    }
  } catch(e) { console.error(e) }

  console.log("\n=== E2E API VERIFICATION COMPLETE ===");
}

runTests();
