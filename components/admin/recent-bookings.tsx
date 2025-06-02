"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"

// Mock data for recent bookings
const mockBookings = [
  {
    id: "B001",
    user: { name: "John Doe", email: "john@example.com" },
    experience: { name: "Mountain Hiking", location: "Swiss Alps" },
    date: "2023-06-15",
    status: "completed",
    amount: 120,
  },
  {
    id: "B002",
    user: { name: "Jane Smith", email: "jane@example.com" },
    experience: { name: "City Tour", location: "Paris" },
    date: "2023-06-18",
    status: "upcoming",
    amount: 85,
  },
  {
    id: "B003",
    user: { name: "Bob Johnson", email: "bob@example.com" },
    experience: { name: "Cooking Class", location: "Rome" },
    date: "2023-06-20",
    status: "upcoming",
    amount: 65,
  },
  {
    id: "B004",
    user: { name: "Alice Brown", email: "alice@example.com" },
    experience: { name: "Wine Tasting", location: "Napa Valley" },
    date: "2023-06-14",
    status: "completed",
    amount: 95,
  },
  {
    id: "B005",
    user: { name: "Charlie Wilson", email: "charlie@example.com" },
    experience: { name: "Scuba Diving", location: "Great Barrier Reef" },
    date: "2023-06-25",
    status: "upcoming",
    amount: 150,
  },
]

export function RecentBookings() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<typeof mockBookings | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        // In a real app, you would fetch data from your API
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setBookings(mockBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    )
  }

  // Safety check to ensure bookings exist
  if (!bookings || bookings.length === 0) {
    return <div>No recent bookings found</div>
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6 text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{booking.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              Booked {booking.experience.name} for {new Date(booking.date).toLocaleDateString()}
            </p>
          </div>
          <div className="font-medium">${booking.amount}</div>
        </div>
      ))}
    </div>
  )
}
