"use client"

import { useState, useEffect } from "react"
import type { ExperienceVideo } from "@/types"

export function useExperienceVideos(experienceIds: string[]) {
  const [videos, setVideos] = useState<Record<string, ExperienceVideo[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip if no IDs provided
    if (!experienceIds.length) return

    const fetchVideos = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/videos/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ experienceIds }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const { data } = await response.json()
        setVideos(data)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [experienceIds.join(",")])

  return { videos, loading, error }
}
