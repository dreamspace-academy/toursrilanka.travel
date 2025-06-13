"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@toursrilanka.com",
    password: "password123",
    name: "Admin User",
    role: "admin",
    picture: "/placeholder.svg?height=40&width=40&text=AU",
  },
  {
    id: "2",
    email: "host@toursrilanka.com",
    password: "password123",
    name: "Host User",
    role: "host",
    picture: "/placeholder.svg?height=40&width=40&text=HU",
  },
  {
    id: "3",
    email: "user@toursrilanka.com",
    password: "password123",
    name: "Regular User",
    role: "guest",
    picture: "/placeholder.svg?height=40&width=40&text=RU",
  },
]

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const userData = localStorage.getItem("user")
          const isLoggedIn = localStorage.getItem("isLoggedIn")

          if (userData && isLoggedIn === "true") {
            const parsedUser = JSON.parse(userData) as User
            if (parsedUser && parsedUser.role) {
              setUser(parsedUser)
              console.log("User found in localStorage:", parsedUser)
            } else {
              // Invalid user data, clear storage
              localStorage.removeItem("user")
              localStorage.removeItem("isLoggedIn")
              setUser(null)
            }
          } else {
            setUser(null)
            console.log("No user found in localStorage")
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError("Authentication error")
        setUser(null)
        // Clear potentially corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("user")
          localStorage.removeItem("isLoggedIn")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      // Find user in mock data
      const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Create user object without password
      const userWithoutPassword: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        picture: foundUser.picture,
      }

      // Validate user object before storing
      if (!userWithoutPassword.role || !userWithoutPassword.email) {
        throw new Error("Invalid user data")
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        localStorage.setItem("isLoggedIn", "true")
      }

      setUser(userWithoutPassword)
      console.log("Login successful:", userWithoutPassword)

      return userWithoutPassword
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
      }
      setUser(null)
      console.log("Logout successful")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      if (!user) throw new Error("No user logged in")

      const updatedUser: User = { ...user, ...data }
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
      setUser(updatedUser)
      return updatedUser
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
