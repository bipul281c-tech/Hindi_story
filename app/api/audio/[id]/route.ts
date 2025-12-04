import { type NextRequest, NextResponse } from "next/server"
import { getStoryById } from "@/lib/stories"

// GET /api/audio/[id]
// Proxies audio requests to R2 to support Range headers
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const storyId = Number.parseInt(id, 10)

        if (isNaN(storyId)) {
            return new NextResponse("Invalid story ID", { status: 400 })
        }

        const story = await getStoryById(storyId)

        if (!story || !story.audio_link) {
            return new NextResponse("Audio not found", { status: 404 })
        }

        // Redirect to the R2 URL directly
        // This is much faster and supports Range headers natively
        return NextResponse.redirect(story.audio_link)

    } catch (error) {
        console.error("Audio redirect error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
