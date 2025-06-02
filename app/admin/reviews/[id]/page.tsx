"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToastContext } from "@/contexts/toast-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, CheckCircle, XCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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

interface Review {
  _id: string
  title: string
  comment: string
  rating: number
  user: {
    _id: string
    name: string
    email: string
    avatar: string
  }
  experience: {
    _id: string
    title: string
    imageUrl: string
  }
  booking: {
    _id: string
    bookingNumber: string
  }
  status: string
  hostResponse?: {
    text: string
    createdAt: string
  }
  photos?: string[]
  createdAt: string
}

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const { showToast } = useToastContext()
  const router = useRouter()

  useEffect(() => {
    fetchReview()
  }, [params.id])

  const fetchReview = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/proxy/reviews/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch review")
      }
      const data = await response.json()
      setReview(data.data)
    } catch (error) {
      console.error("Error fetching review:", error)
      showToast("Error", "Failed to load review", "destructive")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    setNewStatus(status)
    setStatusDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!review) return

    try {
      const endpoint = newStatus === "approved" ? "approve" : "reject"
      const response = await fetch(`/api/proxy/reviews/${review._id}/${endpoint}`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to update review status")
      }

      // Update the review status
      setReview((prev) => (prev ? { ...prev, status: newStatus } : null))
      showToast("Success", "Review status updated successfully", "success")
    } catch (error) {
      console.error("Error updating review status:", error)
      showToast("Error", "Failed to update review status", "destructive")
    } finally {
      setStatusDialogOpen(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="ml-2">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Review Not Found</h2>
        <p className="text-muted-foreground mb-4">The review you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/reviews">Back to Reviews</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/reviews">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reviews
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {review.status === "pending" && (
            <>
              <Button onClick={() => handleStatusChange("approved")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Review
              </Button>
              <Button variant="destructive" onClick={() => handleStatusChange("rejected")}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Review
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Review Details</h1>
        <Badge
          variant={
            review.status === "approved" ? "default" : review.status === "rejected" ? "destructive" : "secondary"
          }
          className="text-sm py-1 px-3"
        >
          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{review.title}</h2>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p className="text-muted-foreground">
                Posted on {new Date(review.createdAt).toLocaleDateString()} by{" "}
                <Link href={`/admin/users/${review.user._id}`} className="font-medium hover:underline">
                  {review.user.name}
                </Link>
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p>{review.comment}</p>
              </div>

              {review.photos && review.photos.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {review.photos.map((photo, index) => (
                      <div key={index} className="relative h-32 rounded-md overflow-hidden">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Review photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {review.hostResponse && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Host Response</h3>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p>{review.hostResponse.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Responded on {new Date(review.hostResponse.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative h-40 rounded-md overflow-hidden">
                  <Image
                    src={review.experience.imageUrl || "/placeholder.svg?height=160&width=320"}
                    alt={review.experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium">
                  <Link href={`/admin/experiences/${review.experience._id}`} className="hover:underline">
                    {review.experience.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">Booking #{review.booking.bookingNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={review.user.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    <Link href={`/admin/users/${review.user._id}`} className="hover:underline">
                      {review.user.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{review.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === "approved"
                ? "Are you sure you want to approve this review? It will be visible to all users."
                : "Are you sure you want to reject this review? It will not be visible to users."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              {newStatus === "approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
