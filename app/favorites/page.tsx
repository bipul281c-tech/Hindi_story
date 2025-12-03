"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Loader2, ArrowLeft, Music, Clock, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { getStoryById } from "@/lib/stories"
import { Navigation } from "@/components/navigation"
import { AmbientBackground } from "@/components/ambient-background"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { StoryWithId } from "@/types/story"
import type { StoryFavorite } from "@/types/supabase"

interface FavoriteWithStory extends StoryFavorite {
  story: StoryWithId | null
}

export default function FavoritesPage() {
  const { user, initializing } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteWithStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      // Fetch user's favorites from Supabase (RLS ensures only user's own favorites are returned)
      const { data, error: fetchError } = await supabase
        .from("meditation_favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Map favorites to include story details from local data
      const favoritesData: StoryFavorite[] = data ?? []
      const favoritesWithStories: FavoriteWithStory[] = await Promise.all(favoritesData.map(async (fav) => ({
        ...fav,
        story: await getStoryById(fav.meditation_id),
      })))

      setFavorites(favoritesWithStories)
    } catch (err) {
      console.error("Error fetching favorites:", err)
      setError(err instanceof Error ? err.message : "Failed to load favorites")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!initializing) {
      fetchFavorites()
    }
  }, [initializing, fetchFavorites])

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!user) return

    try {
      setRemovingId(favoriteId)
      const supabase = createClient()

      const { error: deleteError } = await supabase
        .from("meditation_favorites")
        .delete()
        .eq("id", favoriteId)
        .eq("user_id", user.id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Remove from local state
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
    } catch (err) {
      console.error("Error removing favorite:", err)
      setError(err instanceof Error ? err.message : "Failed to remove favorite")
    } finally {
      setRemovingId(null)
    }
  }

  // Render loading state
  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-20">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  )

  // Render unauthenticated state
  const renderUnauthenticatedState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Sign in to see your favorites</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create an account or sign in to save your favorite stories and access them anytime.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  )

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start exploring stories and add your favorites by clicking the heart icon.
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
      <Button onClick={fetchFavorites}>Try Again</Button>
    </div>
  )

  // Render favorites grid
  const renderFavorites = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => {
        const story = favorite.story
        if (!story) return null

        return (
          <Card
            key={favorite.id}
            className="overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={story.thumbnail}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                disabled={removingId === favorite.id}
                className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Remove from favorites"
              >
                {removingId === favorite.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {story.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {story.description}
              </p>
              {story.keywords && story.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {story.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Added {new Date(favorite.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )
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
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
              <p className="text-muted-foreground">
                {!initializing && user && favorites.length > 0
                  ? `${favorites.length} saved stor${favorites.length !== 1 ? "ies" : "y"}`
                  : "Your saved stories"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {initializing || loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : !user ? (
          renderUnauthenticatedState()
        ) : favorites.length === 0 ? (
          renderEmptyState()
        ) : (
          renderFavorites()
        )}
      </main>

      <Footer />
    </div>
  )
}

