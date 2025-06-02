import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tour Sri Lanka - Discover Unique Experiences",
  description: "Find and book unique travel experiences in Sri Lanka",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            {children}
            <Toaster />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
