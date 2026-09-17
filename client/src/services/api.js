// ============================================================
// FILE: frontend/src/services/api.js
// PURPOSE: Creates a pre-configured Axios HTTP client.
//
// WHAT IS AXIOS?
//   Axios is a library that sends HTTP requests to our backend.
//   Think of it as a smarter version of fetch(). It can:
//   - Automatically convert responses to JSON
//   - Add authentication tokens to every request
//   - Handle errors in one place
//   - Set timeouts
//
// HOW IT'S USED:
//   import api from "@/services/api";
//   const response = await api.get("/universities");
//   const data = response.data;
//
// The "interceptors" below are like middleware — they run
// before every request (to add the auth token) and after
// every response (to handle errors consistently).
// ============================================================

import axios from "axios";
import { auth } from "@/config/firebase";

/**
 * Create an Axios instance with default settings.
 * All API calls in the app will use this instance.
 */
const api = axios.create({
  // Base URL — in development, Vite proxy forwards /api to localhost:5000
  // In production, this would be the deployed backend URL
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api')
        ? import.meta.env.VITE_API_BASE_URL
        : `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api`)
    : '/api',

  // Maximum time to wait for a response (15 seconds)
  // If the server doesn't respond in 15 seconds, the request fails
  timeout: 15000,

  // Tell the server we're sending and expecting JSON data
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR — runs BEFORE every API call
// ============================================================
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the currently logged-in user from Firebase
      const user = auth.currentUser;

      if (user) {
        // Get the user's authentication token
        // This token proves to our backend that the user is logged in
        const token = await user.getIdToken();

        // Attach the token to the request header
        // Our backend will read this to verify the user
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If getting the token fails, still send the request
      // (some endpoints like university search don't need auth)
      console.error("Failed to get auth token:", error);
    }

    return config;
  },
  (error) => {
    // If the interceptor itself fails, reject the request
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR — runs AFTER every API response
// ============================================================
api.interceptors.response.use(
  // Success handler — just pass the response through
  (response) => response,

  // Error handler — processes API errors consistently
  (error) => {
    // Extract useful error information
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Handle specific HTTP error codes
    switch (status) {
      case 401:
        // Unauthorized — token expired or invalid
        // In a future phase, we'll redirect to login here
        console.error("Authentication error: Please log in again.");
        break;

      case 403:
        // Forbidden — user doesn't have permission
        console.error("Access denied: You don't have permission.");
        break;

      case 404:
        // Not Found — the requested resource doesn't exist
        console.error("Resource not found.");
        break;

      case 500:
        // Server Error — something broke on the backend
        console.error("Server error. Please try again later.");
        break;

      default:
        console.error(`API Error (${status}): ${message}`);
    }

    // Re-throw the error so the calling code can handle it too
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
