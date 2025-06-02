"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"

// Mock data for reviews
const reviews = [
  {
    id: "1",
    experienceTitle: "Tokyo Street Food Tour",
    userName: "John Doe",
    rating: 5,
    comment: "Amazing experience! The guide was knowledgeable and the food was delicious.",
    date: "2023-06-10",
    status: "approved",
  },
  {
    id: "2",
    experienceTitle: "Barcelona Cooking Class",
    userName: "Jane Smith",
    rating: 4,
    comment: "Great class, learned a lot about Spanish cuisine. The chef was very friendly.",
    date: "2023-06-12",
    status: "approved",
  },
  {
    id: "3",
    experienceTitle: "Paris Photography Walk",
    userName: "Robert Johnson",
    rating: 5,
    comment: "Perfect for photography enthusiasts! Got some amazing shots of Paris.",
    date: "2023-06-08",
    status: "pending",
  },
  {
    id: "4",
    experienceTitle: "Bali Surf Lesson",
    userName: "Emily Davis",
    rating: 3,
    comment: "The instructor was good, but the waves were too strong for beginners.",
    date: "2023-06-15",
    status: "approved",
  },
  {
    id: "5",
    experienceTitle: "New York City Food Tour",
    userName: "Michael Wilson",
    rating: 2,
    comment: "Overpriced for what you get. Some of the food stops were disappointing.",
    date: "2023-06-14",
    status: "flagged",
  },
]

// Define columns for the data table
const columns = [
  {
    accessorKey: "experienceTitle",
    header: "Experience",
    cell: ({ row }: any) => (
      <Link href={`/admin/reviews/${row.original.id}`} className="font-medium hover:underline">
        {row.original.experienceTitle}
      </Link>
    ),
  },
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }: any) => {
      const rating = row.original.rating
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }: any) => (
      <div className="max-w-xs truncate" title={row.original.comment}>
        {row.original.comment}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === "approved"
            ? "bg-green-100 text-green-800"
            : row.original.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.original.status === "flagged"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
]

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter reviews based on search query
  const filteredReviews = reviews.filter(
    (review) =>
      review.experienceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Reviews</CardTitle>
          <CardDescription>View and manage all reviews on your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reviews..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredReviews} />
        </CardContent>
      </Card>
    </div>
  )
}
