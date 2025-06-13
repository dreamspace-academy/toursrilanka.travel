import type { NextRequest } from "next/server"
import { handleLogout } from "@/lib/auth0"

export async function GET(req: NextRequest) {
  try {
    return handleLogout(req, {
      returnTo: "/",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return new Response("Logout failed", { status: 500 })
  }
}
