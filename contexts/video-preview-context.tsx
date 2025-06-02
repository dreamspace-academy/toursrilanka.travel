"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface VideoPreviewContextType {
  videoUrls: Record<string, string[]>
  addVideoUrl: (experienceId: string, url: string) => void
  getVideoUrls: (experienceId: string) => string[]
  getFirstVideoUrl: (experienceId: string) => string | null
}

const VideoPreviewContext = createContext<VideoPreviewContextType | undefined>(undefined)

export function VideoPreviewProvider({ children }: { children: ReactNode }) {
  const [videoUrls, setVideoUrls] = useState<Record<string, string[]>>({})

  const addVideoUrl = (experienceId: string, url: string) => {
    setVideoUrls((prev) => {
      const existingUrls = prev[experienceId] || []
      return {
        ...prev,
        [experienceId]: [...existingUrls, url],
      }
    })
  }

  const getVideoUrls = (experienceId: string) => {
    return videoUrls[experienceId] || []
  }

  const getFirstVideoUrl = (experienceId: string) => {
    const urls = videoUrls[experienceId] || []
    return urls.length > 0 ? urls[0] : null
  }

  return (
    <VideoPreviewContext.Provider value={{ videoUrls, addVideoUrl, getVideoUrls, getFirstVideoUrl }}>
      {children}
    </VideoPreviewContext.Provider>
  )
}

export function useVideoPreview() {
  const context = useContext(VideoPreviewContext)
  if (context === undefined) {
    return {
      videoUrls: {},
      addVideoUrl: () => {},
      getVideoUrls: () => [],
      getFirstVideoUrl: () => null,
    }
  }
  return context
}
