"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { ExperienceForm } from "@/components/admin/experience-form"
import { useToast } from "@/hooks/use-toast"

interface Experience {
  _id: string
  title: string
  description: string
  longDescription: string
  price: number
  duration: number
  location: string
  locationDescription: string
  category: string
  maxGuests: number
  included: string[]
  requirements: string[]
  languages: string[]
  cancellationPolicy: string
  status: string
  featured: boolean
  imageUrl?: string
}

export default function ExperienceEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const isNew = params.id === "new"

  useEffect(() => {
    if (!isNew) {
      fetchExperience()
    } else {
      setLoading(false)
    }
  }, [params.id, isNew])

  const fetchExperience = async () => {
    try {
      const response = await fetch(`/api/proxy/experiences/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setExperience(data.data)
      } else if (response.status === 404) {
        setNotFound(true)
      } else {
        throw new Error("Failed to fetch experience")
      }
    } catch (error) {
      console.error("Error fetching experience:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load experience"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
        <p className="text-muted-foreground mb-4">The experience you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/admin/experiences">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiences
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/experiences">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiences
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? "Create New Experience" : `Edit: ${experience?.title || "Experience"}`}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? "Create a new experience for your platform." : "Update the experience details below."}
        </p>
      </div>

      <ExperienceForm experience={experience} isNew={isNew} />
    </div>
  )
}
