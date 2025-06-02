"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, MapPin, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ExperienceCard } from "@/components/experience-card"
import { experiences } from "@/data/experiences"
import { VideoPreviewProvider } from "@/contexts/video-preview-context"

export default function ExperiencesPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const locationParam = searchParams.get("location")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(locationParam)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [instantBook, setInstantBook] = useState(false)
  const [filteredExperiences, setFilteredExperiences] = useState(experiences)

  // Get all experience IDs for video preloading
  const experienceIds = experiences.map((exp) => exp.id)

  // Extract unique categories and locations
  const categories = Array.from(new Set(experiences.map((exp) => exp.category)))
  const locations = Array.from(new Set(experiences.map((exp) => exp.location)))

  // Apply filters
  useEffect(() => {
    let result = [...experiences]

    if (searchTerm) {
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      result = result.filter((exp) => exp.category === selectedCategory)
    }

    if (selectedLocation) {
      result = result.filter((exp) => exp.location === selectedLocation)
    }

    result = result.filter((exp) => exp.price >= priceRange[0] && exp.price <= priceRange[1])

    setFilteredExperiences(result)
  }, [searchTerm, selectedCategory, selectedLocation, priceRange, instantBook])

  // Initialize filters from URL params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }

    if (locationParam) {
      setSelectedLocation(locationParam)
    }
  }, [categoryParam, locationParam])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setSelectedLocation(null)
    setPriceRange([0, 500])
    setInstantBook(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search experiences"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your search results</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Price range</h3>
                <Slider defaultValue={priceRange} min={0} max={500} step={10} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge
                      key={location}
                      variant={selectedLocation === location ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="instant-book" checked={instantBook} onCheckedChange={setInstantBook} />
                <Label htmlFor="instant-book">Instant Book</Label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear all
                </Button>
                <Button>Show results</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {(selectedCategory || selectedLocation || searchTerm || priceRange[0] > 0 || priceRange[1] < 500) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => setSelectedCategory(null)}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}

          {selectedLocation && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3 mr-1" />
              {selectedLocation}
              <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => setSelectedLocation(null)}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}

          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => setPriceRange([0, 500])}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}

          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{searchTerm}"
              <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => setSearchTerm("")}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {selectedLocation ? `Experiences in ${selectedLocation}` : "All Experiences"}
        </h1>
        <p className="text-gray-500">{filteredExperiences.length} experiences found</p>
      </div>

      {/* Experiences Grid */}
      {filteredExperiences.length > 0 ? (
        <VideoPreviewProvider experienceIds={filteredExperiences.map((exp) => exp.id)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </VideoPreviewProvider>
      ) : (
        <div className="text-center py-16">
          <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">No experiences found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          <Button onClick={clearFilters}>Clear all filters</Button>
        </div>
      )}
    </div>
  )
}
