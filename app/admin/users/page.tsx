"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"

// Mock data for users
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-01-15",
    bookings: 5,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "host",
    status: "active",
    joinDate: "2023-02-20",
    bookings: 0,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "admin",
    status: "active",
    joinDate: "2022-11-10",
    bookings: 2,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-03-05",
    bookings: 8,
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "host",
    status: "active",
    joinDate: "2023-01-30",
    bookings: 0,
  },
]

// Define columns for the data table
const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <Link href={`/admin/users/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.role === "admin"
            ? "bg-purple-100 text-purple-800"
            : row.original.role === "host"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.role}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
  {
    accessorKey: "bookings",
    header: "Bookings",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>View and manage all users on your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredUsers} />
        </CardContent>
      </Card>
    </div>
  )
}
