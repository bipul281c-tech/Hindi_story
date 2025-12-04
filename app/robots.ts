import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://hindi-story.vercel.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/play/',
                    '/library',
                    '/most-played',
                    '/most-favorited',
                ],
                disallow: ['/api/', '/api-test', '/private/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/api-test'],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: ['/api/', '/api-test'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
