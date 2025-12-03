import Image from "next/image"
import { Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Hindi Story Audiobook Logo"
            width={36}
            height={36}
          />
          <span className="text-sm font-semibold tracking-tighter text-foreground">HINDI STORY AUDIOBOOK © 2025</span>
        </div>

        <div className="flex gap-6 text-xs text-muted-foreground font-medium">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-celadon-dark transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-celadon-dark transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
