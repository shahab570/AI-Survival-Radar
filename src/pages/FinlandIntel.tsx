
import { useState, useEffect } from 'react'
import { fetchFinlandNews } from '../lib/newsApi'
import { fetchGNewsFinland } from '../lib/gnewsApi'
import { fetchNewsDataFinland } from '../lib/newsDataApi'
import type { NewsItem } from '../types'
import { FINLAND_NEWS_CONFIG } from '../config/finlandNewsConfig'

export function FinlandIntel() {
  const [category, setCategory] = useState<string>('all')
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate category keys from config to ensure UI matches logic
  const categoryKeys = Object.keys(FINLAND_NEWS_CONFIG.categories)

  // Fetch news when category changes
  useEffect(() => {
    setLoading(true)
    setError(null)

    const catParam = category === 'all' ? undefined : category

    const loadNews = async () => {
      try {
        const [newsApiDetails, gnewsDetails, newsDataDetails] = await Promise.allSettled([
          fetchFinlandNews(catParam),
          fetchGNewsFinland(catParam),
          fetchNewsDataFinland(catParam)
        ])

        const newsApiResults = newsApiDetails.status === 'fulfilled' ? newsApiDetails.value : []
        const gnewsResults = gnewsDetails.status === 'fulfilled' ? gnewsDetails.value : []
        const newsDataResults = newsDataDetails.status === 'fulfilled' ? newsDataDetails.value : []

        // Merge and simple deduplicate by title normalization
        const combined = [...newsApiResults, ...gnewsResults, ...newsDataResults].filter((item, index, self) =>
          index === self.findIndex((t) => t.title.toLowerCase().trim() === item.title.toLowerCase().trim())
        )

        // Sort by date desc
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setNews(combined)
      } catch (err: any) {
        setError(err.message || 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [category])

  const filtered = news

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Finland Intel</h1>
        <p className="mt-1 text-slate-400">
          AI updates from Finland: education, research, jobs, policies, and ethics.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Updates automatically once every day. Source configuration: <code>src/config/finlandNewsConfig.ts</code>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${category === 'all'
            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
            : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            }`}
        >
          All
        </button>
        {categoryKeys.map((key) => {
          const configCat = FINLAND_NEWS_CONFIG.categories[key as keyof typeof FINLAND_NEWS_CONFIG.categories]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${category === key
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
            >
              {configCat.label}
            </button>
          )
        })}
      </div>

      {loading && (
        <div className="text-center text-slate-400">
          <p>Loading latest AI news from Finland...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-slate-500">No news found for this category.</p>
          ) : (
            filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const summary = item.summary ?? item.excerpt

  let providerBadge = <span className="text-[10px] uppercase bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">NewsAPI</span>
  let cardClass = "hover:border-purple-500/50"

  if (item.id.startsWith('gnews')) {
    providerBadge = <span className="text-[10px] uppercase bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">GNews</span>
    cardClass = "hover:border-green-500/50 hover:bg-slate-800/60"
  } else if (item.id.startsWith('newsdata')) {
    providerBadge = <span className="text-[10px] uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">NewsData</span>
    cardClass = "hover:border-blue-500/50 hover:bg-slate-800/60"
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition ${cardClass}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {providerBadge}
            <span className="text-xs text-slate-500">· {item.source}</span>
          </div>
          <p className="font-medium text-white">{item.title}</p>
        </div>
      </div>

      {summary && <p className="mt-2 text-sm text-slate-400 line-clamp-2">{summary}</p>}
      <p className="mt-2 text-xs text-slate-600">
        {item.date}
      </p>
    </a>
  )
}
