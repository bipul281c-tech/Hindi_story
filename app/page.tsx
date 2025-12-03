import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { AmbientBackground } from "@/components/ambient-background"
import { StoryPlayer } from "@/components/story-player"
import { ExtensionPromo } from "@/components/extension-promo"
import { getAllStories } from "@/lib/stories"
import { Spinner } from "@/components/ui/spinner"

function PlayerLoading() {
  return (
    <div className="max-w-4xl mx-auto w-full flex items-center justify-center py-20">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  )
}

export default async function Home() {
  // Fetch stories with stable IDs from the data layer
  const stories = await getAllStories()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hindi Story Audiobook",
    url: "https://www.quick.dailymeditationguide.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.quick.dailymeditationguide.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Hindi Story Audiobook",
      logo: {
        "@type": "ImageObject",
        url: "https://www.quick.dailymeditationguide.com/logo.svg",
      },
    },
  }

  return (
    <div className="bg-background text-foreground antialiased selection:bg-celadon-light selection:text-primary-foreground overflow-x-hidden relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmbientBackground />
      <Navigation />

      <main className="pt-32 pb-24 px-6 relative max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
        <HeroSection />
        <Suspense fallback={<PlayerLoading />}>
          <StoryPlayer stories={stories} />
        </Suspense>

        <div className="mt-12 text-center">
          <a
            href="/library"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
            View Full Library
          </a>
        </div>
      </main>

      {/* Extension Promotion Section */}
      <ExtensionPromo />

      <Footer />
    </div>
  )
}
