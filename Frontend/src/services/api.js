import axios from "axios";

/*
  IMPORTANT — In your Vercel dashboard, set this environment variable:
  VITE_API_URL = https://growacademy.onrender.com

  For local dev, create a .env.local file in your frontend folder:
  VITE_API_URL = http://localhost:5000
*/
const API = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL || "https://growacademy.onrender.com") +
    "/api/v1",
  timeout: 30000, // 30s — needed for Render cold starts
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ───────────────────────────────────
// Automatically attaches JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── RESPONSE INTERCEPTOR ──────────────────────────────────
// 1. Retries on network errors (Render cold start fix)
// 2. Auto-logout on 401

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000; // wait 3s before retrying

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config;

    const isNetworkError =
      error.code === "ERR_NETWORK" || error.code === "ECONNRESET";
    const isServerAsleep = error.response?.status === 503;
    const isTimeout = error.code === "ECONNABORTED";

    // Retry on network error / 503 / timeout — signs of Render waking up
    if (isNetworkError || isServerAsleep || isTimeout) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        console.warn(
          `[API] Request failed (${error.code}). Retrying ${config._retryCount}/${MAX_RETRIES} in ${RETRY_DELAY_MS / 1000}s...`,
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return API(config);
      }
    }

    // Auto logout when token is expired or invalid
    if (error.response?.status === 401) {
      console.warn("[API] Unauthorized — clearing session");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default API;
