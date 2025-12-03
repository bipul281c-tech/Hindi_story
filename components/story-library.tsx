"use client"

import { useState, useMemo } from "react"
import type { StoryWithId } from "@/types/story"
import { FilterBar } from "@/components/filter-bar"
import { StoryGrid } from "@/components/story-grid"
import { useRouter } from "next/navigation"

interface StoryLibraryProps {
    initialStories: StoryWithId[]
}

export function StoryLibrary({ initialStories }: StoryLibraryProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

    // Extract all unique keywords from stories
    const availableKeywords = useMemo(() => {
        const keywords = new Set<string>()
        initialStories.forEach((story) => {
            story.keywords?.forEach((k) => keywords.add(k))
        })
        return Array.from(keywords).sort()
    }, [initialStories])

    // Filter stories based on search, duration, and keyword
    const filteredStories = useMemo(() => {
        return initialStories.filter((story) => {
            // Search filter
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch =
                !searchQuery ||
                story.title.toLowerCase().includes(searchLower) ||
                story.description.toLowerCase().includes(searchLower) ||
                story.keywords?.some((k) => k.toLowerCase().includes(searchLower))

            // Duration filter (parsing "X Minute" from title)
            let matchesDuration = true
            if (selectedDuration) {
                // Extract number from selected duration (e.g., "10 Minute" -> 10)
                const targetMinutes = parseInt(selectedDuration)

                // Check if title contains the duration string (e.g., "10 Minute")
                // We look for the number followed by "minute" or "min"
                const durationRegex = new RegExp(`\\b${targetMinutes}\\s*(?:minute|min)`, 'i')
                matchesDuration = durationRegex.test(story.title)
            }

            // Keyword filter
            const matchesKeyword =
                !selectedKeyword ||
                story.keywords?.includes(selectedKeyword)

            return matchesSearch && matchesDuration && matchesKeyword
        })
    }, [initialStories, searchQuery, selectedDuration, selectedKeyword])

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Story Library</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore our collection of Hindi stories designed to entertain, inspire, and transport you.
                </p>
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                selectedKeyword={selectedKeyword}
                onKeywordChange={setSelectedKeyword}
                availableKeywords={availableKeywords}
                resultCount={filteredStories.length}
            />

            <StoryGrid
                stories={filteredStories}
                onPlay={(story) => {
                    // Navigate to home page with the track ID to play it
                    router.push(`/?playId=${story.id}`)
                }}
            />
        </div>
    )
}
