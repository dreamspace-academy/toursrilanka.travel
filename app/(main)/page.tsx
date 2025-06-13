"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "@/components/category-filter"
import { ExperienceCard } from "@/components/experience-card"
import { SearchBar } from "@/components/search-bar"
import type { Experience } from "@/types"

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [showMap, setShowMap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllPrices, setShowAllPrices] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{
    responseStatus: number
    responseText: string
    parseError: string
  } | null>(null)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("🔄 Fetching experiences...")

        // First test the backend directly
        const backendTest = await fetch("http://localhost:5000/api/health")
        console.log("🏥 Backend health check:", backendTest.status)

        if (!backendTest.ok) {
          throw new Error("Backend server is not responding")
        }

        // Now fetch through proxy
        const response = await fetch("/api/proxy/experiences")
        console.log("📡 Proxy response status:", response.status)

        const responseText = await response.text()
        console.log("📄 Raw response:", responseText.substring(0, 200))

        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError: unknown) {
          console.error("❌ JSON parse error:", parseError)
          const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parse error"
          setDebugInfo({
            responseStatus: response.status,
            responseText: responseText.substring(0, 500),
            parseError: errorMessage,
          })
          throw new Error("Invalid JSON response from server")
        }

        console.log("✅ Parsed data:", data)

        if (data.success && Array.isArray(data.data)) {
          setExperiences(data.data)
          console.log(`✅ Loaded ${data.data.length} experiences`)
        } else {
          console.warn("⚠️ No experiences found or invalid data format", data)
          setExperiences([])
        }
      } catch (err: unknown) {
        console.error("❌ Error fetching experiences:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load experiences"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Mobile search bar - visible on small screens */}
        <div className="md:hidden mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between rounded-full border shadow-sm h-14"
            onClick={() => {
              /* Open search modal */
            }}
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

        {/* Desktop search bar - hidden on small screens */}
        <div className="flex items-center justify-center hidden md:flex mb-6">
          <SearchBar />
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <CategoryFilter />
        </div>

        {/* Price toggle */}
        <div className="flex justify-end mb-4">
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
        </div>

        {/* Experiences grid */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Experiences in Sri Lanka</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="outline" size="sm" className="rounded-lg">
                <span className="text-sm">Filters</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg flex items-center gap-1"
              onClick={() => setShowMap(!showMap)}
            >
              <span className="text-sm">{showMap ? "Hide map" : "Show map"}</span>
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Error loading experiences</p>
                <p className="text-sm">{error}</p>
                {debugInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm underline">Debug Info</summary>
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience._id || experience.id} experience={experience} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences found. Please check back later.</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Show map button (mobile) */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            className="rounded-full shadow-lg px-6 bg-[#ff385c] hover:bg-[#ff385c]/90"
            onClick={() => setShowMap(!showMap)}
          >
            <span>{showMap ? "List" : "Map"}</span>
            {!showMap && <MapPin className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {/* Map view (would be implemented with a mapping library) */}
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
