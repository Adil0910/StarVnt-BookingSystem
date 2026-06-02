import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://starvnt-bookingsystm-1.onrender.com",
});

// Har request me token auto-attach
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;