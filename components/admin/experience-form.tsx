"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
}

interface Experience {
  _id?: string
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

interface FormData {
  title: string
  description: string
  longDescription: string
  price: string
  duration: string
  location: string
  locationDescription: string
  category: string
  maxGuests: string
  included: string[]
  requirements: string[]
  languages: string[]
  cancellationPolicy: string
  status: string
  featured: boolean
}

interface ExperienceFormProps {
  experience?: Experience | null
  isNew?: boolean
}

export function ExperienceForm({ experience, isNew = true }: ExperienceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    duration: "",
    location: "",
    locationDescription: "",
    category: "",
    maxGuests: "",
    included: [],
    requirements: [],
    languages: [],
    cancellationPolicy: "moderate",
    status: "draft",
    featured: false,
  })

  useEffect(() => {
    fetchCategories()
    if (experience) {
      setFormData({
        title: experience.title || "",
        description: experience.description || "",
        longDescription: experience.longDescription || "",
        price: experience.price?.toString() || "",
        duration: experience.duration?.toString() || "",
        location: experience.location || "",
        locationDescription: experience.locationDescription || "",
        category: experience.category || "",
        maxGuests: experience.maxGuests?.toString() || "",
        included: experience.included || [],
        requirements: experience.requirements || [],
        languages: experience.languages || [],
        cancellationPolicy: experience.cancellationPolicy || "moderate",
        status: experience.status || "draft",
        featured: experience.featured || false,
      })
    }
  }, [experience])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/proxy/categories", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Categories data:", data)
        setCategories(data.data || [])
      } else {
        console.error("Failed to fetch categories:", response.status)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value === "" || !isNaN(Number(value))) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name: keyof FormData, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "")
    setFormData((prev) => ({ ...prev, [name]: items }))
  }

  const handleLanguagesChange = (value: string) => {
    const languages = value
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, languages }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Prepare data for submission
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price) || 0,
        duration: Number.parseFloat(formData.duration) || 1,
        maxGuests: Number.parseInt(formData.maxGuests) || 1,
        imageUrl: experience?.imageUrl || "/placeholder.svg?height=400&width=600",
      }

      console.log("Submitting experience data:", payload)

      const url = isNew ? "/api/proxy/experiences" : `/api/proxy/experiences/${experience?._id}`
      const method = isNew ? "POST" : "PUT"

      // Get the token from cookies
      const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      const token = cookies.token
      console.log("Token from cookies:", token ? "Found" : "Not found")

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status)

      let result
      try {
        result = await response.json()
        console.log("API Response:", result)
      } catch (jsonError) {
        const text = await response.text()
        console.error("Failed to parse JSON response:", text)
        throw new Error("Invalid response from server")
      }

      if (response.ok && result.success) {
        toast({
          title: isNew ? "Experience created" : "Experience updated",
          description: isNew
            ? `${formData.title} has been created successfully.`
            : `${formData.title} has been updated successfully.`,
        })
        router.push("/admin/experiences")
        router.refresh()
      } else {
        setDebugInfo(JSON.stringify(result, null, 2))
        throw new Error(result.message || `Failed to ${isNew ? "create" : "update"} experience`)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md overflow-auto max-h-40">
          <p className="font-mono text-xs">{debugInfo}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default">Default Category</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description *</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max Guests *</Label>
                <Input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  min="1"
                  value={formData.maxGuests}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationDescription">Location Description</Label>
              <Textarea
                id="locationDescription"
                name="locationDescription"
                value={formData.locationDescription}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Select
                value={formData.cancellationPolicy}
                onValueChange={(value) => handleSelectChange("cancellationPolicy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible (Full refund 24 hours before)</SelectItem>
                  <SelectItem value="moderate">Moderate (Full refund 5 days before)</SelectItem>
                  <SelectItem value="strict">Strict (No refunds)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
              />
              <Label htmlFor="featured">Featured (show on homepage)</Label>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <Label>What's Included</Label>
              <Textarea
                value={formData.included.join("\n")}
                onChange={(e) => handleArrayChange("included", e.target.value)}
                placeholder="Enter one item per line"
                rows={5}
              />
              <p className="text-sm text-muted-foreground">Enter one item per line</p>
            </div>

            <div className="space-y-4">
              <Label>Requirements</Label>
              <Textarea
                value={formData.requirements.join("\n")}
                onChange={(e) => handleArrayChange("requirements", e.target.value)}
                placeholder="Enter one requirement per line"
                rows={5}
              />
              <p className="text-sm text-muted-foreground">Enter one requirement per line</p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={formData.languages.join(", ")}
                onChange={(e) => handleLanguagesChange(e.target.value)}
                placeholder="English, Spanish, French"
              />
              <p className="text-sm text-muted-foreground">Separate languages with commas</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/experiences")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isNew ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Experience" : "Update Experience"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
