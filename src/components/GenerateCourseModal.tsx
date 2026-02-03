import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { generateAdaptiveCourseSyllabus } from '../lib/gemini'
import {
  createCourse,
  createCourseProgress,
  getProgressByUserForCourses,
  getCourse,
} from '../lib/firestore'
import type { CourseTopic } from '../types'

const GOALS = [
  { value: 'Career Change', label: 'Career Change' },
  { value: 'Upskilling', label: 'Upskilling' },
  { value: 'Building a Product', label: 'Building a Product' },
  { value: 'Just Curious', label: 'Just Curious' },
]

const LEVELS = [
  { value: 'Beginner (just starting)', label: 'Beginner' },
  { value: 'Intermediate (know basics)', label: 'Intermediate' },
  { value: 'Expert (quite experienced)', label: 'Expert' },
]

interface GenerateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  categoryId: string
  categoryName: string
  userId: string
  onGenerated: () => void
}

export function GenerateCourseModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  userId,
  onGenerated,
}: GenerateCourseModalProps) {
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [generating, setGenerating] = useState(false)
  const [alreadyLearnedTitles, setAlreadyLearnedTitles] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen || !userId || !categoryId) return
    getProgressByUserForCourses(userId).then((list) => {
      const completed = list.filter((p) => p.categoryId === categoryId && p.completedAt != null)
      const titles: string[] = []
      Promise.all(
        completed.map((p) => getCourse(p.courseId).then((c) => c?.topics?.forEach((t) => titles.push(t.title))))
      ).then(() => setAlreadyLearnedTitles([...new Set(titles)]))
    })
  }, [isOpen, userId, categoryId])

  const handleGenerate = async () => {
    if (!goal || !level || !userId || !categoryId || !categoryName) return
    setGenerating(true)
    try {
      const topicsInput = await generateAdaptiveCourseSyllabus(
        categoryName,
        goal,
        level,
        alreadyLearnedTitles
      )
      const topics: CourseTopic[] = topicsInput.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        estimatedMinutes: t.estimatedMinutes,
        keyPoints: t.keyPoints ?? [],
        projects: t.projects ?? [],
        exercises: t.exercises ?? [],
        resources: t.resources ?? [],
      }))
      const title = `${categoryName} – ${level.split(' ')[0]} (${new Date().toLocaleDateString()})`
      const courseId = await createCourse(userId, categoryId, title, goal, level, topics)
      await createCourseProgress(userId, courseId, categoryId)
      onGenerated()
      onClose()
      window.location.href = `/dashboard/skills/course/${courseId}`
    } finally {
      setGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Generate course: {categoryName}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {alreadyLearnedTitles.length > 0
            ? `We'll build on what you've learned (${alreadyLearnedTitles.length} topics already completed).`
            : 'First course in this category – we\'ll start from the basics.'}
        </p>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Your goal</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    goal === g.value
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Experience level</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    level === l.value
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!goal || !level || generating}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-cyan-400"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              'Generate syllabus'
            )}
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
