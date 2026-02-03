import { useState } from 'react'
import { X } from 'lucide-react'

interface MarkCompleteModalProps {
  isOpen: boolean
  topicTitle: string
  onClose: () => void
  onComplete: (learningMinutes: number) => void
}

export function MarkCompleteModal({
  isOpen,
  topicTitle,
  onClose,
  onComplete,
}: MarkCompleteModalProps) {
  const [minutes, setMinutes] = useState(15)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Mark as finished</h2>
        <p className="mt-1 text-sm text-slate-400">{topicTitle}</p>
        <label className="mt-4 block">
          <span className="text-sm text-slate-300">Time spent (minutes)</span>
          <input
            type="number"
            min={1}
            max={240}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 1)}
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </label>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onComplete(minutes)}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400"
          >
            Mark complete
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
