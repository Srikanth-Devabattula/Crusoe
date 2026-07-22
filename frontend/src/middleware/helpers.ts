/**
 * Middleware helpers — extend for auth checks, redirects, etc.
 * Next.js edge middleware lives in src/middleware.ts
 */

export const ADMIN_LOGIN_PATH = "/admin/login";
export const STAFF_LOGIN_PATH = "/admin/user-login";

export const PUBLIC_ADMIN_PATHS = [ADMIN_LOGIN_PATH, STAFF_LOGIN_PATH] as const;

export function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function isAdminProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !isPublicAdminPath(pathname);
}
