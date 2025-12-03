export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meditation_likes: {
        Row: {
          id: string
          user_id: string
          meditation_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meditation_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meditation_id?: number
          created_at?: string
        }
      }
      meditation_favorites: {
        Row: {
          id: string
          user_id: string
          meditation_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meditation_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meditation_id?: number
          created_at?: string
        }
      }
      listening_history: {
        Row: {
          id: string
          user_id: string
          meditation_id: number
          played_at: string
          duration_seconds: number
          progress_seconds: number
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          meditation_id: number
          played_at?: string
          duration_seconds?: number
          progress_seconds?: number
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          meditation_id?: number
          played_at?: string
          duration_seconds?: number
          progress_seconds?: number
          completed?: boolean
        }
      }
      meditation_play_counts: {
        Row: {
          meditation_id: number
          play_count: number
          last_played_at: string
          created_at: string
        }
        Insert: {
          meditation_id: number
          play_count?: number
          last_played_at?: string
          created_at?: string
        }
        Update: {
          meditation_id?: number
          play_count?: number
          last_played_at?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_duration: string
          preferred_categories: string[]
          auto_play: boolean
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_duration?: string
          preferred_categories?: string[]
          auto_play?: boolean
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_duration?: string
          preferred_categories?: string[]
          auto_play?: boolean
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      meditation_favorites_count: {
        Row: {
          meditation_id: number
          favorites_count: number
        }
      }
    }
    Functions: {
      increment_play_count: {
        Args: { p_meditation_id: number }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"]
export type MeditationLike = Database["public"]["Tables"]["meditation_likes"]["Row"]
export type MeditationFavorite = Database["public"]["Tables"]["meditation_favorites"]["Row"]
export type ListeningHistory = Database["public"]["Tables"]["listening_history"]["Row"]
export type UserPreferences = Database["public"]["Tables"]["user_preferences"]["Row"]
export type MeditationPlayCount = Database["public"]["Tables"]["meditation_play_counts"]["Row"]
export type MeditationFavoritesCount = Database["public"]["Views"]["meditation_favorites_count"]["Row"]

// Aliases for Story terminology
export type StoryLike = MeditationLike
export type StoryFavorite = MeditationFavorite
export type StoryPlayCount = MeditationPlayCount
export type StoryFavoritesCount = MeditationFavoritesCount

