import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AmbientBackground } from "@/components/ambient-background"
import { getStoryById, getAllStories, getRelatedStories } from "@/lib/stories"
import { Spinner } from "@/components/ui/spinner"
import { StoryPlayClient } from "./story-play-client"

interface PlayPageProps {
  params: Promise<{ id: string }>
}

// Generate static params for all stories - ensures all pages are pre-rendered
export async function generateStaticParams() {
  const stories = await getAllStories()
  return stories.map((story) => ({
    id: story.id.toString(),
  }))
}

// Helper to extract duration from title (e.g., "10 Minute" -> "PT10M")
function extractDuration(title: string): string {
  const match = title.match(/(\d+)\s*minute/i)
  if (match) {
    return `PT${match[1]}M`
  }
  return "PT10M" // default 10 minutes
}

// Helper to create SEO-friendly title
function createSeoTitle(title: string): string {
  // Add "Hindi Story" if not already present
  if (!title.toLowerCase().includes('story')) {
    return `${title} - Hindi Story`
  }
  return title
}

// Helper to create SEO-friendly description
function createSeoDescription(title: string, description: string, keywords: string[]): string {
  const keywordText = keywords?.slice(0, 3).join(', ') || ''
  const baseDescription = description || `Listen to ${title} - an engaging Hindi story.`

  // Ensure description is between 120-160 characters for optimal SEO
  let seoDescription = baseDescription
  if (seoDescription.length < 120 && keywordText) {
    seoDescription += ` Perfect for ${keywordText}.`
  }
  if (seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + '...'
  }
  return seoDescription
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { id } = await params
  const storyId = parseInt(id, 10)
  const story = await getStoryById(storyId)

  if (!story) {
    return {
      title: "Story Not Found",
      robots: { index: false, follow: false },
    }
  }

  const baseUrl = 'https://www.quick.dailymeditationguide.com'
  const playUrl = `${baseUrl}/play/${story.id}`
  const seoTitle = createSeoTitle(story.title)
  const seoDescription = createSeoDescription(story.title, story.description, story.keywords || [])

  // Ensure thumbnail is absolute URL
  const thumbnailUrl = story.thumbnail.startsWith('http')
    ? story.thumbnail
    : `${baseUrl}${story.thumbnail}`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [...(story.keywords || []), 'hindi story', 'audiobook', 'kahani', 'storytelling'],
    authors: [{ name: 'Hindi Story Audiobook' }],
    creator: 'Hindi Story Audiobook',
    publisher: 'Hindi Story Audiobook',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: playUrl,
      siteName: 'Hindi Story Audiobook',
      locale: 'en_US',
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: `${story.title} - Hindi Story Audio`,
          type: 'image/jpeg',
        },
      ],
      type: 'music.song',
      audio: [
        {
          url: story.audio_link,
          type: 'audio/mpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hindistoryaudio',
      creator: '@hindistoryaudio',
      title: seoTitle,
      description: seoDescription,
      images: {
        url: thumbnailUrl,
        alt: `${story.title} - Hindi Story`,
      },
    },
    alternates: {
      canonical: playUrl,
    },
    category: 'Entertainment',
  }
}

function PlayerLoading() {
  return (
    <div className="max-w-4xl mx-auto w-full flex items-center justify-center py-20">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  )
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params
  const storyId = parseInt(id, 10)

  if (isNaN(storyId)) {
    notFound()
  }

  const story = await getStoryById(storyId)

  if (!story) {
    notFound()
  }
  const relatedStories = await getRelatedStories(story, 3)

  // JSON-LD structured data for the audio
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: story.title,
    description: story.description,
    contentUrl: story.audio_link,
    thumbnailUrl: story.thumbnail,
    uploadDate: (story as any).processed_at || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Hindi Story Audiobook",
      logo: {
        "@type": "ImageObject",
        url: "https://www.quick.dailymeditationguide.com/logo.svg",
      },
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.quick.dailymeditationguide.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Library",
          "item": "https://www.quick.dailymeditationguide.com/library"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": story.title,
          "item": `https://www.quick.dailymeditationguide.com/play/${story.id}`
        }
      ]
    }
  }

  return (
    <div className="bg-background text-foreground antialiased selection:bg-celadon-light selection:text-primary-foreground overflow-x-hidden relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmbientBackground />
      <Navigation />

      <main className="pt-20 md:pt-32 pb-24 px-4 md:px-6 relative max-w-4xl mx-auto min-h-screen flex flex-col">
        <Suspense fallback={<PlayerLoading />}>
          <StoryPlayClient meditation={story} relatedMeditations={relatedStories} />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

