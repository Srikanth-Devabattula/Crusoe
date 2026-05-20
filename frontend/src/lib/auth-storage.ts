import type { User } from "@/types";

export const ADMIN_TOKEN_KEY = "adminToken";
const USER_KEY = "adminUser";

/** Persist session for API (Bearer) and Next.js middleware (cookie on app domain) */
export function saveAuth(token: string, user: User) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  const maxAge = 7 * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  document.cookie = `${ADMIN_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}
