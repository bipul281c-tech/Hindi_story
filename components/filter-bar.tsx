"use client"

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FilterBarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    selectedDuration: string | null
    onDurationChange: (duration: string | null) => void
    selectedKeyword: string | null
    onKeywordChange: (keyword: string | null) => void
    availableKeywords: string[]
    resultCount: number
}

const DURATIONS = ["5 Minute", "10 Minute", "20 Minute"]

export function FilterBar({
    searchQuery,
    onSearchChange,
    selectedDuration,
    onDurationChange,
    selectedKeyword,
    onKeywordChange,
    availableKeywords,
    resultCount,
}: FilterBarProps) {
    return (
        <div className="space-y-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search meditations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-card/50 border-border/50 focus:bg-card transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                    {resultCount} {resultCount === 1 ? "meditation" : "meditations"} found
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Duration:</span>
                    {DURATIONS.map((duration) => (
                        <Badge
                            key={duration}
                            variant={selectedDuration === duration ? "default" : "outline"}
                            className={`cursor-pointer transition-all hover:scale-105 ${selectedDuration === duration
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-card hover:bg-accent hover:text-accent-foreground"
                                }`}
                            onClick={() => onDurationChange(selectedDuration === duration ? null : duration)}
                        >
                            {duration}s
                        </Badge>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Topics:</span>
                    {availableKeywords.slice(0, 10).map((keyword) => (
                        <Badge
                            key={keyword}
                            variant={selectedKeyword === keyword ? "secondary" : "outline"}
                            className={`cursor-pointer transition-all hover:scale-105 ${selectedKeyword === keyword
                                    ? "bg-celadon text-celadon-foreground hover:bg-celadon/90"
                                    : "bg-card hover:bg-accent hover:text-accent-foreground"
                                }`}
                            onClick={() => onKeywordChange(selectedKeyword === keyword ? null : keyword)}
                        >
                            {keyword}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}
