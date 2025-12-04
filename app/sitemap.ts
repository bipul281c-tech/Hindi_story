import { MetadataRoute } from 'next'
import { getAllStories } from '@/lib/stories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://hindi-story.vercel.app'
    const stories = await getAllStories()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/library`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/most-played`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/most-favorited`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/favorites`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
    ]

    // Individual story play pages
    const storyPages: MetadataRoute.Sitemap = stories.map((story) => {
        const processedAt = (story as any).processed_at
        const lastModified = processedAt
            ? new Date(processedAt.replace(' ', 'T') + 'Z')
            : new Date()

        return {
            url: `${baseUrl}/play/${story.id}`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }
    })

    return [...staticPages, ...storyPages]
}
