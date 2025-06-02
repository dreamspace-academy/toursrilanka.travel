import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/settings`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If settings don't exist, return default settings
      if (response.status === 404) {
        const defaultSettings = {
          siteName: "Tour Sri Lanka",
          siteDescription: "Find and book unique travel experiences in Sri Lanka",
          logo: "/logo.png",
          contactEmail: "contact@toursrilanka.com",
          contactPhone: "+94 123 456 789",
          address: "123 Main Street, Colombo, Sri Lanka",
          socialLinks: {
            facebook: "https://facebook.com/toursrilanka",
            twitter: "https://twitter.com/toursrilanka",
            instagram: "https://instagram.com/toursrilanka",
          },
          colors: {
            primary: "#0070f3",
            secondary: "#ff4081",
          },
          currency: "LKR",
          bookingFee: 5,
          taxRate: 10,
          featuredExperiences: [],
          maintenanceMode: false,
        }

        return NextResponse.json({
          success: true,
          data: defaultSettings,
        })
      }
      throw new Error("Failed to fetch settings")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching settings:", error)

    // Return default settings on error
    const defaultSettings = {
      siteName: "Tour Sri Lanka",
      siteDescription: "Find and book unique travel experiences in Sri Lanka",
      logo: "/logo.png",
      contactEmail: "contact@toursrilanka.com",
      contactPhone: "+94 123 456 789",
      address: "123 Main Street, Colombo, Sri Lanka",
      socialLinks: {
        facebook: "https://facebook.com/toursrilanka",
        twitter: "https://twitter.com/toursrilanka",
        instagram: "https://instagram.com/toursrilanka",
      },
      colors: {
        primary: "#0070f3",
        secondary: "#ff4081",
      },
      currency: "LKR",
      bookingFee: 5,
      taxRate: 10,
      featuredExperiences: [],
      maintenanceMode: false,
    }

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()

    // Get the token from the cookies
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch(`${process.env.BACKEND_URL}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to update settings")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 })
  }
}
