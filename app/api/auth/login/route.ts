import { type NextRequest, NextResponse } from "next/server"
import { handleLogin } from "@/lib/auth0"

export async function GET(req: NextRequest) {
  try {
    // Get the role from the query string
    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get("role") || "user"

    // Set the role in the Auth0 login request
    return handleLogin(req, {
      authorizationParams: {
        // Pass the role as a custom parameter
        role: role,
        // Redirect back to the home page after login
        redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback?role=${role}`,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
