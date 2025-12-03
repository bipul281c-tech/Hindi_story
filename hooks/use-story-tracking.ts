"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface TrackingState {
  likedStories: Set<number>
  favoriteStories: Set<number>
  loading: boolean
}

export function useStoryTracking() {
  const { user } = useAuth()
  const [state, setState] = useState<TrackingState>({
    likedStories: new Set(),
    favoriteStories: new Set(),
    loading: true,
  })
  const currentHistoryIdRef = useRef<string | null>(null)

  // Fetch user's likes and favorites on mount
  useEffect(() => {
    if (!user) {
      setState({ likedStories: new Set(), favoriteStories: new Set(), loading: false })
      return
    }

    const fetchUserData = async () => {
      const supabase = createClient()

      const [likesResult, favoritesResult] = await Promise.all([
        supabase.from("meditation_likes").select("meditation_id").eq("user_id", user.id),
        supabase.from("meditation_favorites").select("meditation_id").eq("user_id", user.id),
      ])

      setState({
        likedStories: new Set(likesResult.data?.map((l) => l.meditation_id) || []),
        favoriteStories: new Set(favoritesResult.data?.map((f) => f.meditation_id) || []),
        loading: false,
      })
    }

    fetchUserData()
  }, [user])

  const toggleLike = useCallback(async (storyId: number): Promise<boolean> => {
    if (!user) return false

    const supabase = createClient()
    const isLiked = state.likedStories.has(storyId)

    if (isLiked) {
      const { error } = await supabase
        .from("meditation_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("meditation_id", storyId)

      if (!error) {
        setState((prev) => {
          const newLikes = new Set(prev.likedStories)
          newLikes.delete(storyId)
          return { ...prev, likedStories: newLikes }
        })
        return false
      }
    } else {
      const { error } = await supabase
        .from("meditation_likes")
        .insert({ user_id: user.id, meditation_id: storyId })

      if (!error) {
        setState((prev) => {
          const newLikes = new Set(prev.likedStories)
          newLikes.add(storyId)
          return { ...prev, likedStories: newLikes }
        })
        return true
      }
    }
    return isLiked
  }, [user, state.likedStories])

  const toggleFavorite = useCallback(async (storyId: number): Promise<boolean> => {
    if (!user) return false

    const supabase = createClient()
    const isFavorited = state.favoriteStories.has(storyId)

    if (isFavorited) {
      const { error } = await supabase
        .from("meditation_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("meditation_id", storyId)

      if (!error) {
        setState((prev) => {
          const newFavorites = new Set(prev.favoriteStories)
          newFavorites.delete(storyId)
          return { ...prev, favoriteStories: newFavorites }
        })
        return false
      }
    } else {
      const { error } = await supabase
        .from("meditation_favorites")
        .insert({ user_id: user.id, meditation_id: storyId })

      if (!error) {
        setState((prev) => {
          const newFavorites = new Set(prev.favoriteStories)
          newFavorites.add(storyId)
          return { ...prev, favoriteStories: newFavorites }
        })
        return true
      }
    }
    return isFavorited
  }, [user, state.favoriteStories])

  const recordPlay = useCallback(async (storyId: number, durationSeconds: number) => {
    if (!user) return null

    const supabase = createClient()

    // Record play in user's listening history
    const { data, error } = await supabase
      .from("listening_history")
      .insert({
        user_id: user.id,
        meditation_id: storyId,
        duration_seconds: durationSeconds,
        progress_seconds: 0,
        completed: false,
      })
      .select()
      .single()

    // Increment global play count for this story
    await supabase.rpc("increment_play_count", { p_meditation_id: storyId })

    if (!error && data) {
      currentHistoryIdRef.current = data.id
      return data.id
    }
    return null
  }, [user])

  const updateProgress = useCallback(async (progressSeconds: number, completed: boolean = false) => {
    if (!user || !currentHistoryIdRef.current) return

    const supabase = createClient()
    await supabase
      .from("listening_history")
      .update({ progress_seconds: progressSeconds, completed })
      .eq("id", currentHistoryIdRef.current)
  }, [user])

  const isLiked = useCallback((storyId: number) => state.likedStories.has(storyId), [state.likedStories])
  const isFavorited = useCallback((storyId: number) => state.favoriteStories.has(storyId), [state.favoriteStories])

  return {
    ...state, toggleLike, toggleFavorite, recordPlay, updateProgress, isLiked, isFavorited,
    isAuthenticated: !!user,
  }
}

