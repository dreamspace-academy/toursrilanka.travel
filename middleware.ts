import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/experiences") ||
    path.startsWith("/_next") ||
    path.includes(".") // Static files

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("isLoggedIn")

  // Get user data for role-based access
  const userCookie = request.cookies.get("user")
  let isAdmin = false

  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.value)
      isAdmin = userData.role === "admin"
    } catch (e) {
      console.error("Error parsing user cookie:", e)
    }
  }

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Redirect to login if trying to access protected route while not authenticated
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && (path === "/login" || path === "/register")) {
    // Redirect to home if trying to access login/register while authenticated
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check admin routes
  if (path.startsWith("/admin") && !isAdmin) {
    // Redirect non-admin users trying to access admin routes
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (static font files)
     * 4. /images/* (static image files)
     * 5. /favicon.ico, /site.webmanifest (static files)
     */
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|images|fonts).*)",
  ],
}
