import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/experiences") ||
    path.startsWith("/_next") ||
    path.includes("."); // Static files

  const sessionCookie = request.cookies.get("appSession"); // Auth0 default cookie name in Next.js SDK

  const isAuthenticated = !!sessionCookie;

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // You cannot reliably check user roles in middleware (cookie is encrypted),
  // so admin checks must happen in page-level/server-side logic.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|images|fonts).*)",
  ],
};
