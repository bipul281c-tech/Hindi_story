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

        // Fetch the audio file from R2
        const range = request.headers.get("range")
        const headers: HeadersInit = {}
        if (range) {
            headers["Range"] = range
        }

        const audioResponse = await fetch(story.audio_link, {
            headers,
        })

        if (!audioResponse.ok) {
            return new NextResponse("Failed to fetch audio", { status: audioResponse.status })
        }

        // Forward relevant headers
        const responseHeaders = new Headers()
        responseHeaders.set("Content-Type", audioResponse.headers.get("Content-Type") || "audio/mpeg")
        responseHeaders.set("Content-Length", audioResponse.headers.get("Content-Length") || "")
        responseHeaders.set("Accept-Ranges", "bytes")

        if (audioResponse.headers.has("Content-Range")) {
            responseHeaders.set("Content-Range", audioResponse.headers.get("Content-Range")!)
        }

        // Return the stream
        return new NextResponse(audioResponse.body, {
            status: audioResponse.status,
            headers: responseHeaders,
        })

    } catch (error) {
        console.error("Audio proxy error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
