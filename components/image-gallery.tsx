"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Star, StarOff } from "lucide-react"
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

interface ExperienceImage {
    _id: string
    title: string
    description: string
    url: string
    isMain: boolean
    size: number
    uploadedAt: string
}

interface ImageGalleryProps {
    experienceId: string
}

export function ImageGallery({ experienceId }: ImageGalleryProps) {
    const [images, setImages] = useState<ExperienceImage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [imageToDelete, setImageToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSettingMain, setIsSettingMain] = useState<string | null>(null)
    const { isHost, isAdmin } = useAuth()

    const fetchImages = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/proxy/experiences/${experienceId}/images`)
            if (!response.ok) {
                throw new Error("Failed to fetch images")
            }
            const data = await response.json()
            setImages(data.data)
        } catch (err: any) {
            setError(err.message || "Error fetching images")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchImages()
    }, [experienceId])

    const handleUploadComplete = (newImage: ExperienceImage) => {
        setImages((prev) => [...prev, newImage])
    }

    const handleDeleteClick = (imageId: string) => {
        setImageToDelete(imageId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!imageToDelete) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/proxy/experiences/${experienceId}/images/${imageToDelete}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete image")
            }

            setImages((prev) => prev.filter((img) => img._id !== imageToDelete))
        } catch (err: any) {
            setError(err.message || "Error deleting image")
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setImageToDelete(null)
        }
    }

    const handleSetMainImage = async (imageId: string) => {
        setIsSettingMain(imageId)
        try {
            const response = await fetch(`/api/proxy/experiences/${experienceId}/images/${imageId}/main`, {
                method: "PUT",
            })

            if (!response.ok) {
                throw new Error("Failed to set main image")
            }

            // Update the images state
            setImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    isMain: img._id === imageId,
                })),
            )
        } catch (err: any) {
            setError(err.message || "Error setting main image")
        } finally {
            setIsSettingMain(null)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
                <Button onClick={fetchImages} variant="outline" className="mt-2">
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue={images.length > 0 ? "images" : "upload"}>
                <TabsList>
                    <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
                    {(isHost || isAdmin) && <TabsTrigger value="upload">Upload New Image</TabsTrigger>}
                </TabsList>

                <TabsContent value="images">
                    {images.length === 0 ? (
                        <div className="text-center p-8 border rounded-md">
                            <p className="text-muted-foreground mb-4">No images available for this experience yet.</p>
                            {(isHost || isAdmin) && (
                                <Button
                                    onClick={() => {
                                        const tab = document.querySelector('[data-value="upload"]')
                                        if (tab instanceof HTMLElement) {
                                            tab.click()
                                        }
                                    }}
                                >
                                    Upload Your First Image
                                </Button>

                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((image) => (
                                <Card key={image._id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <img
                                                src={image.url || "/placeholder.svg"}
                                                alt={image.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            {image.isMain && (
                                                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Main Image
                                                </div>
                                            )}
                                            {(isHost || isAdmin) && (
                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white/80"
                                                        onClick={() => handleSetMainImage(image._id)}
                                                        disabled={image.isMain || isSettingMain === image._id}
                                                        title={image.isMain ? "Already main image" : "Set as main image"}
                                                    >
                                                        {isSettingMain === image._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : image.isMain ? (
                                                            <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                                                        ) : (
                                                            <StarOff className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white/80"
                                                        onClick={() => handleDeleteClick(image._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium truncate">{image.title}</h4>
                                            {image.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{image.description}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                                <span>{formatFileSize(image.size)}</span>
                                                <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {(isHost || isAdmin) && (
                    <TabsContent value="upload">
                        <ImageUpload experienceId={experienceId} onUploadComplete={handleUploadComplete} />
                    </TabsContent>
                )}
            </Tabs>

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the image.
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
