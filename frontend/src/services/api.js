import axios from "axios";

const api = axios.create({
  // Django local
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export function extractList(response) {
  const data = response?.data;

  // DRF sans pagination
  if (Array.isArray(data)) {
    return data;
  }

  // DRF avec pagination
  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

export default api;
