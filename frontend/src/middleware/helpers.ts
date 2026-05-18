/**
 * Middleware helpers — extend for auth checks, redirects, etc.
 * Next.js edge middleware lives in src/middleware.ts
 */

export const ADMIN_LOGIN_PATH = "/admin/login";

export function isAdminProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN_PATH;
}
