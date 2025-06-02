"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPreviewCardProps {
  imageUrl: string
  videoUrl?: string
  alt: string
  className?: string
  aspectRatio?: "portrait" | "square" | "video" | "wide"
  width?: number
  height?: number
}

export function VideoPreviewCard({
  imageUrl,
  videoUrl,
  alt,
  className,
  aspectRatio = "video",
  width,
  height,
}: VideoPreviewCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Map aspect ratio to Tailwind classes
  const aspectRatioClasses = {
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    video: "aspect-[4/3]",
    wide: "aspect-[16/9]",
  }

  // Handle mouse enter - start loading video
  const handleMouseEnter = () => {
    if (!videoUrl || isVideoError) return

    setIsHovering(true)

    // Add a small delay before starting video to avoid flickering on quick hover
    timeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err)
          setIsVideoError(true)
        })
      }
    }, 300)
  }

  // Handle mouse leave - pause video and reset
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsHovering(false)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsVideoLoaded(false)
    }
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-muted", aspectRatioClasses[aspectRatio], className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base image - always shown when not hovering or if video fails */}
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isHovering && isVideoLoaded && !isVideoError ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Video element - shown on hover */}
      {videoUrl && isHovering && !isVideoError && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              isVideoLoaded ? "opacity-100" : "opacity-0",
            )}
            muted
            playsInline
            loop
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoError(true)}
          />

          {/* Loading indicator */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
