import { getSession, withApiAuthRequired } from "@/lib/auth0"
import { type NextRequest, NextResponse } from "next/server"

export const GET = withApiAuthRequired(async function handler(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if the user has admin role in Auth0
    const isAdmin = session.user["https://toursrilanka.com/roles"]?.includes("admin")

    return NextResponse.json({
      user: {
        ...session.user,
        role: isAdmin ? "admin" : "user",
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ error: "Failed to get user profile" }, { status: 500 })
  }
})
