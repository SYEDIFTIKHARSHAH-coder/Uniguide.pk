import axios from "axios";

// Setup base axios instance
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "") + "/api/university",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Firebase Auth Token (Mocking this behavior)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // In reality, fetch from Firebase Auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchDashboardAnalytics = async () => {
  const response = await api.get("/dashboard");
  return response.data.data;
};

export const fetchPrograms = async () => {
  const response = await api.get("/programs");
  return response.data.data;
};

export const createProgram = async (programData) => {
  const response = await api.post("/programs", programData);
  return response.data.data;
};

export const createAdmissionCycle = async (cycleData) => {
  const response = await api.post("/admissions", cycleData);
  return response.data.data;
};

export const fetchApplications = async () => {
  const response = await api.get("/applications");
  return response.data.data;
};
