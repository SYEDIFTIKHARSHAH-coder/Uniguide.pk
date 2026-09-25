import axios from "axios";

// Public API base URL (no auth required for discovery)
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "") + "/api/entry-tests",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchEntryTests = async () => {
  const response = await api.get("/");
  return response.data.data;
};

export const fetchTestCalendar = async () => {
  const response = await api.get("/calendar");
  return response.data.data;
};

export const fetchEntryTestDetail = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};
