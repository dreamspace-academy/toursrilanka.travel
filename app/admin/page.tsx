"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, DollarSign, Download, MapPin, Star, Calendar, ChevronRight, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for the dashboard
const mockData = {
  stats: {
    totalRevenue: 45231.89,
    totalBookings: 324,
    activeExperiences: 56,
    averageRating: 4.8,
    totalUsers: 1243,
    conversionRate: 8.2,
  },
  bookings: [
    {
      id: "B001",
      customer: "John Doe",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=JD",
      experience: "Mountain Hiking Adventure",
      date: "2023-05-15",
      amount: 129.99,
      status: "completed",
    },
    {
      id: "B002",
      customer: "Jane Smith",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=JS",
      experience: "City Food Tour",
      date: "2023-05-16",
      amount: 89.99,
      status: "upcoming",
    },
    {
      id: "B003",
      customer: "Robert Johnson",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=RJ",
      experience: "Scuba Diving Experience",
      date: "2023-05-14",
      amount: 199.99,
      status: "cancelled",
    },
    {
      id: "B004",
      customer: "Emily Davis",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=ED",
      experience: "Wine Tasting Tour",
      date: "2023-05-18",
      amount: 149.99,
      status: "upcoming",
    },
    {
      id: "B005",
      customer: "Michael Brown",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=MB",
      experience: "Historical City Walk",
      date: "2023-05-13",
      amount: 59.99,
      status: "completed",
    },
  ],
  revenueData: [
    { name: "Jan", total: 1800 },
    { name: "Feb", total: 2200 },
    { name: "Mar", total: 2800 },
    { name: "Apr", total: 3300 },
    { name: "May", total: 4500 },
    { name: "Jun", total: 5200 },
    { name: "Jul", total: 6100 },
    { name: "Aug", total: 5800 },
    { name: "Sep", total: 5100 },
    { name: "Oct", total: 4700 },
    { name: "Nov", total: 4200 },
    { name: "Dec", total: 3800 },
  ],
  topExperiences: [
    { name: "Wildlife Safari", bookings: 48, revenue: 9600, rating: 4.9 },
    { name: "Cooking Class", bookings: 42, revenue: 6300, rating: 4.8 },
    { name: "City Tour", bookings: 36, revenue: 5400, rating: 4.7 },
    { name: "Beach Adventure", bookings: 32, revenue: 6400, rating: 4.6 },
    { name: "Cultural Workshop", bookings: 28, revenue: 4200, rating: 4.9 },
  ],
  topLocations: [
    { name: "Colombo", bookings: 120, growth: 15 },
    { name: "Kandy", bookings: 85, growth: 12 },
    { name: "Galle", bookings: 64, growth: 8 },
    { name: "Ella", bookings: 52, growth: 20 },
    { name: "Sigiriya", bookings: 48, growth: 5 },
  ],
  recentActivity: [
    { type: "booking", user: "John Doe", action: "booked", experience: "Wildlife Safari", time: "2 hours ago" },
    {
      type: "review",
      user: "Emily Davis",
      action: "left a 5-star review for",
      experience: "Cooking Class",
      time: "5 hours ago",
    },
    { type: "cancellation", user: "Michael Brown", action: "cancelled", experience: "City Tour", time: "1 day ago" },
    { type: "booking", user: "Sarah Wilson", action: "booked", experience: "Beach Adventure", time: "1 day ago" },
    {
      type: "review",
      user: "Robert Johnson",
      action: "left a 4-star review for",
      experience: "Cultural Workshop",
      time: "2 days ago",
    },
  ],
}

export default function AdminDashboard() {
  const [data, setData] = useState(mockData)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("last30Days")

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        // const response = await fetch('/api/admin/dashboard')
        // const result = await response.json()
        // setData(result)

        // Using mock data for now
        setTimeout(() => {
          setData(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7Days">Last 7 days</option>
            <option value="last30Days">Last 30 days</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
            <option value="thisYear">This year</option>
          </select>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+20.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Experiences</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.activeExperiences}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+5.2%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Bookings */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/admin/activity">
                    View all <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`/placeholder.svg?height=36&width=36&text=${activity.user.charAt(0)}`}
                            alt={activity.user}
                          />
                          <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.experience}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  You have {data.bookings.filter((b) => b.status === "upcoming").length} upcoming bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center">
                      <Avatar className="h-9 w-9 mr-4">
                        <AvatarImage src={booking.customerAvatar || "/placeholder.svg"} alt={booking.customer} />
                        <AvatarFallback>{booking.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{booking.customer}</p>
                          <Badge
                            className={
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : booking.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {booking.experience} • {booking.date} • ${booking.amount}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/admin/bookings">View all bookings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Experiences and Locations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Experiences</CardTitle>
                <CardDescription>Your most popular experiences by bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.topExperiences.map((exp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">{exp.name}</span>
                          <div className="ml-2 flex items-center">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-xs text-gray-500">{exp.rating}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{exp.bookings} bookings</span>
                      </div>
                      <Progress value={(exp.bookings / data.topExperiences[0].bookings) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Your most popular destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.topLocations.map((location, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{location.name}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{location.bookings} bookings</span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+{location.growth}%</Badge>
                        </div>
                      </div>
                      <Progress value={(location.bookings / data.topLocations[0].bookings) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Your revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Manage Experiences</CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/experiences/new">Add New Experience</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div>Experience</div>
                  <div>Location</div>
                  <div>Price</div>
                  <div>Rating</div>
                  <div>Actions</div>
                </div>
                {data.topExperiences.map((exp, index) => (
                  <div key={index} className="grid grid-cols-5 border-b p-3 text-sm">
                    <div className="font-medium">{exp.name}</div>
                    <div>{data.topLocations[index % data.topLocations.length].name}</div>
                    <div>${(exp.revenue / exp.bookings).toFixed(2)}</div>
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      {exp.rating}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/experiences/${index + 1}`}>Edit</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/experiences">View all experiences</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div>Customer</div>
                  <div>Experience</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                {data.bookings.map((booking) => (
                  <div key={booking.id} className="grid grid-cols-5 border-b p-3 text-sm">
                    <div className="font-medium">{booking.customer}</div>
                    <div>{booking.experience}</div>
                    <div>{booking.date}</div>
                    <div>${booking.amount}</div>
                    <div>
                      <Badge
                        className={
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : booking.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/bookings">View all bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[150px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[100px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-9 w-9 rounded-full mr-4" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-9 w-9 rounded-full mr-4" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-5 w-[70px] rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
