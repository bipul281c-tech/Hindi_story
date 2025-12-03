import { type NextRequest, NextResponse } from "next/server"
import { getStoryById } from "@/lib/stories"
import type { StoryDetailResponse, ApiErrorResponse } from "@/types/story"

// GET /api/stories/[id]
// Returns a single story by its ID (index)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const storyId = Number.parseInt(id, 10)

    if (isNaN(storyId)) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Invalid story ID",
        code: "INVALID_ID",
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const story = await getStoryById(storyId)

    if (!story) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Story not found",
        code: "NOT_FOUND",
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    const response: StoryDetailResponse = {
      success: true,
      data: story,
    }

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Failed to fetch story",
      code: "FETCH_ERROR",
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
