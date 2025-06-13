"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Experience } from "@/types"

interface ExperienceCardProps {
  experience: Experience
  variant?: "default" | "compact"
}

export function ExperienceCard({ experience, variant = "default" }: ExperienceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Safely access experience ID
  const experienceId = experience?.id || experience?._id || "unknown"

  // Ensure experience object exists and has required properties
  if (!experience) {
    return null
  }

  // Create image gallery from main image and additional images
  const images = [
    experience.imageUrl || "/placeholder.svg",
    // Safely access images array and create data URLs
    ...(experience.images?.map((img) => {
      if (img.data && img.contentType) {
        return `data:${img.contentType};base64,${img.data}`
      }
      return img.url || "/placeholder.svg"
    }) || []),
  ].filter(Boolean) // Remove any undefined/null values

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="group">
      <Link href={`/experiences/${experienceId}`}>
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <div className="absolute inset-0">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={experience.title || "Experience"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white z-10"
              onClick={toggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "fill-[#ff385c] text-[#ff385c]" : "")} />
              <span className="sr-only">Add to favorites</span>
            </Button>

            {/* Guest favorite badge */}
            {experience.featured && (
              <Badge className="absolute top-2 left-2 bg-white text-black hover:bg-white/90">Guest favorite</Badge>
            )}

            {/* Image navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/80 hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <span className="sr-only">Previous image</span>
                  &lt;
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/80 hover:bg-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <span className="sr-only">Next image</span>
                  &gt;
                </Button>
              </>
            )}

            {/* Image navigation dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {images.length > 1 &&
                images.map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1.5 w-1.5 rounded-full", i === currentImageIndex ? "bg-white" : "bg-white/60")}
                  />
                ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <h3 className="font-medium text-sm line-clamp-1">{experience.location || "Unknown location"}</h3>
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-current mr-1" />
                <span className="text-sm">{experience.rating || "N/A"}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-1">{experience.title || "Untitled experience"}</p>

            <p className="text-sm">
              <span className="font-semibold">From ${experience.price || 0}</span>
              <span className="text-gray-500"> / person</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
