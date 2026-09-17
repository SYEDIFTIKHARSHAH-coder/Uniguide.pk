// Mocking Firebase Admin Firestore interactions
// In a real scenario, this would import `const db = require("../config/firebase-admin")`

export const addProgram = async (uniId, programData) => {
  // MOCK: Insert into Firestore -> db.collection("universities").doc(uniId).collection("programs").add(programData)
  return { id: "prog_123", ...programData };
};

export const getPrograms = async (uniId) => {
  // MOCK: Fetch from Firestore
  return [
    { id: "prog_1", name: "BS Computer Science", department: "Computing", degreeLevel: "Bachelors" },
    { id: "prog_2", name: "MS Artificial Intelligence", department: "Computing", degreeLevel: "Masters" }
  ];
};

export const openAdmissionCycle = async (uniId, cycleData) => {
  // MOCK: db.collection("admissions").add({ uniId, ...cycleData })
  return { id: "cycle_123", uniId, ...cycleData, status: "open" };
};

export const getApplications = async (uniId) => {
  // MOCK: db.collection("applications").where("universityId", "==", uniId).get()
  return [
    { id: "app_1", studentName: "Ali Khan", program: "BS CS", status: "pending", submittedAt: "2026-07-01T10:00:00Z" },
    { id: "app_2", studentName: "Sara Ahmed", program: "MS AI", status: "accepted", submittedAt: "2026-06-25T14:30:00Z" }
  ];
};

export const getDashboardAnalytics = async (uniId) => {
  // MOCK: Aggregate data for Recharts
  return {
    totalPrograms: 12,
    activeAdmissions: 2,
    totalApplications: 450,
    applicationsOverTime: [
      { name: "Jan", applications: 40 },
      { name: "Feb", applications: 70 },
      { name: "Mar", applications: 120 },
      { name: "Apr", applications: 220 }
    ],
    statusBreakdown: [
      { name: "Accepted", value: 150 },
      { name: "Rejected", value: 50 },
      { name: "Pending", value: 250 }
    ]
  };
};
