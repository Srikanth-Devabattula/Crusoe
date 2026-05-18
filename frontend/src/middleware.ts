import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin route protection placeholder.
 * Extend with JWT/cookie validation when auth is implemented.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminProtected =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isAdminProtected) {
    const token = request.cookies.get("authToken")?.value;

    // Placeholder: redirect to login if no token cookie
    // Client-side localStorage token won't be available here — wire cookies in auth flow
    if (!token) {
      // Uncomment when cookie-based auth is ready:
      // return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
