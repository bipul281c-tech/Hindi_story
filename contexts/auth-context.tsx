"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import type { User, Session, AuthError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { UserProfile } from "@/types/supabase"

// Session hint key for localStorage - used for optimistic UI
const SESSION_HINT_KEY = "supabase_session_hint"

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  initializing: boolean  // True only during first load
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to get session hint from localStorage (sync, for immediate render)
function getSessionHint(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "true"
  } catch {
    return false
  }
}

// Helper to set session hint in localStorage
function setSessionHint(hasSession: boolean) {
  if (typeof window === "undefined") return
  try {
    if (hasSession) {
      localStorage.setItem(SESSION_HINT_KEY, "true")
    } else {
      localStorage.removeItem(SESSION_HINT_KEY)
    }
  } catch {
    // Ignore localStorage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use session hint for optimistic initial state (prevents flash)
  const hasSessionHint = getSessionHint()

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)  // Only true during sign in/out operations
  const [initializing, setInitializing] = useState(true)  // True until first auth check completes
  const [error, setError] = useState<AuthError | null>(null)

  // Track if we've received the first auth state change
  const hasInitialized = useRef(false)
  // Cache profile to avoid refetching
  const profileCache = useRef<Map<string, UserProfile>>(new Map())

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    // Check cache first
    const cached = profileCache.current.get(userId)
    if (cached) return cached

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        // Profile might not exist yet (new user) - that's okay
        if (error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
        }
        return null
      }

      // Cache the profile
      if (data) {
        profileCache.current.set(userId, data)
      }
      return data
    } catch (err) {
      console.error("Error fetching profile:", err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      // Clear cache and refetch
      profileCache.current.delete(user.id)
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    const supabase = createClient()

    // Use onAuthStateChange as the single source of truth
    // It fires immediately with the current session (from cookies/storage)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Update session hint for next page load
        setSessionHint(!!newSession)

        // Set session and user immediately for fast UI update
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setError(null)

        // Mark as initialized after first event
        if (!hasInitialized.current) {
          hasInitialized.current = true
          setInitializing(false)
        }

        // Fetch profile in background (don't block UI)
        if (newSession?.user) {
          // Don't await - let it update asynchronously
          fetchProfile(newSession.user.id).then(setProfile)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) setError(error)
    return { error }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const supabase = createClient()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    setLoading(false)
    if (error) setError(error)
    return { error }
  }

  const signOut = async () => {
    const supabase = createClient()
    setLoading(true)
    // Clear session hint immediately for faster UI feedback
    setSessionHint(false)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    profileCache.current.clear()
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading, initializing, error,
      signIn, signUp, signOut, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

