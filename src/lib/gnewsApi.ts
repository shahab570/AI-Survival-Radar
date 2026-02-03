
import { getFinlandQuery } from '../config/finlandNewsConfig'
import type { NewsItem } from '../types'

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const GNEWS_API_BASE = 'https://gnews.io/api/v4'

export async function fetchGNewsFinland(category?: string): Promise<NewsItem[]> {
    if (!GNEWS_API_KEY) return []

    // Use the centralized query generator!
    // This ensures GNews uses the exact same rich keywords (Cities, Finnish terms) as NewsAPI.
    const query = getFinlandQuery(category)

    try {
        const url = new URL(`${GNEWS_API_BASE}/search`)
        url.searchParams.append('q', query)
        url.searchParams.append('token', GNEWS_API_KEY)
        url.searchParams.append('max', '10')
        url.searchParams.append('sortby', 'publishedAt')

        const res = await fetch(url.toString())
        if (!res.ok) throw new Error(`GNews error: ${res.status}`)
        const data = await res.json()

        if (!data.articles) return []

        return data.articles.map((article: any, index: number) => ({
            id: `gnews-${index}`,
            title: article.title,
            source: article.source.name,
            date: article.publishedAt.split('T')[0],
            category: category || 'general',
            excerpt: article.description,
            summary: article.description,
            url: article.url
        }))

    } catch (e) {
        console.warn('GNews fetch failed', e)
        return []
    }
}
