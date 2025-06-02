"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"

// Mock data for categories
const categories = [
  {
    id: "1",
    name: "Food & Drink",
    description: "Culinary experiences and food tours",
    experiences: 15,
    status: "active",
  },
  {
    id: "2",
    name: "Adventure",
    description: "Outdoor activities and thrilling experiences",
    experiences: 12,
    status: "active",
  },
  {
    id: "3",
    name: "Arts & Culture",
    description: "Museums, galleries, and cultural activities",
    experiences: 18,
    status: "active",
  },
  {
    id: "4",
    name: "Wellness",
    description: "Spa, yoga, and relaxation experiences",
    experiences: 8,
    status: "active",
  },
  {
    id: "5",
    name: "Nightlife",
    description: "Bars, clubs, and evening entertainment",
    experiences: 10,
    status: "inactive",
  },
]

// Define columns for the data table
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "experiences",
    header: "Experiences",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>View and manage all categories on your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredCategories} />
        </CardContent>
      </Card>
    </div>
  )
}
