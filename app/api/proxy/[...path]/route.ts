import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

async function handleRequest(request: NextRequest, method: string, pathSegments: string[]) {
  try {
    const path = pathSegments.join("/")
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const url = `${BACKEND_URL}/api/${path}${queryString ? `?${queryString}` : ""}`

    console.log(`🔄 Proxying ${method} request to: ${url}`)

    // Get the request body if it exists
    let body = undefined
    if (method !== "GET" && method !== "DELETE") {
      try {
        const contentType = request.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          body = await request.json()
          console.log("📦 Request body (JSON):", body)
        } else if (contentType.includes("multipart/form-data")) {
          body = await request.formData()
          console.log("📦 Request body (FormData):", Object.fromEntries(body.entries()))
        } else {
          body = await request.text()
          console.log("📦 Request body (Text):", body)
        }
      } catch (error) {
        console.log("❌ Error parsing request body:", error)
      }
    }

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const headers: HeadersInit = {}

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
      console.log("🔑 Token found and added to headers")
    } else {
      console.log("⚠️ No token found in cookies")
    }

    // Don't set content-type for FormData, let fetch handle it
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    console.log("📋 Request headers:", headers)

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    }

    // Add body if it exists
    if (body) {
      if (body instanceof FormData) {
        fetchOptions.body = body
      } else {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body)
      }
    }

    console.log("🚀 Making request to backend...")
    const response = await fetch(url, fetchOptions)

    console.log(`✅ Backend response status: ${response.status}`)
    console.log(`📄 Backend response headers:`, Object.fromEntries(response.headers.entries()))

    // Handle different response types
    const contentType = response.headers.get("content-type") || ""
    let responseData

    if (contentType.includes("application/json")) {
      try {
        responseData = await response.json()
        console.log("✅ Successfully parsed JSON response")
      } catch (error) {
        console.error("❌ Error parsing JSON response:", error)
        const text = await response.text()
        console.error("📄 Raw response text:", text.substring(0, 500))
        responseData = {
          success: false,
          message: "Invalid JSON response from server",
          error: text.substring(0, 500),
        }
      }
    } else if (contentType.includes("text/html")) {
      const htmlText = await response.text()
      console.error("❌ HTML error response received:", htmlText.substring(0, 500))

      // Extract error message from HTML if possible
      const errorMatch = htmlText.match(/<pre>([\s\S]*?)<\/pre>/)
      let errorMessage = "Server error"
      if (errorMatch && errorMatch[1]) {
        errorMessage = errorMatch[1].replace(/<br>/g, "\n").replace(/&nbsp;/g, " ")
      }

      responseData = {
        success: false,
        message: "Server returned HTML error",
        error: errorMessage,
        status: response.status,
        rawHtml: htmlText.substring(0, 1000),
      }
    } else {
      const text = await response.text()
      console.log("⚠️ Non-JSON response:", text.substring(0, 200) + "...")
      responseData = {
        success: false,
        message: "Unexpected response format from server",
        text: text.substring(0, 500),
      }
    }

    return NextResponse.json(responseData, { status: response.status })
  } catch (error: unknown) {
    console.error(`❌ Proxy error for ${method} request:`, error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    // Check if it's a connection error
    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot connect to backend server",
          error: `Backend server at ${BACKEND_URL} is not responding. Please ensure your backend server is running.`,
          suggestion: "Run 'npm start' in your server directory",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, "GET", params.path)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, "POST", params.path)
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, "PUT", params.path)
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, "DELETE", params.path)
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, "PATCH", params.path)
}
