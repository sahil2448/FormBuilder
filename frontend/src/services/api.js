// services/api.js
import axios from "axios";

// const API_BASE_URL = "http://localhost:4000";
const PROD = "https://formbuilder-qpp8.onrender.com";

const api = axios.create({
  // baseURL: API_BASE_URL, // dev
  baseURL: PROD, // prod
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
