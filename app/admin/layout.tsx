"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login")
    }
  }, [isAuthenticated, isAdmin, loading, router])

  // Show loading state or nothing while checking authentication
  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
