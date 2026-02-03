import { useState } from 'react'
import { ExternalLink, Star, Zap, Sparkles, TrendingUp } from 'lucide-react'
import { HOTTEST_TOOLS, NEWEST_TOOLS, TRENDING_TOPICS } from '../data/tools'
import { cn } from '../lib/utils'

export function ToolsBuzz() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Tools Buzz</h1>
        <p className="mt-1 text-slate-400">Hottest tools, newest launches, and trending topics in AI.</p>
        <p className="mt-2 text-xs text-slate-500">
          Updates automatically once every day. Data from free, publicly available sources (RSS, open APIs, trusted communities).
        </p>
      </div>

      {/* Hottest AI Tools (Last 3 Days) */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Zap className="h-5 w-5 text-amber-400" />
          Hottest AI Tools (Last 3 Days)
        </h2>
        <p className="mt-1 text-sm text-slate-500">Most discussed or popular recently.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {HOTTEST_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white hover:text-cyan-400 hover:underline"
                  >
                    {tool.name}
                  </a>
                  <span className="ml-2 rounded bg-slate-700 px-1.5 py-0.5 text-xs text-slate-400">
                    {tool.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(tool.id)}
                    className={cn(
                      'rounded p-1.5 transition',
                      bookmarks.has(tool.id) ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                    )}
                    aria-label={bookmarks.has(tool.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <Star className={cn('h-5 w-5', bookmarks.has(tool.id) && 'fill-current')} />
                  </button>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-700 hover:text-white"
                    aria-label={`Open ${tool.name}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
              {tool.developer && <p className="mt-1 text-xs text-slate-500">Developer: {tool.developer}</p>}
              {tool.reasonPopular && (
                <p className="mt-1 text-xs text-cyan-400/90">Why hot: {tool.reasonPopular}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newest AI Tools in the Market */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Newest AI Tools in the Market
        </h2>
        <p className="mt-1 text-sm text-slate-500">Newly launched tools gaining attention.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {NEWEST_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-2">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-cyan-400 hover:underline"
                >
                  {tool.name}
                </a>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-700 hover:text-white"
                  aria-label={`Open ${tool.name}`}
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {tool.developer && `${tool.developer} · `}
                {tool.category}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics in AI Tools */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Trending Topics in AI Tools
        </h2>
        <p className="mt-1 text-sm text-slate-500">Themes and discussions in the AI tools space.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {TRENDING_TOPICS.map((topic) => (
            <a
              key={topic.id}
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition hover:border-cyan-500/50"
            >
              <p className="font-medium text-white">{topic.title}</p>
              {topic.description && (
                <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
