import axios from "axios";

const publicApi = axios.create({
  baseURL: "/api/utilities",
  headers: { "Content-Type": "application/json" },
});

const authApi = axios.create({
  baseURL: "/api/utilities",
  headers: { "Content-Type": "application/json" },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Reviews
export const fetchReviews = async (targetId, targetType) => {
  const response = await publicApi.get(`/reviews?targetId=${targetId}&targetType=${targetType}`);
  return response.data.data;
};

export const postReview = async (reviewData) => {
  const response = await authApi.post("/reviews", reviewData);
  return response.data.data;
};

// Favorites
export const fetchFavorites = async (type = "all") => {
  const response = await authApi.get(`/favorites?type=${type}`);
  return response.data.data;
};

export const toggleFavorite = async (favoriteData) => {
  const response = await authApi.post("/favorites/toggle", favoriteData);
  return response.data.data;
};

export const checkFavoriteStatus = async (targetId) => {
  const response = await authApi.get(`/favorites/${targetId}/check`);
  return response.data.data.isFavorite;
};
