import type { NextRequest } from "next/server"
import { handleCallback } from "@/lib/auth0"

export async function GET(req: NextRequest) {
  try {
    // Get the role from the query string
    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get("role") || "user"

    // Handle the callback and redirect based on role
    return handleCallback(req, {
      redirectUri: role === "admin" ? "/admin" : "/",
    })
  } catch (error) {
    console.error("Callback error:", error)
    return new Response("Authentication callback failed", { status: 500 })
  }
}
