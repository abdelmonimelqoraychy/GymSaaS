import { beforeEach, describe, expect, it } from "vitest";

import api from "./api";

class StorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

if (!globalThis.localStorage) globalThis.localStorage = new StorageMock();

beforeEach(() => localStorage.clear());

describe("intercepteur Axios", () => {
  it("n'envoie pas l'ancien token lorsque skipAuth est actif", async () => {
    localStorage.setItem("authToken", "ancien-token");
    const previousAdapter = api.defaults.adapter;

    api.defaults.adapter = async (config) => {
      expect(config.skipAuth).toBe(true);
      expect(config.headers?.Authorization).toBeUndefined();
      return { data: {}, status: 200, statusText: "OK", headers: {}, config, request: {} };
    };

    try {
      await api.post("/auth/login/", { username: "u", password: "p" }, { skipAuth: true });
    } finally {
      api.defaults.adapter = previousAdapter;
    }
  });
});
