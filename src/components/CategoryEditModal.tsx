import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { LearningCategory } from '../types'

interface CategoryEditModalProps {
  category: (LearningCategory & { id: string }) | null
  onClose: () => void
  onSave: (name: string) => void
}

export function CategoryEditModal({ category, onClose, onSave }: CategoryEditModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    setName(category?.name ?? '')
  }, [category])

  if (!category) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Edit category</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="Category name"
        />
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(name.trim())}
            disabled={!name.trim()}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-cyan-400"
          >
            Save
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
