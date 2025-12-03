"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import type { ListeningHistory } from "@/types/supabase"

interface UseListeningHistoryResult {
  history: ListeningHistory[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  getRecentlyPlayed: (limit?: number) => ListeningHistory[]
  getMostPlayed: () => { meditationId: number; playCount: number }[]
  getTotalListeningTime: () => number
}

export function useListeningHistory(): UseListeningHistoryResult {
  const { user } = useAuth()
  const [history, setHistory] = useState<ListeningHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from("listening_history")
        .select("*")
        .eq("user_id", user.id)
        .order("played_at", { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setHistory(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch history"))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const getRecentlyPlayed = useCallback((limit: number = 10): ListeningHistory[] => {
    // Get unique meditations by most recent play
    const seen = new Set<number>()
    const unique: ListeningHistory[] = []

    for (const item of history) {
      if (!seen.has(item.meditation_id)) {
        seen.add(item.meditation_id)
        unique.push(item)
        if (unique.length >= limit) break
      }
    }

    return unique
  }, [history])

  const getMostPlayed = useCallback((): { meditationId: number; playCount: number }[] => {
    const counts = new Map<number, number>()

    for (const item of history) {
      counts.set(item.meditation_id, (counts.get(item.meditation_id) || 0) + 1)
    }

    return Array.from(counts.entries())
      .map(([meditationId, playCount]) => ({ meditationId, playCount }))
      .sort((a, b) => b.playCount - a.playCount)
  }, [history])

  const getTotalListeningTime = useCallback((): number => {
    return history.reduce((total, item) => total + item.progress_seconds, 0)
  }, [history])

  return {
    history,
    loading,
    error,
    refresh: fetchHistory,
    getRecentlyPlayed,
    getMostPlayed,
    getTotalListeningTime,
  }
}

