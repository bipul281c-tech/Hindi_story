import { getAllStories } from "@/lib/stories"
import { StoryLibrary } from "@/components/story-library"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AmbientBackground } from "@/components/ambient-background"

export const metadata = {
    title: "Story Library | Hindi Story Audiobook",
    description: "Browse our complete collection of hindi stories.",
}

export default async function LibraryPage() {
    const stories = await getAllStories()

    return (
        <div className="bg-background text-foreground antialiased selection:bg-celadon-light selection:text-primary-foreground overflow-x-hidden relative min-h-screen">
            <AmbientBackground />
            <Navigation />

            <main className="pt-32 pb-24 px-6 relative min-h-screen max-w-6xl mx-auto">
                <StoryLibrary initialStories={stories} />
            </main>

            <Footer />
        </div>
    )
}
