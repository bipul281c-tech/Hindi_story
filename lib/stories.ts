import type { StoryWithId } from "@/types/story"
import storiesData from "@/content/stories.json"

// Generate a stable numeric ID from a string (used for fallback/seeding)
function generateStableId(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Cache for stories
let cachedStories: StoryWithId[] | null = null

export async function getAllStories(): Promise<StoryWithId[]> {
  if (cachedStories) {
    return cachedStories
  }

  try {
    // Fetch from local JSON
    cachedStories = (storiesData as any[]).map((story) => ({
      ...story,
      id: generateStableId(story.title + story.audio_link),
    }))
  } catch (err) {
    console.error('Failed to load stories from local JSON:', err)
    cachedStories = []
  }

  return cachedStories || []
}

export async function getStoryById(id: number): Promise<StoryWithId | null> {
  const stories = await getAllStories()
  return stories.find(s => s.id === id) || null
}

export async function searchStories(query: string): Promise<StoryWithId[]> {
  const stories = await getAllStories()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return stories
  }

  return stories.filter(
    (story) =>
      story.title.toLowerCase().includes(lowerQuery) ||
      story.description.toLowerCase().includes(lowerQuery) ||
      (story.keywords && story.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))),
  )
}

export async function getRelatedStories(story: StoryWithId, limit: number = 3): Promise<StoryWithId[]> {
  const allStories = await getAllStories()

  if (!story.keywords || story.keywords.length === 0) {
    return allStories
      .filter(s => s.id !== story.id)
      .slice(0, limit)
  }

  const related = allStories
    .filter(s => s.id !== story.id)
    .map(s => {
      const matchingKeywords = s.keywords?.filter(k =>
        story.keywords?.some(mk => mk.toLowerCase() === k.toLowerCase())
      ).length || 0
      return { story: s, score: matchingKeywords }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.story)

  if (related.length < limit) {
    const existingIds = new Set([story.id, ...related.map(s => s.id)])
    const remaining = allStories.filter(s => !existingIds.has(s.id))
    return [...related, ...remaining.slice(0, limit - related.length)]
  }

  return related
}
