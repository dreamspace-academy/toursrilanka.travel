import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.error || "Login failed" }, { status: response.status })
    }

    // Set the token in cookies
    const cookieStore = await cookies()
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: data.user,
    })
  } catch (error: unknown) {
    console.error("Login error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
