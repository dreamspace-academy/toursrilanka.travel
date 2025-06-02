"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"

// Mock data for bookings
const bookings = [
  {
    id: "1",
    experienceTitle: "Tokyo Street Food Tour",
    userName: "John Doe",
    date: "2023-06-15",
    time: "14:00",
    guests: 2,
    totalPrice: 179.98,
    status: "confirmed",
  },
  {
    id: "2",
    experienceTitle: "Barcelona Cooking Class",
    userName: "Jane Smith",
    date: "2023-06-20",
    time: "10:00",
    guests: 1,
    totalPrice: 65.0,
    status: "pending",
  },
  {
    id: "3",
    experienceTitle: "Paris Photography Walk",
    userName: "Robert Johnson",
    date: "2023-06-18",
    time: "09:30",
    guests: 3,
    totalPrice: 136.5,
    status: "confirmed",
  },
  {
    id: "4",
    experienceTitle: "Bali Surf Lesson",
    userName: "Emily Davis",
    date: "2023-06-25",
    time: "08:00",
    guests: 2,
    totalPrice: 110.0,
    status: "cancelled",
  },
  {
    id: "5",
    experienceTitle: "New York City Food Tour",
    userName: "Michael Wilson",
    date: "2023-06-22",
    time: "16:00",
    guests: 4,
    totalPrice: 319.96,
    status: "confirmed",
  },
]

// Define columns for the data table
const columns = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }: any) => (
      <Link href={`/admin/bookings/${row.original.id}`} className="font-medium hover:underline">
        #{row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "experienceTitle",
    header: "Experience",
  },
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "guests",
    header: "Guests",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }: any) => `$${row.original.totalPrice.toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === "confirmed"
            ? "bg-green-100 text-green-800"
            : row.original.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
]

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.experienceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.includes(searchQuery),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
          <CardDescription>View and manage all bookings on your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredBookings} />
        </CardContent>
      </Card>
    </div>
  )
}
