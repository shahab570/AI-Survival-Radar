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

const LEARNING_STYLES = [
  { value: 'Visual', label: '📊 Visual', description: 'Diagrams, infographics' },
  { value: 'Reading', label: '📖 Reading', description: 'Articles, documentation' },
  { value: 'Hands-on', label: '🛠️ Hands-on', description: 'Projects, exercises' },
  { value: 'Video', label: '🎥 Video', description: 'YouTube tutorials' },
]

const COURSE_STRUCTURES = [
  { value: 'Project-based', label: 'Project-based (learn by building)' },
  { value: 'Theory-first', label: 'Theory-first (concepts then practice)' },
  { value: 'Balanced', label: 'Balanced (mixed approach)' },
  { value: 'Fast-track', label: 'Fast-track (essentials only)' },
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
  const [detailedGoal, setDetailedGoal] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [courseStructure, setCourseStructure] = useState('')
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
        alreadyLearnedTitles,
        detailedGoal,
        learningStyle,
        courseStructure
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
                  className={`rounded-lg border px-3 py-2 text-sm ${goal === g.value
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
                  className={`rounded-lg border px-3 py-2 text-sm ${level === l.value
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">What specifically do you want to learn? (optional)</span>
            <textarea
              value={detailedGoal}
              onChange={(e) => setDetailedGoal(e.target.value)}
              placeholder="e.g., I want to build a mobile app for tracking expenses..."
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              rows={2}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Preferred learning style (optional)</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {LEARNING_STYLES.map((ls) => (
                <button
                  key={ls.value}
                  type="button"
                  onClick={() => setLearningStyle(ls.value)}
                  className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left text-sm transition ${learningStyle === ls.value
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                >
                  <span className="font-medium">{ls.label}</span>
                  <span className="text-xs text-slate-500">{ls.description}</span>
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Course structure (optional)</span>
            <select
              value={courseStructure}
              onChange={(e) => setCourseStructure(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select structure...</option>
              {COURSE_STRUCTURES.map((cs) => (
                <option key={cs.value} value={cs.value}>
                  {cs.label}
                </option>
              ))}
            </select>
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
