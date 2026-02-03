import { useState } from 'react'
import { GLOBAL_NEWS, NEWS_CATEGORIES } from '../data/news'

const CATEGORY_KEYS = Object.keys(NEWS_CATEGORIES)

export function GlobalTrends() {
  const [category, setCategory] = useState<string>('all')
  const filtered =
    category === 'all'
      ? GLOBAL_NEWS
      : GLOBAL_NEWS.filter((n) => n.category === category)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Global Trends</h1>
        <p className="mt-1 text-slate-400">
          Worldwide AI developments: technology, education, regulations, research, and ethics.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Updates automatically once every day. Data from free, publicly available sources.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            category === 'all'
              ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
              : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
          }`}
        >
          All
        </button>
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              category === key
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            {NEWS_CATEGORIES[key]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition hover:border-cyan-500/50"
          >
            <p className="font-medium text-white">{item.title}</p>
            {(item.summary ?? item.excerpt) && (
              <p className="mt-1 text-sm text-slate-400">{item.summary ?? item.excerpt}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {item.source} · {item.date}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
