"use client"

import { useState, useEffect } from "react"
import { VideoPlayer } from "@/components/video-player"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoUpload } from "@/components/video-upload"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
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

interface Video {
  _id: string
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: number
}

interface VideoGalleryProps {
  experienceId: string
}

export function VideoGallery({ experienceId }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { isHost, isAdmin } = useAuth()

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/proxy/experiences/${experienceId}/videos`)
      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }
      const data = await response.json()
      setVideos(data.data)

      // Select the first video by default if available
      if (data.data.length > 0 && !selectedVideo) {
        setSelectedVideo(data.data[0])
      }
    } catch (err: any) {
      setError(err.message || "Error fetching videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [experienceId])

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video)
  }

  const handleUploadComplete = (newVideo: Video) => {
    setVideos((prev) => [...prev, newVideo])
    setSelectedVideo(newVideo)
  }

  const handleDeleteClick = (videoId: string) => {
    setVideoToDelete(videoId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/proxy/experiences/${experienceId}/videos/${videoToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete video")
      }

      // Remove the deleted video from the list
      setVideos((prev) => prev.filter((v) => v._id !== videoToDelete))

      // If the deleted video was selected, select another one
      if (selectedVideo && selectedVideo._id === videoToDelete) {
        const remainingVideos = videos.filter((v) => v._id !== videoToDelete)
        setSelectedVideo(remainingVideos.length > 0 ? remainingVideos[0] : null)
      }
    } catch (err: any) {
      setError(err.message || "Error deleting video")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVideoToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        <p>{error}</p>
        <Button onClick={fetchVideos} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={videos.length > 0 ? "videos" : "upload"}>
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          {(isHost || isAdmin) && <TabsTrigger value="upload">Upload New Video</TabsTrigger>}
        </TabsList>

        <TabsContent value="videos">
          {videos.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground mb-4">No videos available for this experience yet.</p>
              {(isHost || isAdmin) && (
                <Button onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
                  Upload Your First Video
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main video player */}
              {selectedVideo && (
                <div className="aspect-video">
                  <VideoPlayer src={selectedVideo.url} poster={selectedVideo.thumbnail} title={selectedVideo.title} />
                </div>
              )}

              {/* Video description */}
              {selectedVideo && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                  {selectedVideo.description && <p className="text-muted-foreground">{selectedVideo.description}</p>}
                </div>
              )}

              {/* Video thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <Card
                    key={video._id}
                    className={`cursor-pointer transition-all ${selectedVideo?._id === video._id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-video bg-muted relative rounded overflow-hidden">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">No thumbnail</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {video.duration
                              ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, "0")}`
                              : ""}
                          </span>

                          {(isHost || isAdmin) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(video._id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {(isHost || isAdmin) && (
          <TabsContent value="upload">
            <VideoUpload experienceId={experienceId} onUploadComplete={handleUploadComplete} />
          </TabsContent>
        )}
      </Tabs>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
