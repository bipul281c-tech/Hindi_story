import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Hindi Story Audiobook | Immersive Audio Stories",
    template: "%s | Hindi Story Audiobook",
  },
  description:
    "Immersive Hindi audio stories, audiobooks, and narratives designed to entertain, inspire, and transport you. Hindi Story Audiobook.",
  applicationName: "Hindi Story Audiobook",
  authors: [{ name: "Hindi Story Audiobook Team" }],
  generator: "v0.app",
  keywords: ["hindi stories", "audiobooks", "hindi audiobook", "storytelling", "narratives", "audio stories", "hindi kahaniya"],
  referrer: "origin-when-cross-origin",
  creator: "Hindi Story Audiobook Team",
  publisher: "Hindi Story Audiobook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.quick.dailymeditationguide.com"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Hindi Story Audiobook RSS Feed" },
      ],
    },
  },
  openGraph: {
    title: "Hindi Story Audiobook | Immersive Audio Stories",
    description:
      "Immersive Hindi audio stories, audiobooks, and narratives designed to entertain, inspire, and transport you.",
    url: "https://www.quick.dailymeditationguide.com",
    siteName: "Hindi Story Audiobook",
    images: [
      {
        url: "/calm-ocean-waves-at-sunset.jpg", // Using existing high-quality image
        width: 1200,
        height: 630,
        alt: "Hindi Story Audiobook - Immersive Audio Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hindi Story Audiobook | Immersive Audio Stories",
    description:
      "Immersive Hindi audio stories, audiobooks, and narratives designed to entertain, inspire, and transport you.",
    images: ["/calm-ocean-waves-at-sunset.jpg"], // Using existing high-quality image
    creator: "@hindistoryaudiobook", // Placeholder
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/logo.svg", color: "#A3D1A0" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Meditation Guide",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "6i0ECTV7zHVRPDhVgk9P21_V-O_nTyq0hPJ6uIT4Q5Q",
    other: {
      "p:domain_verify": "94ff2d85419b649a79ce54d052843491",
    },
  },
}

export const viewport = {
  themeColor: "#A3D1A0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Playwrite+DE+Grund:wght@100..400&display=swap');`}
        </style>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
