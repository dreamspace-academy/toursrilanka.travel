"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToastContext } from "@/contexts/toast-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, CheckCircle, XCircle, RefreshCw } from "lucide-react"
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

interface Booking {
  _id: string
  bookingNumber: string
  experience: {
    _id: string
    title: string
    imageUrl: string
    host: {
      _id: string
      name: string
    }
  }
  user: {
    _id: string
    name: string
    email: string
    avatar: string
  }
  date: string
  startTime: string
  endTime: string
  guests: {
    adults: number
    children: number
    infants: number
  }
  totalGuests: number
  price: {
    basePrice: number
    serviceFee: number
    tax: number
    totalPrice: number
  }
  status: string
  paymentStatus: string
  paymentId?: string
  specialRequests?: string
  createdAt: string
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const { showToast } = useToastContext()
  const router = useRouter()

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/proxy/bookings/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch booking")
      }
      const data = await response.json()
      setBooking(data.data)
    } catch (error) {
      console.error("Error fetching booking:", error)
      showToast("Error", "Failed to load booking", "destructive")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    setNewStatus(status)
    setStatusDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!booking) return

    try {
      const response = await fetch(`/api/proxy/bookings/${booking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update booking status")
      }

      // Update the booking status
      setBooking((prev) => (prev ? { ...prev, status: newStatus } : null))
      showToast("Success", "Booking status updated successfully", "success")
    } catch (error) {
      console.error("Error updating booking status:", error)
      showToast("Error", "Failed to update booking status", "destructive")
    } finally {
      setStatusDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
        <p className="text-muted-foreground mb-4">The booking you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchBooking}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {booking.status === "pending" && (
            <Button onClick={() => handleStatusChange("confirmed")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          )}
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <Button variant="destructive" onClick={() => handleStatusChange("cancelled")}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Booking #{booking.bookingNumber}</h1>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              booking.status === "confirmed"
                ? "default"
                : booking.status === "completed"
                  ? "outline"
                  : booking.status === "cancelled"
                    ? "destructive"
                    : "secondary"
            }
            className="text-sm py-1 px-3"
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
          <Badge
            variant={
              booking.paymentStatus === "paid"
                ? "default"
                : booking.paymentStatus === "refunded"
                  ? "destructive"
                  : "secondary"
            }
            className="text-sm py-1 px-3"
          >
            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden">
                  <Image
                    src={booking.experience.imageUrl || "/placeholder.svg?height=80&width=80"}
                    alt={booking.experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    <Link href={`/admin/experiences/${booking.experience._id}`} className="hover:underline">
                      {booking.experience.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hosted by{" "}
                    <Link href={`/admin/users/${booking.experience.host._id}`} className="hover:underline">
                      {booking.experience.host.name}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                  <p className="font-medium">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Guests</h3>
                  <p className="font-medium">
                    {booking.guests.adults} Adults, {booking.guests.children} Children, {booking.guests.infants} Infants
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Guests</h3>
                  <p className="font-medium">{booking.totalGuests}</p>
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Special Requests</h3>
                  <p className="bg-muted p-3 rounded-md">{booking.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={booking.user.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={booking.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    <Link href={`/admin/users/${booking.user._id}`} className="hover:underline">
                      {booking.user.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${booking.price.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${booking.price.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${booking.price.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${booking.price.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {booking.paymentId && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment ID</h3>
                  <p className="text-xs bg-muted p-2 rounded-md overflow-x-auto">{booking.paymentId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                    {new Date(booking.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {/* Add more timeline events here as needed */}
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
              {newStatus === "confirmed"
                ? "Are you sure you want to confirm this booking?"
                : newStatus === "cancelled"
                  ? "Are you sure you want to cancel this booking? This may trigger a refund process."
                  : `Are you sure you want to change the status to ${newStatus}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              {newStatus === "confirmed"
                ? "Confirm Booking"
                : newStatus === "cancelled"
                  ? "Cancel Booking"
                  : "Change Status"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
