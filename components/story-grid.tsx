"use client"

import { Play, Heart, Star } from "lucide-react"
import type { StoryWithId } from "@/types/story"
import { useStoryTracking } from "@/hooks/use-story-tracking"
import { useAuth } from "@/contexts/auth-context"

interface StoryGridProps {
    stories: StoryWithId[]
    onPlay: (story: StoryWithId) => void
}

export function StoryGrid({ stories, onPlay }: StoryGridProps) {
    const { user } = useAuth()
    const isAuthenticated = !!user
    const { isLiked, isFavorited, toggleLike, toggleFavorite } = useStoryTracking()

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

    if (stories.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No stories found matching your criteria.</p>
                <p className="text-sm text-muted-foreground/60 mt-2">Try adjusting your filters or search terms.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => {
                const liked = isLiked(story.id)
                const favorited = isFavorited(story.id)

                return (
                    <div
                        key={story.id}
                        className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        onClick={() => onPlay(story)}
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={story.thumbnail || "/placeholder.svg"}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                                </div>
                            </div>

                            {isAuthenticated && (
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className={`p-2 rounded-full backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors ${favorited ? "text-amber-400" : "text-white/70 hover:text-white"
                                            }`}
                                        onClick={(e) => handleFavoriteClick(e, story.id)}
                                    >
                                        <Star className={`w-4 h-4 ${favorited ? "fill-amber-400" : ""}`} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-full backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors ${liked ? "text-peach" : "text-white/70 hover:text-white"
                                            }`}
                                        onClick={(e) => handleLikeClick(e, story.id)}
                                    >
                                        <Heart className={`w-4 h-4 ${liked ? "fill-peach" : ""}`} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-foreground line-clamp-1 mb-1" title={story.title}>
                                {story.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                                {story.description}
                            </p>

                            {story.keywords && story.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {story.keywords.slice(0, 2).map((keyword, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded-full"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                    {story.keywords.length > 2 && (
                                        <span className="px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                            +{story.keywords.length - 2} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
