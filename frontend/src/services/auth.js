import api from "./api";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(username, password) {
  const response = await api.post("/auth/login/", {
    username,
    password,
  });

  saveSession(response.data.token, response.data.user);
  return response.data.user;
}

export async function logout() {
  try {
    await api.post("/auth/logout/");
  } finally {
    clearSession();
  }
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me/");
  localStorage.setItem(USER_KEY, JSON.stringify(response.data));
  return response.data;
}
