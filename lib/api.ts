import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const buildAuthHeaders = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
