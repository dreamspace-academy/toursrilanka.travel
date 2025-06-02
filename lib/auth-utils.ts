import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export function getAuthToken(request?: NextRequest): string | null {
  // Try to get token from cookie in request
  if (request) {
    const authCookie = request.cookies.get("auth_token")
    if (authCookie) {
      return authCookie.value
    }
  }

  // If no Authorization header, try to get token from Authorization header
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get("token")
  return tokenCookie?.value || null
}

export function getUserFromCookie(): any | null {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error("Error parsing user cookie:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.has("isLoggedIn")
}

export function isAdmin(): boolean {
  const user = getUserFromCookie()
  return user?.role === "admin"
}
