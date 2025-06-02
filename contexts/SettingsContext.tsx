"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface SocialLinks {
  facebook: string
  twitter: string
  instagram: string
}

interface Colors {
  primary: string
  secondary: string
}

interface Settings {
  siteName: string
  siteDescription: string
  logo: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: SocialLinks
  colors: Colors
  currency: string
  bookingFee: number
  taxRate: number
  featuredExperiences: string[]
  maintenanceMode: boolean
}

interface SettingsContextType {
  settings: Settings | null
  loading: boolean
  error: string | null
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
  refreshSettings: () => Promise<void>
}

const defaultSettings: Settings = {
  siteName: "Tour Sri Lanka",
  siteDescription: "Find and book unique travel experiences in Sri Lanka",
  logo: "/logo.png",
  contactEmail: "contact@toursrilanka.com",
  contactPhone: "+94 123 456 789",
  address: "123 Main Street, Colombo, Sri Lanka",
  socialLinks: {
    facebook: "https://facebook.com/toursrilanka",
    twitter: "https://twitter.com/toursrilanka",
    instagram: "https://instagram.com/toursrilanka",
  },
  colors: {
    primary: "#0070f3",
    secondary: "#ff4081",
  },
  currency: "LKR",
  bookingFee: 5,
  taxRate: 10,
  featuredExperiences: [],
  maintenanceMode: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/settings")

      if (!response.ok) {
        console.warn("Settings API not available, using default settings")
        setSettings(defaultSettings)
        return
      }

      const data = await response.json()

      if (data.success && data.data) {
        setSettings(data.data)
      } else {
        console.warn("No settings data received, using default settings")
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.warn("Error fetching settings, using default settings:", error)
      setError(null) // Don't show error to user, just use defaults
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setLoading(true)

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
      }

      const data = await response.json()

      if (data.success && data.data) {
        setSettings(data.data)
        toast({
          title: "Settings updated",
          description: "Your changes have been saved successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      setError("Failed to update settings")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    await fetchSettings()
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, error, updateSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }

  return context
}
