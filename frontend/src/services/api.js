import axios from "axios";

const api = axios.create({
  // En local Vite proxifie /api vers Django (voir vite.config.js).
  // En production, définir VITE_API_URL si l'API est sur un autre domaine.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token && !config.skipAuth) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const skipAuth = Boolean(error.config?.skipAuth);

    // Un 401 sur une route protégée invalide la session locale.
    // Les 401 de login public restent intacts pour conserver le message Django.
    if (status === 401 && !skipAuth) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("gymsaas:auth-expired"));
      }
    }

    return Promise.reject(error);
  },
);

export function extractList(response) {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function getApiError(error, fallback = "Une erreur est survenue.") {
  const data = error?.response?.data;

  if (!data) {
    return error?.message === "Network Error"
      ? "Impossible de joindre le serveur. Vérifiez que Django est lancé."
      : fallback;
  }

  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === "string") return value;
  }

  return fallback;
}

export function getFieldErrors(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(" ") : String(value),
    ]),
  );
}

export default api;
