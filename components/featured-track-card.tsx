import Image from "next/image"
import Link from "next/link"
import { Play, Heart, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StoryWithId } from "@/types/story"
import type { StoryPlayCount } from "@/types/supabase"

interface FeaturedTrackCardProps {
    track: StoryPlayCount
    story: StoryWithId
    className?: string
}

export function FeaturedTrackCard({ track, story, className }: FeaturedTrackCardProps) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm mb-12 relative overflow-hidden group blur-reveal",
                className
            )}
            style={{ animationDelay: "0.1s" }}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="relative w-full md:w-64 aspect-square rounded-2xl overflow-hidden shadow-inner bg-muted">
                    <Image
                        src={story.thumbnail}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        #1 Top Pick
                    </div>
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col h-full justify-center">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-muted-foreground text-sm font-medium">
                            <Headphones className="w-4 h-4" />
                            <span>Played {track.play_count.toLocaleString()} times</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-3">{story.title}</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 line-clamp-2">{story.description}</p>

                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <Link href={`/?playId=${story.id}`}>
                                <button className="h-12 px-8 bg-foreground text-background rounded-full text-sm font-semibold tracking-wide hover:bg-foreground/90 hover:shadow-lg hover:shadow-foreground/20 transition-all duration-300 flex items-center gap-2">
                                    <Play className="w-4 h-4 fill-current" />
                                    Play Now
                                </button>
                            </Link>
                            <button className="h-12 w-12 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors bg-background">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
