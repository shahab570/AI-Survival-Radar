import { useEffect, useRef } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

interface ContextMenuProps {
  x: number
  y: number
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function ContextMenu({ x, y, onEdit, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        type="button"
        onClick={() => { onEdit(); onClose() }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => { onDelete(); onClose() }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  )
}
