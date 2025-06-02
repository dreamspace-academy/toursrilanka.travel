import type React from "react"
import { VideoPreviewProvider } from "@/contexts/video-preview-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <VideoPreviewProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </VideoPreviewProvider>
  )
}
