import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, isAdminProtectedPath } from "@/middleware/helpers";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminProtectedPath(pathname)) {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
