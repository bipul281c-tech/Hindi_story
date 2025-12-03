"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, User, CheckCircle2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [signupComplete, setSignupComplete] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  // Reset mode when defaultMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
      setSignupComplete(false)
      resetForm()
    }
  }, [isOpen, defaultMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password)
        if (error) {
          setErrorMessage(error.message)
        } else {
          toast({
            title: "Signed in successfully",
            description: "Welcome back to your meditation journey.",
          })
          onClose()
          resetForm()
        }
      } else {
        const { error } = await signUp(email, password, displayName)
        if (error) {
          setErrorMessage(error.message)
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account.",
          })
          setSuccessMessage("Check your email for the confirmation link!")
          setSignupComplete(true)
        }
      }
    } catch {
      setErrorMessage("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setDisplayName("")
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {signupComplete ? (
          // Success screen after signup
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-semibold">
                Check Your Email
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                We&apos;ve sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
                Please check your inbox and click the link to activate your account.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-4 space-y-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setMode("signin")
                  setSignupComplete(false)
                  setPassword("")
                }}
              >
                Sign In Instead
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Normal sign in / sign up form
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </DialogTitle>
              <DialogDescription>
                {mode === "signin"
                  ? "Sign in to save your meditation progress and preferences"
                  : "Join to track your meditation journey"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  {successMessage}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

