"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ArrowLeft, Music, Clock, Play, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getStoryById } from "@/lib/stories"
import { Navigation } from "@/components/navigation"
import { AmbientBackground } from "@/components/ambient-background"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { StoryWithId } from "@/types/story"
import type { StoryFavoritesCount } from "@/types/supabase"

interface FavoritesCountWithStory extends StoryFavoritesCount {
  story: StoryWithId | null
}

function TrackCard({
  track,
  story,
  rank,
}: {
  track: FavoritesCountWithStory
  story: StoryWithId
  rank: number
}) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={story.thumbnail}
          alt={story.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Rank badge */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
          {rank}
        </div>
        {/* Favorites count badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {track.favorites_count.toLocaleString()}
        </div>
        {/* Play button on hover */}
        <Link
          href={`/?playId=${story.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </Link>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.description}</p>
        {story.keywords && story.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.keywords.slice(0, 3).map((keyword) => (
              <span key={keyword} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MostFavoritedPage() {
  const [tracks, setTracks] = useState<FavoritesCountWithStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMostFavorited = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      // Fetch favorites counts sorted by most favorited
      const { data, error: fetchError } = await supabase
        .from("meditation_favorites_count")
        .select("*")
        .order("favorites_count", { ascending: false })
        .limit(50)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Map favorites counts to include story details from local data
      const favoritesCountData: StoryFavoritesCount[] = data ?? []
      const tracksWithStories: FavoritesCountWithStory[] = await Promise.all(favoritesCountData.map(async (fc) => ({
        ...fc,
        story: await getStoryById(fc.meditation_id),
      })))

      // Filter out any tracks where story doesn't exist
      setTracks(tracksWithStories.filter((t) => t.story !== null))
    } catch (err) {
      console.error("Error fetching most favorited:", err)
      setError(err instanceof Error ? err.message : "Failed to load most favorited tracks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMostFavorited()
  }, [fetchMostFavorited])

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-20">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Be the first to favorite stories and they will appear here.
      </p>
      <Link href="/"><Button><Music className="w-4 h-4 mr-2" />Explore Stories</Button></Link>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
      <Button onClick={fetchMostFavorited}>Try Again</Button>
    </div>
  )

  const renderTracks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track, index) => {
        const story = track.story
        if (!story) return null
        return <TrackCard key={track.meditation_id} track={track} story={story} rank={index + 1} />
      })}
    </div>
  )

  return (
    <div className="bg-background text-foreground antialiased selection:bg-celadon-light selection:text-primary-foreground overflow-x-hidden relative min-h-screen">
      <AmbientBackground />
      <Navigation />

      <main className="pt-32 pb-24 px-6 relative max-w-6xl mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Most Favorited</h1>
              <p className="text-muted-foreground">
                {tracks.length > 0
                  ? `Top ${tracks.length} most loved stor${tracks.length !== 1 ? "ies" : "y"}`
                  : "Community favorite stories"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? renderLoadingState() : error ? renderErrorState() : tracks.length === 0 ? renderEmptyState() : renderTracks()}
      </main>

      <Footer />
    </div>
  )
}

