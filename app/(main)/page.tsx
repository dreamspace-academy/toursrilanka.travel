"use client"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "@/components/category-filter"
import { ExperienceCard } from "@/components/experience-card"
import { SearchBar } from "@/components/search-bar"
import { experiences } from "@/data/experiences"
import PageUp from "@/components/PageUp"

export default function Home() {
  const [experiencesList, setExperiencesList] = useState(experiences)
  const [showMap, setShowMap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllPrices, setShowAllPrices] = useState(false)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setTimeout(() => {
          setExperiencesList(experiences)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching experiences:", error)
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="md:hidden mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between rounded-full border shadow-sm h-14"
            onClick={() => {}}
          >
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Where to?</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Any week</span>
              <span className="text-sm">·</span>
              <span className="text-sm">Add guests</span>
            </div>
          </Button>
        </div>

        <div className="flex items-center justify-center hidden md:flex mb-6">
          <SearchBar />
        </div>

        <div className="mb-8">
          <CategoryFilter />
        </div>

        {/* <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border shadow-sm"
            onClick={() => setShowAllPrices(!showAllPrices)}
          >
            <span className="text-sm font-medium">
              {showAllPrices ? "Display total before taxes" : "Display total with taxes"}
            </span>
          </Button>
        </div> */}

        
          <div>
            {/* ✅ Just show one reusable ExperienceCard */}
            <ExperienceCard />
          </div>

          <div>
            {/* ✅ Just show one reusable ExperienceCard */}
            <PageUp />
          </div>

        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            className="rounded-full shadow-lg px-6 bg-[#ff385c] hover:bg-[#ff385c]/90"
            onClick={() => setShowMap(!showMap)}
          >
            <span>{showMap ? "List" : "Map"}</span>
            {!showMap && <MapPin className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {showMap && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <Button variant="outline" className="rounded-full" onClick={() => setShowMap(false)}>
                  Back to list
                </Button>
              </div>
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Map view would be implemented here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
