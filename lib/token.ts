// src/lib/token.ts

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_EXP_KEY = "accessTokenExp";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function setAccessToken(token: string, exp: number) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_EXP_KEY, String(exp));
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAccessTokenExp(): number | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(ACCESS_TOKEN_EXP_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export function clearAccessToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXP_KEY);
}
