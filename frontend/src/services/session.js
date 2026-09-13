export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "authUser";
export const LEGACY_TOKEN_KEY = "authToken";

function clearLegacyLocalStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getAccessToken() {
  const access = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  if (
    !access &&
    (localStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      localStorage.getItem(USER_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY))
  ) {
    clearSession();
    return null;
  }

  return access;
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveTokens(access, refresh) {
  if (!access || !refresh) {
    throw new Error("La réponse d’authentification ne contient pas la paire JWT complète.");
  }

  sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  clearLegacyLocalStorage();
}

export function saveUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(USER_KEY);
}

export function saveSession(access, refresh, user) {
  saveTokens(access, refresh);
  saveUser(user);
}

export function clearSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  clearLegacyLocalStorage();
}
