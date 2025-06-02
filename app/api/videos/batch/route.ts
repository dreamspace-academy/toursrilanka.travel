import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { experienceIds } = await request.json()

    if (!experienceIds || !Array.isArray(experienceIds)) {
      return NextResponse.json({ error: "Invalid request. Expected array of experienceIds" }, { status: 400 })
    }

    // Limit the number of IDs to prevent abuse
    const limitedIds = experienceIds.slice(0, 20)

    // Fetch videos for each experience in parallel
    const videoPromises = limitedIds.map(async (id) => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/experiences/${id}/videos`, {
          headers: {
            // Forward authorization if needed
            // 'Authorization': `Bearer ${token}`
          },
          cache: "no-store",
        })

        if (!response.ok) {
          return { experienceId: id, videos: [] }
        }

        const data = await response.json()
        return { experienceId: id, videos: data.data || [] }
      } catch (error) {
        console.error(`Error fetching videos for experience ${id}:`, error)
        return { experienceId: id, videos: [] }
      }
    })

    const results = await Promise.all(videoPromises)

    // Convert to a map for easier consumption
    const videosMap = results.reduce(
      (acc, { experienceId, videos }) => {
        acc[experienceId] = videos
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json({ success: true, data: videosMap })
  } catch (error) {
    console.error("Error in batch video fetch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
