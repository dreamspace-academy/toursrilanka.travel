import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

async function handleRequest(request: NextRequest, method: string, path: string) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const url = `${BACKEND_URL}/api/${path}${queryString ? `?${queryString}` : ""}`

    console.log(`Proxying ${method} request to: ${url}`)

    // Get the request body if it exists
    let body = undefined
    if (method !== "GET" && method !== "DELETE") {
      body = await request.json()
    }

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    })

    const data = await response.json()

    console.log(`Backend response status: ${response.status}`)

    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    console.error(`Proxy error for ${method} request:`, error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  return handleRequest(request, "GET", path)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  return handleRequest(request, "POST", path)
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  return handleRequest(request, "PUT", path)
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  return handleRequest(request, "DELETE", path)
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  return handleRequest(request, "PATCH", path)
}
