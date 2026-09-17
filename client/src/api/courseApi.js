import axios from "axios";

const publicApi = axios.create({
  baseURL: "/api/courses",
  headers: { "Content-Type": "application/json" },
});

const authApi = axios.create({
  baseURL: "/api/courses",
  headers: { "Content-Type": "application/json" },
});

import { auth } from "../config/firebase.js";

// Inject token for authenticated requests
authApi.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get auth token for course API:", error);
  }
  return config;
});

export const fetchCourses = async (category = "all") => {
  const response = await publicApi.get(`/?category=${category}`);
  return response.data.data;
};

export const fetchCourseDetail = async (id) => {
  const response = await publicApi.get(`/${id}`);
  return response.data.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await authApi.post(`/${courseId}/enroll`);
  return response.data.data;
};

export const fetchMyCourses = async () => {
  const response = await authApi.get("/student/my-courses");
  return response.data.data;
};
