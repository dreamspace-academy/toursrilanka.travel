import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageGallery } from "@/components/image-gallery"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ExperienceImagesPage({ params }: { params: { id: string } }) {
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

        <h1 className="text-3xl font-bold mb-6">Experience Images</h1>

        <ImageGallery experienceId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
