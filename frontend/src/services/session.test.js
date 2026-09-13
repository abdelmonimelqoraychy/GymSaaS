import { beforeEach, describe, expect, it } from "vitest";

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveSession,
  saveUser,
} from "./session";

class StorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

if (!globalThis.localStorage) globalThis.localStorage = new StorageMock();
if (!globalThis.sessionStorage) globalThis.sessionStorage = new StorageMock();

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("stockage de session", () => {
  it("conserve les jetons uniquement pendant la session de l’onglet", () => {
    saveSession("access", "refresh", { username: "demo" });

    expect(getAccessToken()).toBe("access");
    expect(getRefreshToken()).toBe("refresh");
    expect(getStoredUser()).toEqual({ username: "demo" });
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });

  it("met à jour l’utilisateur dans le même stockage sécurisé", () => {
    saveUser({ username: "demo", role: "MEMBER" });

    expect(getStoredUser()).toEqual({
      username: "demo",
      role: "MEMBER",
    });
    expect(localStorage.getItem("authUser")).toBeNull();
  });

  it("supprime une ancienne session persistante", () => {
    localStorage.setItem("accessToken", "ancien-access");
    localStorage.setItem("refreshToken", "ancien-refresh");
    localStorage.setItem("authUser", JSON.stringify({ username: "ancien" }));

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("authUser")).toBeNull();
  });

  it("efface entièrement la session", () => {
    saveSession("access", "refresh", { username: "demo" });
    clearSession();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
