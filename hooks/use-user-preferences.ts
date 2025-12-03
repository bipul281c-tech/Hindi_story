"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import type { UserPreferences } from "@/types/supabase"

interface UseUserPreferencesResult {
  preferences: UserPreferences | null
  loading: boolean
  error: Error | null
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
  refresh: () => Promise<void>
}

export function useUserPreferences(): UseUserPreferencesResult {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError) {
        // If no preferences exist yet, that's okay - they'll be created on first update
        if (fetchError.code === "PGRST116") {
          setPreferences(null)
          setError(null)
        } else {
          throw fetchError
        }
      } else {
        setPreferences(data)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch preferences"))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) return

    try {
      const supabase = createClient()

      if (preferences) {
        // Update existing preferences
        const { data, error } = await supabase
          .from("user_preferences")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select()
          .single()

        if (error) throw error
        setPreferences(data)
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from("user_preferences")
          .insert({
            user_id: user.id,
            ...updates,
          })
          .select()
          .single()

        if (error) throw error
        setPreferences(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update preferences"))
      throw err
    }
  }, [user, preferences])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refresh: fetchPreferences,
  }
}

