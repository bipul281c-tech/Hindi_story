"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, Star } from "lucide-react"
import { TrackList } from "./track-list"
import type { StoryWithId } from "@/types/story"
import { useStoryTracking } from "@/hooks/use-story-tracking"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

// Loading indicator for like/favorite buttons during auth loading
function ActionButtonsLoading() {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="w-5 h-5 text-muted-foreground" />
    </div>
  )
}

interface StoryPlayerProps {
  stories: StoryWithId[]
}

import { useSearchParams, useRouter } from "next/navigation"

export function StoryPlayer({ stories }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [hasRecordedPlay, setHasRecordedPlay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const { user, initializing: authInitializing } = useAuth()
  const {
    isLiked,
    isFavorited,
    toggleLike,
    toggleFavorite,
    recordPlay,
    updateProgress,
    isAuthenticated,
    loading: trackingLoading
  } = useStoryTracking()

  // Show loading indicator while auth is initializing (but tracking data is loading)
  const showActionLoading = authInitializing || (isAuthenticated && trackingLoading)

  const currentTrack = stories[currentTrackIndex]
  // Use the actual story ID for like/favorite checks, not the array index
  const currentStoryId = currentTrack?.id
  const currentIsLiked = isLiked(currentStoryId)
  const currentIsFavorited = isFavorited(currentStoryId)

  // Handle playId from URL
  useEffect(() => {
    const playId = searchParams.get("playId")
    if (playId) {
      const trackId = parseInt(playId)
      const index = stories.findIndex(s => s.id === trackId)

      if (index !== -1) {
        setCurrentTrackIndex(index)
        setIsPlaying(true)
        // Wait for audio ref to be ready then play
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error)
          }
        }, 500)

        // Clear the param without refreshing
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [searchParams, stories])

  // Reset hasRecordedPlay when track changes
  useEffect(() => {
    setHasRecordedPlay(false)
  }, [currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      // Record completion
      if (isAuthenticated) {
        updateProgress(Math.floor(audio.duration || 0), true)
      }
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        handleNext()
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isRepeat, currentTrackIndex, isAuthenticated, updateProgress])

  // Progress tracking interval
  useEffect(() => {
    if (isPlaying && isAuthenticated) {
      progressUpdateIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          updateProgress(Math.floor(audioRef.current.currentTime))
        }
      }, 10000) // Update every 10 seconds
    } else {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current)
      }
    }

    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current)
      }
    }
  }, [isPlaying, isAuthenticated, updateProgress])

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        // Record play when starting for the first time - use actual story ID
        if (!hasRecordedPlay && isAuthenticated && duration > 0 && currentStoryId) {
          recordPlay(currentStoryId, Math.floor(duration))
          setHasRecordedPlay(true)
        }
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying, hasRecordedPlay, isAuthenticated, duration, currentStoryId, recordPlay])

  const handleLikeClick = async () => {
    if (!isAuthenticated || !currentStoryId) return
    await toggleLike(currentStoryId)
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || !currentStoryId) return
    await toggleFavorite(currentStoryId)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleNext = () => {
    let nextIndex: number

    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * stories.length)
      } while (nextIndex === currentTrackIndex && stories.length > 1)
    } else {
      nextIndex = (currentTrackIndex + 1) % stories.length
    }

    setCurrentTrackIndex(nextIndex)
    setCurrentTime(0)
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play(), 100)
    }
  }

  const handlePrev = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      return
    }

    const prevIndex = (currentTrackIndex - 1 + stories.length) % stories.length
    setCurrentTrackIndex(prevIndex)
    setCurrentTime(0)
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play(), 100)
    }
  }

  const handleTrackSelect = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay()
    } else {
      setCurrentTrackIndex(index)
      setCurrentTime(0)
      setIsPlaying(true)
      setTimeout(() => audioRef.current?.play(), 100)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentTrack) return null

  return (
    <>
      <div className="relative max-w-4xl mx-auto w-full blur-reveal delay-300">
        <audio ref={audioRef} src={currentTrack.audio_link} preload="metadata" />

        <div className="bg-card/60 backdrop-blur-xl border border-card/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-celadon-light/30 to-transparent pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Cover Art - using thumbnail */}
            <div
              className="aspect-square rounded-2xl bg-muted relative overflow-hidden group cursor-pointer shadow-inner"
              onClick={togglePlay}
            >
              <img
                src={currentTrack.thumbnail || "/placeholder.svg"}
                alt={currentTrack.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/0 transition-colors duration-500" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-card/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-foreground fill-foreground" />
                  ) : (
                    <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Player Controls - simplified info display */}
            <div className="flex flex-col h-full justify-between py-2">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Now Playing</span>
                  {/* Show loading indicator during auth/tracking initialization to prevent layout shift */}
                  {showActionLoading ? (
                    <ActionButtonsLoading />
                  ) : (
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleFavoriteClick}
                              className={`transition-colors ${isAuthenticated ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/50 cursor-not-allowed"}`}
                              aria-label={currentIsFavorited ? "Remove from favorites" : "Add to favorites"}
                              disabled={!isAuthenticated}
                            >
                              <Star className={`w-5 h-5 ${currentIsFavorited ? "fill-amber-400 text-amber-400" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isAuthenticated ? (currentIsFavorited ? "Remove from favorites" : "Add to favorites") : "Sign in to save favorites"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleLikeClick}
                              className={`transition-colors ${isAuthenticated ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/50 cursor-not-allowed"}`}
                              aria-label={currentIsLiked ? "Unlike" : "Like"}
                              disabled={!isAuthenticated}
                            >
                              <Heart className={`w-5 h-5 ${currentIsLiked ? "fill-peach text-peach" : ""}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isAuthenticated ? (currentIsLiked ? "Unlike" : "Like") : "Sign in to like tracks"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-foreground tracking-tight mb-3 line-clamp-2">
                  {currentTrack.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{currentTrack.description}</p>
              </div>

              <div className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 audio-slider"
                    aria-label="Seek Slider"
                  />
                  <div className="flex justify-between text-xs font-medium text-muted-foreground tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 transition-colors ${isShuffle ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label={isShuffle ? "Disable Shuffle" : "Enable Shuffle"}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-6">
                    <button onClick={handlePrev} className="text-foreground/70 hover:text-foreground transition-colors" aria-label="Previous Track">
                      <SkipBack className="w-6 h-6 fill-foreground/20" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-celadon-dark shadow-xl shadow-celadon/30 transition-all duration-300 transform hover:scale-105"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>

                    <button onClick={handleNext} className="text-foreground/70 hover:text-foreground transition-colors" aria-label="Next Track">
                      <SkipForward className="w-6 h-6 fill-foreground/20" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 transition-colors ${isRepeat ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label={isRepeat ? "Disable Repeat" : "Enable Repeat"}
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-8 left-4 right-4 h-12 bg-celadon/20 blur-2xl rounded-[100%] -z-10" />
      </div>

      {/* Track list - using index-based selection */}
      <TrackList
        stories={stories}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onTrackSelect={handleTrackSelect}
      />
    </>
  )
}
