"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getStoryById } from "@/lib/stories"
import { Navigation } from "@/components/navigation"
import { AmbientBackground } from "@/components/ambient-background"
import { Footer } from "@/components/footer"
import { StatsHeader } from "@/components/stats-header"
import { FeaturedTrackCard } from "@/components/featured-track-card"
import { TrackRankingList } from "@/components/track-ranking-list"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BarChart3, Music } from "lucide-react"
import Link from "next/link"
import type { StoryWithId } from "@/types/story"
import type { StoryPlayCount } from "@/types/supabase"

interface PlayCountWithStory extends StoryPlayCount {
  story: StoryWithId | null
}

export default function MostPlayedPage() {
  const [tracks, setTracks] = useState<PlayCountWithStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMostPlayed = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      // Fetch GLOBAL play counts sorted by most played (across ALL users)
      const { data, error: fetchError } = await supabase
        .from("meditation_play_counts")
        .select("*")
        .order("play_count", { ascending: false })
        .limit(50)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Map play counts to include story details from local data
      const playCountsData: StoryPlayCount[] = data ?? []
      const tracksWithStories: PlayCountWithStory[] = await Promise.all(playCountsData.map(async (pc) => ({
        ...pc,
        story: await getStoryById(pc.meditation_id),
      })))

      // Filter out any tracks where story doesn't exist
      setTracks(tracksWithStories.filter((t) => t.story !== null))
    } catch (err) {
      console.error("Error fetching most played:", err)
      setError(err instanceof Error ? err.message : "Failed to load most played tracks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMostPlayed()
  }, [fetchMostPlayed])

  // Render loading state
  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-20">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  )

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No plays yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Be the first to listen! Tracks played by our community will appear here sorted by popularity.
      </p>
      <Link href="/">
        <Button>
          <Music className="w-4 h-4 mr-2" />
          Explore Stories
        </Button>
      </Link>
    </div>
  )

  // Render error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
      <Button onClick={fetchMostPlayed}>Try Again</Button>
    </div>
  )

  return (
    <div className="bg-background text-foreground antialiased selection:bg-celadon-light selection:text-primary-foreground overflow-x-hidden relative min-h-screen flex flex-col">
      <AmbientBackground />
      <Navigation />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        <StatsHeader />

        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : tracks.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Featured Track (Rank #1) */}
            {tracks[0] && tracks[0].story && (
              <FeaturedTrackCard
                track={tracks[0]}
                story={tracks[0].story}
              />
            )}

            {/* Ranking List (Rank #2+) */}
            {tracks.length > 1 && (
              <TrackRankingList tracks={tracks.slice(1)} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

