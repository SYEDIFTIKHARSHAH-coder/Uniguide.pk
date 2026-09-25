import axios from "axios";

// Public API base URL (no auth required for discovering content)
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "") + "/api/guidance",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchLatestGuides = async () => {
  const response = await api.get("/latest");
  return response.data.data;
};

export const fetchGuidesByCategory = async (category) => {
  const response = await api.get(`/category/${category}`);
  return response.data.data;
};

export const fetchGuideDetail = async (id) => {
  const response = await api.get(`/article/${id}`);
  return response.data.data;
};
