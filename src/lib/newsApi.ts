
import { FINLAND_NEWS_CONFIG, getFinlandQuery } from '../config/finlandNewsConfig'
import type { NewsItem } from '../types'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_BASE = 'https://newsapi.org/v2'

interface NewsAPIArticle {
    title: string
    description: string
    url: string
    publishedAt: string
    source: { name: string }
    content?: string
}

interface NewsAPIResponse {
    status: string
    totalResults: number
    articles: NewsAPIArticle[]
    message?: string
}

/**
 * Fetch AI news for Finland
 * Uses strict filtering for trusted sources and keywords defined in config
 */
export async function fetchFinlandNews(category?: string): Promise<NewsItem[]> {
    // Generates precise query from config
    const query = getFinlandQuery(category)

    // Pass false to 'useTrustedDomains' to avoid over-restriction (0 results), 
    // but relies on strict keywords and junk blocking.
    return fetchNews(query, category || 'all', 'fi', false)
}

/**
 * Fetch global AI news
 */
export async function fetchGlobalNews(category?: string): Promise<NewsItem[]> {
    const globalContext = '(AI OR "artificial intelligence" OR "machine learning" OR LLM)'
    let catQuery = ''

    // We can map global categories to similar keywords as Finland config, 
    // or keep them simple. For now, using simple mappings.
    if (category) {
        if (category === 'research') catQuery = '(research OR breakthrough OR model)'
        else if (category === 'adoption') catQuery = '(adoption OR enterprise OR business)'
        else if (category === 'funding') catQuery = '(funding OR ipo OR startup OR vc)'
        else if (category === 'jobs') catQuery = '(jobs OR hiring OR careers)'
        else if (category === 'education') catQuery = '(education OR course OR learning)'
        else if (category === 'policy') catQuery = '(regulation OR law OR "AI Act")'
        else if (category === 'ethics') catQuery = '(ethics OR safety OR bias)'
        else if (category === 'public') catQuery = '(society OR impact OR future)'
        else catQuery = ''
    }

    const query = catQuery ? `${globalContext} AND ${catQuery}` : globalContext

    return fetchNews(query, category || 'all', 'global', false)
}

/**
 * Core news fetching function with caching
 */
async function fetchNews(
    query: string,
    category: string,
    region: 'fi' | 'global',
    useTrustedDomains: boolean
): Promise<NewsItem[]> {
    // v7 cache to ensure config changes take effect
    const cacheKey = `news_v7_${region}_${category}`
    const cacheTimeKey = `${cacheKey}_time`

    // Check cache (24 hour expiry)
    const cachedData = localStorage.getItem(cacheKey)
    const cachedTime = localStorage.getItem(cacheTimeKey)

    if (cachedData && cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10)
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

        if (age < TWENTY_FOUR_HOURS) {
            console.log(`📰 Using cached ${region} news for ${category}`)
            return JSON.parse(cachedData)
        }
    }

    console.log(`🔄 Fetching fresh ${region} news for ${category}...`)

    try {
        const url = new URL(`${NEWS_API_BASE}/everything`)
        url.searchParams.append('q', query)
        url.searchParams.append('apiKey', NEWS_API_KEY)
        url.searchParams.append('sortBy', 'publishedAt')
        url.searchParams.append('pageSize', '15')

        // Always search title/desc for relevance
        url.searchParams.append('searchIn', 'title,description')

        if (region === 'fi') {
            // Logic based on config
            if (useTrustedDomains) {
                url.searchParams.append('domains', FINLAND_NEWS_CONFIG.trustedDomains.join(','))
            } else {
                url.searchParams.append('excludeDomains', FINLAND_NEWS_CONFIG.excludedDomains.join(','))
            }
        } else {
            // Global trends: block junk defined in config
            url.searchParams.append('excludeDomains', FINLAND_NEWS_CONFIG.excludedDomains.join(','))
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status}`)
        }

        const data: NewsAPIResponse = await response.json()

        if (data.status !== 'ok') {
            throw new Error(data.message || 'NewsAPI error')
        }

        const newsItems: NewsItem[] = data.articles.map((article, index) => ({
            id: `${region}-${category}-${index}`,
            title: article.title,
            source: article.source.name,
            date: new Date(article.publishedAt).toISOString().split('T')[0],
            category: category,
            excerpt: article.description || '',
            summary: article.content?.substring(0, 200) || article.description || '',
            url: article.url,
        }))

        localStorage.setItem(cacheKey, JSON.stringify(newsItems))
        localStorage.setItem(cacheTimeKey, Date.now().toString())

        return newsItems

    } catch (error) {
        console.error('❌ NewsAPI fetch error:', error)
        if (cachedData) return JSON.parse(cachedData)
        return []
    }
}

export function clearNewsCache(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('news_'))
    keys.forEach(key => localStorage.removeItem(key))
    console.log('🗑️ Cleared all news caches')
}
