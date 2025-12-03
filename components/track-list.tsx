"use client"

import { Play, Pause, MoreHorizontal, Heart, Star } from "lucide-react"
import type { StoryWithId } from "@/types/story"
import { useStoryTracking } from "@/hooks/use-story-tracking"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

// Loading indicator for track action buttons
function TrackActionsLoading() {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="w-4 h-4 text-muted-foreground" />
    </div>
  )
}

interface TrackListProps {
  stories: StoryWithId[]
  currentTrackIndex: number
  isPlaying: boolean
  onTrackSelect: (index: number) => void
}

export function TrackList({ stories, currentTrackIndex, isPlaying, onTrackSelect }: TrackListProps) {
  const { initializing: authInitializing } = useAuth()
  const { isLiked, isFavorited, toggleLike, toggleFavorite, isAuthenticated, loading: trackingLoading } = useStoryTracking()

  // Show loading indicator while auth is initializing or tracking data is loading
  const showActionLoading = authInitializing || (isAuthenticated && trackingLoading)

  // Use actual story ID instead of array index
  const handleLikeClick = async (e: React.MouseEvent, storyId: number) => {
    e.stopPropagation()
    if (!isAuthenticated) return
    await toggleLike(storyId)
  }

  const handleFavoriteClick = async (e: React.MouseEvent, storyId: number) => {
    e.stopPropagation()
    if (!isAuthenticated) return
    await toggleFavorite(storyId)
  }

  return (
    <div className="mt-24 max-w-4xl mx-auto w-full overflow-hidden">
      <div className="flex items-end justify-between mb-8">
        <h3 className="text-xl font-medium tracking-tight text-foreground">All Stories</h3>
        <span className="text-sm font-medium text-muted-foreground">{stories.length} tracks</span>
      </div>

      <div className="grid gap-3">
        {stories.map((track, index) => {
          const isCurrentTrack = currentTrackIndex === index
          // Use actual story ID for like/favorite status
          const trackIsLiked = isLiked(track.id)
          const trackIsFavorited = isFavorited(track.id)

          return (
            <div
              key={index}
              className={`group flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${isCurrentTrack
                ? "bg-card border-celadon shadow-sm"
                : "bg-card/40 border-border/60 hover:bg-card hover:border-border hover:shadow-sm"
                }`}
              onClick={() => onTrackSelect(index)}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 mr-3">
                <img
                  src={track.thumbnail || "/placeholder.svg"}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${isCurrentTrack ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0 overflow-hidden">
                <h4 className="text-sm font-semibold text-foreground truncate">{track.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 break-words">{track.description}</p>
                {track.keywords && track.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {track.keywords.slice(0, 3).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-medium bg-celadon-light/50 text-celadon-dark rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center gap-2 shrink-0">
                {/* Show loading indicator during auth/tracking initialization */}
                {showActionLoading ? (
                  <TrackActionsLoading />
                ) : isAuthenticated ? (
                  <>
                    <button
                      className={`p-1.5 rounded-full transition-colors ${trackIsFavorited ? "text-amber-400" : "text-muted-foreground/50 hover:text-foreground"}`}
                      onClick={(e) => handleFavoriteClick(e, track.id)}
                      aria-label={trackIsFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`w-4 h-4 ${trackIsFavorited ? "fill-amber-400" : ""}`} />
                    </button>
                    <button
                      className={`p-1.5 rounded-full transition-colors ${trackIsLiked ? "text-peach" : "text-muted-foreground/50 hover:text-foreground"}`}
                      onClick={(e) => handleLikeClick(e, track.id)}
                      aria-label={trackIsLiked ? "Unlike" : "Like"}
                    >
                      <Heart className={`w-4 h-4 ${trackIsLiked ? "fill-peach" : ""}`} />
                    </button>
                  </>
                ) : null}
                <button
                  className="p-1.5 text-muted-foreground/50 hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
