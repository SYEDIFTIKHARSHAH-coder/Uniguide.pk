import axios from "axios";

const api = axios.create({
  baseURL: "/api/notifications",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchNotifications = async () => {
  const response = await api.get("/");
  return response.data.data;
};

export const fetchUnreadCount = async () => {
  const response = await api.get("/unread-count");
  return response.data.data.unreadCount;
};

export const markNotificationsRead = async (notificationIds) => {
  const response = await api.post("/mark-read", { notificationIds });
  return response.data.data;
};
