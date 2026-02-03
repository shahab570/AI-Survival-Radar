export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | { toMillis: () => number }): string {
  const ms = typeof date === 'object' && 'toMillis' in date ? date.toMillis() : date.getTime()
  return new Date(ms).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeTime(date: Date | { toMillis: () => number }): string {
  const ms = typeof date === 'object' && 'toMillis' in date ? date.toMillis() : date.getTime()
  const now = Date.now()
  const diff = now - ms
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(new Date(ms))
}
