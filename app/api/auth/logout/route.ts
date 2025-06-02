import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear the token cookie
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    // Clear the user cookie
    cookieStore.set("user", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    // Clear the isLoggedIn cookie
    cookieStore.set("isLoggedIn", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error: unknown) {
    console.error("Logout error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
