import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoGallery } from "@/components/video-gallery"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ExperienceVideosPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/experiences/${params.id}`} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Experience
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Experience Videos</h1>

        <VideoGallery experienceId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
