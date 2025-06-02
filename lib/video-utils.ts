import type { ExperienceVideo } from "@/types"

/**
 * Fetches videos for a specific experience
 * @param experienceId The ID of the experience
 * @returns Array of videos or undefined if there was an error
 */
export async function fetchExperienceVideos(experienceId: string): Promise<ExperienceVideo[] | undefined> {
  try {
    const response = await fetch(`/api/proxy/experiences/${experienceId}/videos`)
    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching experience videos:", error)
    return undefined
  }
}

/**
 * Gets the first video URL for an experience
 * @param experienceId The ID of the experience
 * @returns The URL of the first video or undefined if none exists
 */
export async function getFirstVideoUrl(experienceId: string): Promise<string | undefined> {
  const videos = await fetchExperienceVideos(experienceId)
  return videos && videos.length > 0 ? videos[0].url : undefined
}
