import { type NextRequest, NextResponse } from "next/server"
import { getAllStories, searchStories } from "@/lib/stories"
import type { StoriesListResponse, ApiErrorResponse } from "@/types/story"

// GET /api/stories
// Query params:
//   - q: search query (optional) - searches in title and description
//   - limit: number of results (optional, default: all)
//   - offset: pagination offset (optional, default: 0)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = searchParams.get("limit")
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Get stories (filtered if query provided)
    let stories = query ? await searchStories(query) : await getAllStories()

    const totalCount = stories.length

    // Apply pagination
    if (offset > 0) {
      stories = stories.slice(offset)
    }
    if (limit) {
      stories = stories.slice(0, Number.parseInt(limit, 10))
    }

    const response: StoriesListResponse = {
      success: true,
      count: totalCount,
      ...(query && { query }),
      data: stories,
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
      error: "Failed to fetch stories",
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
