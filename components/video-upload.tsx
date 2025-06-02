"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface VideoUploadProps {
  experienceId: string
  onUploadComplete?: (videoData: any) => void
}

export function VideoUpload({ experienceId, onUploadComplete }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = e.target.files[0].name.split(".")[0]
        setTitle(fileName)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a video file")
      return
    }

    setUploading(true)
    setProgress(0)
    setError("")

    // Create form data
    const formData = new FormData()
    formData.append("video", file)
    formData.append("title", title)
    formData.append("description", description)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 500)

      // Send to API
      const response = await fetch(`/api/proxy/experiences/${experienceId}/videos`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary
        headers: {
          // Add authorization if needed
          // 'Authorization': `Bearer ${token}`
        },
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload video")
      }

      setProgress(100)
      const data = await response.json()

      if (onUploadComplete) {
        onUploadComplete(data.data)
      }

      // Reset form
      setFile(null)
      setTitle("")
      setDescription("")

      // Show success briefly before resetting progress
      setTimeout(() => {
        setProgress(0)
        setUploading(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Error uploading video")
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="video" className="block text-sm font-medium">
              Video File
            </label>
            {file ? (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="truncate max-w-[200px]">{file.name}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} disabled={uploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop your video here or click to browse</p>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("video")?.click()}
                  disabled={uploading}
                >
                  Select Video
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              disabled={uploading}
            />
          </div>

          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={!file || uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Video"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
