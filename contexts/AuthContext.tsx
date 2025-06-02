"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  picture?: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isHost: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError("Authentication error")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed")
      }

      setUser(data.user)
      console.log("Login successful, user:", data.user)
      return data.user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile")
      }

      setUser(result.user)
      return result.user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Profile update failed"
      setError(message)
      throw new Error(message)
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const isHost = user?.role === "host" || user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isHost,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
