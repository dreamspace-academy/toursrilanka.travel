"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  createdAt: string
  updatedAt: string
}

export default function ExperiencesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/proxy/experiences")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched experiences:", data)
        setExperiences(data.data || [])
      } else {
        throw new Error("Failed to fetch experiences")
      }
    } catch (error) {
      console.error("Error fetching experiences:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load experiences"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (experience: Experience) => {
    setExperienceToDelete(experience)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!experienceToDelete) return

    try {
      const response = await fetch(`/api/proxy/experiences/${experienceToDelete._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        })
        fetchExperiences() // Refresh the list
      } else {
        throw new Error("Failed to delete experience")
      }
    } catch (error) {
      console.error("Error deleting experience:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete experience"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setExperienceToDelete(null)
    }
  }

  const filteredExperiences = experiences.filter(
    (experience) =>
      experience.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
        <Button asChild>
          <Link href="/admin/experiences/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Experiences ({experiences.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No experiences found matching your search." : "No experiences found."}
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/experiences/new">Create your first experience</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <Card key={experience._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={experience.imageUrl || "/placeholder.svg?height=192&width=384"}
                      alt={experience.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          experience.status === "published"
                            ? "default"
                            : experience.status === "draft"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {experience.status}
                      </Badge>
                    </div>
                    {experience.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{experience.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{experience.location}</span>
                      <span className="font-semibold">${experience.price}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">{experience.category}</span>
                      <span className="text-xs text-muted-foreground">{experience.duration}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/experiences/${experience._id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/experiences/${experience._id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(experience)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience "{experienceToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
