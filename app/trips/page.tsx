"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { experiences } from "@/data/experiences"

// Mock bookings data
const mockBookings = [
  {
    id: "b1",
    experienceId: experiences[0].id,
    date: new Date(2023, 6, 15),
    guests: 2,
    status: "upcoming",
    totalPrice: 129.99,
  },
  {
    id: "b2",
    experienceId: experiences[1].id,
    date: new Date(2023, 5, 20),
    guests: 1,
    status: "completed",
    totalPrice: 89.99,
  },
  {
    id: "b3",
    experienceId: experiences[2].id,
    date: new Date(2023, 4, 10),
    guests: 3,
    status: "cancelled",
    totalPrice: 199.99,
  },
]

export default function TripsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState(mockBookings)

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Trips</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your trips.</p>
        <Button onClick={() => router.push("/login")}>Log in</Button>
      </div>
    )
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const pastBookings = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Trips</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((booking) => {
                const experience = experiences.find((exp) => exp.id === booking.experienceId)
                if (!experience) return null

                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={experience.imageUrl || "/placeholder.svg"}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-gray-500">{experience.category}</div>
                          <CardTitle className="text-lg">{experience.title}</CardTitle>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{format(booking.date, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-gray-500">
                        {booking.guests} {booking.guests === 1 ? "guest" : "guests"} • ${booking.totalPrice}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/trips/${booking.id}`}>
                          View details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Image
                  src="/placeholder.svg?height=120&width=120&text=No+Trips"
                  alt="No upcoming trips"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-xl font-medium mb-2">No upcoming trips</h2>
              <p className="text-gray-600 mb-6">Time to start planning your next adventure!</p>
              <Button asChild>
                <Link href="/experiences">Explore experiences</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.filter((b) => b.status === "completed").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastBookings
                .filter((b) => b.status === "completed")
                .map((booking) => {
                  const experience = experiences.find((exp) => exp.id === booking.experienceId)
                  if (!experience) return null

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={experience.imageUrl || "/placeholder.svg"}
                          alt={experience.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm text-gray-500">{experience.category}</div>
                            <CardTitle className="text-lg">{experience.title}</CardTitle>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{format(booking.date, "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-gray-500">
                          {booking.guests} {booking.guests === 1 ? "guest" : "guests"} • ${booking.totalPrice}
                        </div>
                        <Button variant="outline" size="sm">
                          Leave a review
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No past trips</h2>
              <p className="text-gray-600">You haven't completed any experiences yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {pastBookings.filter((b) => b.status === "cancelled").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastBookings
                .filter((b) => b.status === "cancelled")
                .map((booking) => {
                  const experience = experiences.find((exp) => exp.id === booking.experienceId)
                  if (!experience) return null

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={experience.imageUrl || "/placeholder.svg"}
                          alt={experience.title}
                          fill
                          className="object-cover opacity-70"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm text-gray-500">{experience.category}</div>
                            <CardTitle className="text-lg">{experience.title}</CardTitle>
                          </div>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{format(booking.date, "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-gray-500">
                          {booking.guests} {booking.guests === 1 ? "guest" : "guests"} • ${booking.totalPrice}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/experiences/${experience.id}`}>Book again</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No cancelled trips</h2>
              <p className="text-gray-600">You don't have any cancelled bookings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
