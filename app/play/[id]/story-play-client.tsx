"use client"

import { useState, useEffect } from "react"
import { StoryPlayer } from "@/components/story-player"
import { StoryGrid } from "@/components/story-grid"
import type { StoryWithId } from "@/types/story"
import { useStoryTracking } from "@/hooks/use-story-tracking"
import { useAuth } from "@/contexts/auth-context"
import { Heart, Star, Share2, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface StoryPlayClientProps {
  meditation: StoryWithId // Keeping prop name 'meditation' for now to match page.tsx, but type is StoryWithId
  relatedMeditations: StoryWithId[]
}

export function StoryPlayClient({ meditation: story, relatedMeditations: relatedStories }: StoryPlayClientProps) {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { isLiked, isFavorited, toggleLike, toggleFavorite } = useStoryTracking()

  const [liked, setLiked] = useState(false)
  const [favorited, setFavorited] = useState(false)

  // Sync local state with tracking hook
  useEffect(() => {
    setLiked(isLiked(story.id))
    setFavorited(isFavorited(story.id))
  }, [isLiked, isFavorited, story.id])

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like stories")
      return
    }
    const newStatus = await toggleLike(story.id)
    setLiked(newStatus)
    toast.success(newStatus ? "Added to liked stories" : "Removed from liked stories")
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites")
      return
    }
    const newStatus = await toggleFavorite(story.id)
    setFavorited(newStatus)
    toast.success(newStatus ? "Added to favorites" : "Removed from favorites")
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: story.title,
        text: `Listen to ${story.title} on Hindi Story Audiobook`,
        url: window.location.href,
      })
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  // Format date
  const publishDate = new Date(story.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Main Player Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-celadon/20 text-celadon-dark hover:bg-celadon/30 transition-colors">
                {story.category}
              </Badge>
              {story.duration && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(story.duration / 60)} min
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {story.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {publishDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full transition-all ${liked ? "text-peach border-peach/50 bg-peach/10" : ""}`}
              onClick={handleLikeClick}
              title={liked ? "Unlike" : "Like"}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full transition-all ${favorited ? "text-amber-400 border-amber-400/50 bg-amber-400/10" : ""}`}
              onClick={handleFavoriteClick}
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <StoryPlayer stories={[story]} />

        <div className="prose prose-stone dark:prose-invert max-w-none bg-card/50 p-6 rounded-2xl border border-border/50">
          <h3 className="text-xl font-semibold mb-3">About this Story</h3>
          <p className="text-muted-foreground leading-relaxed">
            {story.description}
          </p>

          {story.keywords && story.keywords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {story.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* Related Stories Section */}
      {relatedStories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Related Stories</h2>
            <a href="/library" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              View all
            </a>
          </div>

          <StoryGrid
            stories={relatedStories}
            onPlay={(s) => window.location.href = `/?playId=${s.id}`}
          />
        </section>
      )}
    </div>
  )
}
