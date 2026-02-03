import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface ReflectionModalProps {
  isOpen: boolean
  topicTitle: string
  onClose: () => void
  onSubmit: (reflection: string) => void
  minLength: number
}

export function ReflectionModal({
  isOpen,
  topicTitle,
  onClose,
  onSubmit,
  minLength,
}: ReflectionModalProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setValue('')
      setError('')
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen, topicTitle])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed.length < minLength) {
      setError(`Please write at least ${minLength} characters.`)
      return
    }
    setError('')
    onSubmit(trimmed)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reflection-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <h2 id="reflection-modal-title" className="text-lg font-semibold text-white">
          Complete: {topicTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Write a brief reflection (at least {minLength} characters) about what you learned.
        </p>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError('')
          }}
          placeholder="e.g. I learned that…"
          rows={4}
          className={cn(
            'mt-4 w-full rounded-lg border bg-slate-900 px-3 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500',
            error ? 'border-red-500' : 'border-slate-600'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'reflection-error' : undefined}
        />
        {error && (
          <p id="reflection-error" className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          {value.length} / {minLength}+ characters
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={value.trim().length < minLength}
            className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-cyan-400"
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
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
