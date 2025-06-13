"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await login(email, password)
      console.log("Login successful, user:", user)

      // Check if user exists and has a role before accessing it
      if (user && user.role) {
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        setError("Invalid user data received")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fillCredentials = (userType: string) => {
    switch (userType) {
      case "admin":
        setEmail("admin@toursrilanka.com")
        setPassword("password123")
        break
      case "host":
        setEmail("host@toursrilanka.com")
        setPassword("password123")
        break
      case "user":
        setEmail("user@toursrilanka.com")
        setPassword("password123")
        break
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to TravelXP</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Access your admin dashboard</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="admin@toursrilanka.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="password123"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm font-medium text-center mb-2">Quick Login (Demo Accounts)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillCredentials("admin")}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Admin
              </button>
              <button
                onClick={() => fillCredentials("host")}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Host
              </button>
              <button
                onClick={() => fillCredentials("user")}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                User
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">
              <strong>Admin:</strong> admin@toursrilanka.com / password123
            </p>
            <p className="text-xs text-gray-500">
              <strong>Host:</strong> host@toursrilanka.com / password123
            </p>
            <p className="text-xs text-gray-500">
              <strong>User:</strong> user@toursrilanka.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
