"use client"

import Image from "next/image"
import { Chrome, Sparkles, Bell, Clock, X } from "lucide-react"
import { useState } from "react"

export function ExtensionPromo() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-celadon/20 via-card to-peach-light/20 rounded-3xl p-8 md:p-12 border border-border/50 shadow-lg overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-celadon/30 to-transparent rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-peach/30 to-transparent rounded-full blur-3xl -z-10" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-celadon/20 border border-celadon/30 text-sm font-medium text-celadon-dark">
                <Sparkles className="w-4 h-4" />
                New Browser Extension
              </div>

              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Listen anywhere on the web
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Enjoy immersive stories without leaving your browser. Our extension brings Hindi audiobooks and narratives right to your toolbar.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-celadon/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-celadon-dark" />
                  </div>
                  <span className="text-sm font-medium text-foreground">New Releases</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-peach/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-peach-dark" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Quick Stories</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:bg-celadon-dark transition-all duration-300 shadow-lg shadow-celadon/30 hover:-translate-y-0.5"
                >
                  <Chrome className="w-5 h-5" />
                  Add to Chrome
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full font-semibold text-sm hover:bg-muted hover:border-celadon transition-all duration-300"
                >
                  Learn More
                </a>
              </div>

              <p className="text-xs text-muted-foreground">
                Free to use • Also available for Firefox & Edge
              </p>
            </div>

            {/* Extension Preview */}
            <div className="relative flex justify-center">
              <div className="relative w-72 md:w-80">
                {/* Browser mockup */}
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Browser header */}
                  <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-peach/60" />
                      <div className="w-3 h-3 rounded-full bg-celadon/60" />
                      <div className="w-3 h-3 rounded-full bg-celadon-2/60" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground truncate">
                        yourwork.com
                      </div>
                    </div>
                    {/* Extension icon in toolbar */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-celadon to-celadon-2 flex items-center justify-center shadow-sm">
                      <Image
                        src="/logo.svg"
                        alt="Hindi Story Audiobook Extension"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>

                  {/* Extension popup preview */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.svg"
                        alt="Hindi Story Audiobook"
                        width={32}
                        height={32}
                      />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Hindi Story Audiobook</h4>
                        <p className="text-xs text-muted-foreground">Listen to a story</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-celadon/10 border border-celadon/20 flex items-center gap-3 cursor-pointer hover:bg-celadon/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-celadon/30 flex items-center justify-center">
                          <span className="text-sm">🧘</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Latest Stories</p>
                          <p className="text-xs text-muted-foreground">New arrivals</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-peach/10 border border-peach/20 flex items-center gap-3 cursor-pointer hover:bg-peach/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-peach/30 flex items-center justify-center">
                          <span className="text-sm">📚</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">My Library</p>
                          <p className="text-xs text-muted-foreground">Continue listening</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold shadow-lg">
                  FREE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

