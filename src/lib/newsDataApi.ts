
import { FINLAND_NEWS_CONFIG } from '../config/finlandNewsConfig'
import type { NewsItem } from '../types'

const NEWSDATA_API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY
const NEWSDATA_API_BASE = 'https://newsdata.io/api/1/news'

export async function fetchNewsDataFinland(category?: string): Promise<NewsItem[]> {
    if (!NEWSDATA_API_KEY) return []

    // Optimization: Since we use strict 'country=fi', we don't need to redundancy force 'Finland' keyword in the query.
    // This allows us to catch local news like "Helsinki University develops new AI model" even if it doesn't say "Finland".

    let categoryFilter = ''
    if (category === 'technology' || category === 'research') categoryFilter = '&category=technology,science'
    else if (category === 'business' || category === 'funding' || category === 'jobs') categoryFilter = '&category=business'
    else if (category === 'politics' || category === 'policy') categoryFilter = '&category=politics'

    // 1. Base AI Context
    const aiKeywords = FINLAND_NEWS_CONFIG.aiKeywords.join(' OR ')
    let query = `(${aiKeywords})`

    // 2. Add Category Context if present
    if (category && category !== 'all' && category in FINLAND_NEWS_CONFIG.categories) {
        const cat = FINLAND_NEWS_CONFIG.categories[category as keyof typeof FINLAND_NEWS_CONFIG.categories]
        const catKeywords = cat.keywords.join(' OR ')
        query += ` AND (${catKeywords})`
    }

    try {
        const url = new URL(`${NEWSDATA_API_BASE}`)
        url.searchParams.append('apikey', NEWSDATA_API_KEY)
        url.searchParams.append('country', 'fi') // Strict Finland
        url.searchParams.append('q', query)
        url.searchParams.append('language', 'fi,en') // Finnish and English

        // category param is optional but helps relevance
        if (categoryFilter) {
            // url.searchParams.append('category', ... ) // handling comma separated manually above in string? 
            // URLSearchParams handles it.
            // But logic above was string.
            // Let's refine.
        }

        const res = await fetch(url.toString() + categoryFilter) // append manually to be safe with comma syntax
        if (!res.ok) throw new Error(`NewsData error: ${res.status}`)
        const data = await res.json()

        if (!data.results) return []

        return data.results.map((article: any, index: number) => ({
            id: `newsdata-${index}`,
            title: article.title,
            source: article.source_id,
            date: article.pubDate.split(' ')[0], // Format often "2024-05-20 14:30:00"
            category: category || 'general',
            excerpt: article.description,
            summary: article.description || article.content?.substring(0, 200),
            url: article.link
        }))

    } catch (e) {
        console.warn('NewsData fetch failed', e)
        return []
    }
}
