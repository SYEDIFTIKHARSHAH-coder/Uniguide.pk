// Mocking Firebase Admin Firestore interactions

export const getStudentApplications = async (studentId) => {
  // MOCK: Fetch applications for this student from DB
  return [
    {
      id: "app_991",
      universityName: "National University of Sciences and Technology (NUST)",
      program: "BS Computer Science",
      status: "Under Review",
      paymentStatus: "Completed",
      submittedAt: "2026-06-15T09:00:00Z",
    },
    {
      id: "app_992",
      universityName: "FAST NUCES",
      program: "BS Software Engineering",
      status: "Pending Payment",
      paymentStatus: "Pending",
      submittedAt: "2026-07-01T14:20:00Z",
    }
  ];
};

export const getApplicationDetail = async (studentId, appId) => {
  // MOCK: Fetch detailed app
  return {
    id: appId,
    universityName: "National University of Sciences and Technology (NUST)",
    program: "BS Computer Science",
    status: "Under Review",
    paymentStatus: "Completed",
    submittedAt: "2026-06-15T09:00:00Z",
    statusHistory: [
      { status: "Draft", date: "2026-06-10T10:00:00Z", note: "Application started" },
      { status: "Submitted", date: "2026-06-15T09:00:00Z", note: "Application submitted successfully" },
      { status: "Payment Verified", date: "2026-06-16T11:00:00Z", note: "Fee payment confirmed" },
      { status: "Under Review", date: "2026-06-20T08:00:00Z", note: "Documents are being reviewed" }
    ],
    documents: [
      { id: "doc_1", name: "CNIC Front.pdf", verified: true },
      { id: "doc_2", name: "FSC Transcript.pdf", verified: true },
      { id: "doc_3", name: "Matric Certificate.pdf", verified: true }
    ]
  };
};

export const withdrawApplication = async (studentId, appId, reason) => {
  // MOCK: Check if app belongs to student, then update status to "Withdrawn"
  // User confirmed withdrawal is allowed even if "Under Review"
  return {
    success: true,
    message: "Application withdrawn successfully",
    withdrawnAt: new Date().toISOString()
  };
};
