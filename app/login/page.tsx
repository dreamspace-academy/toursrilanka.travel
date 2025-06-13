"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const [loginType, setLoginType] = useState<"user" | "admin">("user")

  const handleLogin = (role: "user" | "admin") => {
    setIsLoading(true)
    setLoginType(role)
    login(role)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Tour Sri Lanka</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {redirectTo !== "/" ? "Please sign in to continue" : "Access your account"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <button
              onClick={() => handleLogin("user")}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading && loginType === "user" ? "Signing in..." : "Sign in as User"}
            </button>

            <button
              onClick={() => handleLogin("admin")}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading && loginType === "admin" ? "Signing in..." : "Sign in as Admin"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Authentication Information:</p>
            <p className="text-xs text-gray-500">This application uses Auth0 for secure authentication.</p>
            <p className="text-xs text-gray-500 mt-1">Admin access is restricted to authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
