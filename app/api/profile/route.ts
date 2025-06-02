import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")?.value
    const isLoggedInCookie = cookieStore.get("isLoggedIn")?.value

    if (!userCookie || !isLoggedInCookie) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const user = JSON.parse(userCookie)
    return NextResponse.json({ success: true, user })
  } catch (error: unknown) {
    console.error("Profile error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
