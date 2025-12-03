"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Heart, History, Settings, BarChart3, Star } from "lucide-react"

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  const openSignIn = () => {
    setAuthMode("signin")
    setIsAuthModalOpen(true)
  }

  const openSignUp = () => {
    setAuthMode("signup")
    setIsAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={openSignIn}
            className="hidden md:block px-4 py-2 text-xs font-semibold tracking-wide bg-primary text-primary-foreground rounded-full hover:bg-celadon-dark hover:shadow-lg hover:shadow-celadon/30 transition-all duration-300"
          >
            Sign in
          </button>
          <button
            onClick={openSignUp}
            className="hidden md:block px-4 py-2 text-xs font-semibold tracking-wide border border-border rounded-full hover:bg-accent transition-all duration-300"
          >
            Sign up
          </button>
          <button
            onClick={openSignIn}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    )
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/favorites">
            <Heart className="mr-2 h-4 w-4" />
            <span>My Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/most-played">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Most Played</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/most-favorited">
            <Star className="mr-2 h-4 w-4" />
            <span>Most Favorited</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <History className="mr-2 h-4 w-4" />
          <span>Listening History</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={loading}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

