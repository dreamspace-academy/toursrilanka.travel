"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, Heart, Share, Clock, Users, Globe, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockExperiences } from "@/data/experiences"
import { VideoPreviewProvider } from "@/contexts/video-preview-context"
import { ExperienceCard } from "@/components/experience-card"

export default function ExperienceDetailPage() {
  const { id } = useParams()
  const [experience, setExperience] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAllDescription, setShowAllDescription] = useState(false)
  const [showAllIncludes, setShowAllIncludes] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock dates and times
  const availableDates = [
    { date: "Mon, May 20", times: ["9:00 AM", "1:00 PM", "5:00 PM"] },
    { date: "Tue, May 21", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
    { date: "Wed, May 22", times: ["9:00 AM", "1:00 PM", "5:00 PM"] },
    { date: "Thu, May 23", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
    { date: "Fri, May 24", times: ["9:00 AM", "1:00 PM", "5:00 PM"] },
  ]

  // Mock similar experiences
  const similarExperiences = mockExperiences.slice(0, 4)

  useEffect(() => {
    // Simulate API call
    const fetchExperience = async () => {
      try {
        // In a real app, you would fetch data from your API
        // const response = await fetch(`/api/experiences/${id}`)
        // const data = await response.json()
        // setExperience(data)

        // Using mock data for now
        setTimeout(() => {
          const foundExperience = mockExperiences.find((exp) => exp.id === id)
          setExperience(foundExperience || mockExperiences[0])
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching experience:", error)
        setIsLoading(false)
      }
    }

    if (id) {
      fetchExperience()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="aspect-video bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Experience not found</h1>
        <p className="mt-4">The experience you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" asChild>
          <Link href="/experiences">Browse all experiences</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Experience Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">{experience.title}</h1>

      {/* Experience Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-current mr-1" />
          <span className="font-medium">{experience.rating}</span>
          <span className="mx-1">·</span>
          <Link href="#reviews" className="underline">
            {experience.reviews} reviews
          </Link>
        </div>
        <span className="mx-1">·</span>
        <span>{experience.location}</span>
      </div>

      {/* Experience Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
        <div className="aspect-video relative rounded-l-xl overflow-hidden">
          <Image src={experience.imageUrl || "/placeholder.svg"} alt={experience.title} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=300&text=Image+2"
              alt={`${experience.title} - Image 2`}
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-tr-xl">
            <Image
              src="/placeholder.svg?height=300&width=300&text=Image+3"
              alt={`${experience.title} - Image 3`}
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=300&text=Image+4"
              alt={`${experience.title} - Image 4`}
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-br-xl">
            <Image
              src="/placeholder.svg?height=300&width=300&text=Image+5"
              alt={`${experience.title} - Image 5`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Image Actions */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white rounded-md"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-[#ff385c] text-[#ff385c]" : ""}`} />
            <span>Save</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-white rounded-md">
            <Share className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Experience hosted by {experience.host?.name || "Local Host"}
                </h2>
                <p className="text-gray-600">{experience.duration || "3 hours"} · Hosted in English</p>
              </div>
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={experience.host?.avatar || "/placeholder.svg?height=56&width=56"}
                  alt={experience.host?.name || "Host"}
                />
                <AvatarFallback>{experience.host?.name?.charAt(0) || "H"}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Experience Details */}
          <div className="border-b pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start">
                <Clock className="h-6 w-6 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-gray-600">{experience.duration || "3 hours"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Group size</h3>
                  <p className="text-gray-600">Up to {experience.groupSize || 10} people</p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-6 w-6 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Hosted in</h3>
                  <p className="text-gray-600">English</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">What you'll do</h3>
              <div className={`text-gray-600 ${showAllDescription ? "" : "line-clamp-3"}`}>
                <p>
                  {experience.description ||
                    "Join us for an unforgettable experience in the heart of Sri Lanka. You'll explore local culture, taste authentic cuisine, and create memories that will last a lifetime. Our experienced guides will take you off the beaten path to discover hidden gems and connect with local communities."}
                </p>
                <p className="mt-4">
                  Throughout this experience, you'll have the opportunity to learn traditional crafts, participate in
                  cultural activities, and gain insights into the rich heritage of Sri Lanka. We'll provide all
                  necessary equipment and refreshments to ensure your comfort and enjoyment.
                </p>
                <p className="mt-4">
                  This experience is suitable for all skill levels and ages. Whether you're a solo traveler, a couple,
                  or a family, we'll make sure everyone has a great time. Our small group size ensures personalized
                  attention and a more intimate experience.
                </p>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto font-medium underline"
                onClick={() => setShowAllDescription(!showAllDescription)}
              >
                {showAllDescription ? "Show less" : "Show more"}
                {showAllDescription ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
            </div>

            {/* What's included */}
            <div>
              <h3 className="font-medium mb-2">What's included</h3>
              <div className={`text-gray-600 ${showAllIncludes ? "" : "line-clamp-3"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="mr-4">🍽️</div>
                    <div>
                      <p className="font-medium">Food</p>
                      <p>Traditional Sri Lankan snacks and refreshments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4">🥤</div>
                    <div>
                      <p className="font-medium">Drinks</p>
                      <p>Water, tea, and local beverages</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4">🚌</div>
                    <div>
                      <p className="font-medium">Transportation</p>
                      <p>Pick-up and drop-off at central locations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4">📸</div>
                    <div>
                      <p className="font-medium">Equipment</p>
                      <p>All necessary equipment for activities</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto font-medium underline"
                onClick={() => setShowAllIncludes(!showAllIncludes)}
              >
                {showAllIncludes ? "Show less" : "Show more"}
                {showAllIncludes ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Location */}
          <div className="border-b pb-6 mb-6">
            <h3 className="font-medium mb-4">Where you'll be</h3>
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=400&width=800&text=Map"
                alt="Experience location map"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-600">{experience.location}</p>
          </div>

          {/* Host Info */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-start mb-4">
              <Avatar className="h-14 w-14 mr-4">
                <AvatarImage
                  src={experience.host?.avatar || "/placeholder.svg?height=56&width=56"}
                  alt={experience.host?.name || "Host"}
                />
                <AvatarFallback>{experience.host?.name?.charAt(0) || "H"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Meet your host, {experience.host?.name || "Local Host"}</h3>
                <p className="text-gray-600">Hosting since 2018</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current mr-2" />
                <span>{experience.reviews} reviews</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2">🛡️</div>
                <span>Identity verified</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2">⭐</div>
                <span>Superhost</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              I'm a passionate local guide with extensive knowledge of Sri Lankan culture, history, and hidden gems. I
              love sharing authentic experiences with travelers and helping them create unforgettable memories.
            </p>

            <Button variant="outline" className="rounded-md">
              Contact host
            </Button>
          </div>

          {/* Reviews */}
          <div id="reviews" className="border-b pb-6 mb-6">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 fill-current mr-2" />
              <span className="text-xl font-medium">{experience.rating}</span>
              <span className="mx-2">·</span>
              <span className="text-xl font-medium">{experience.reviews} reviews</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Mock reviews */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=R${i}`} alt={`Reviewer ${i}`} />
                      <AvatarFallback>R{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Reviewer {i}</p>
                      <p className="text-sm text-gray-500">May 2023</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Amazing experience! The host was knowledgeable and friendly. We learned so much about local culture
                    and had a fantastic time. Would definitely recommend to anyone visiting Sri Lanka.
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="rounded-md">
              Show all {experience.reviews} reviews
            </Button>
          </div>

          {/* Things to know */}
          <div>
            <h3 className="font-medium mb-4">Things to know</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Cancellation policy</h4>
                <p className="text-gray-600 text-sm">
                  Free cancellation up to 24 hours before the experience starts. Learn more about cancellations.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Guest requirements</h4>
                <p className="text-gray-600 text-sm">
                  Up to {experience.groupSize || 10} guests ages 10 and up can attend. Parents may also bring children
                  under 2 years of age.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">What to bring</h4>
                <p className="text-gray-600 text-sm">
                  Comfortable walking shoes, sunscreen, hat, and camera. Don't forget to bring water and snacks if
                  needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xl font-semibold">From ${experience.price}</span>
                <span className="text-gray-600"> / person</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span>{experience.rating}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-600 underline">{experience.reviews} reviews</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Date</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {availableDates.slice(0, 4).map((dateOption) => (
                  <Button
                    key={dateOption.date}
                    variant={selectedDate === dateOption.date ? "default" : "outline"}
                    className={`rounded-md justify-start ${selectedDate === dateOption.date ? "bg-black text-white" : ""}`}
                    onClick={() => setSelectedDate(dateOption.date)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{dateOption.date.split(",")[0]}</div>
                      <div className="text-xs">{dateOption.date.split(",")[1]}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <Button variant="outline" className="w-full rounded-md mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>See more dates</span>
              </Button>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Time</label>
                <div className="space-y-2">
                  {availableDates
                    .find((d) => d.date === selectedDate)
                    ?.times.map((time) => (
                      <Button key={time} variant="outline" className="w-full rounded-md justify-between">
                        <span>{time}</span>
                        <span className="font-medium">${experience.price}/person</span>
                      </Button>
                    ))}
                </div>
              </div>
            )}

            <Button className="w-full rounded-md bg-[#ff385c] hover:bg-[#ff385c]/90 mb-4">Check availability</Button>

            <p className="text-center text-sm text-gray-500">You won't be charged yet</p>
          </div>
        </div>
      </div>

      {/* Similar Experiences */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">More experiences like this</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <VideoPreviewProvider>
            {similarExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </VideoPreviewProvider>
        </div>
      </div>
    </div>
  )
}
