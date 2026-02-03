import { useEffect, useState } from 'react'
import { Trophy, BookOpen, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getCategories } from '../lib/firestore'
import { getCompletedCoursesGroupedByCategory } from '../lib/firestore'
import type { LearningCategory } from '../types'
import { formatDate } from '../lib/utils'

export function Achievements() {
  const { firebaseUser } = useAuth()
  const [categories, setCategories] = useState<(LearningCategory & { id: string })[]>([])
  const [completedByCategory, setCompletedByCategory] = useState<
    Record<string, { course: { id: string; title: string }; progress: { completedAt: { toMillis: () => number }; totalLearningHours: number } }[]>
  >({})

  useEffect(() => {
    if (!firebaseUser?.uid) return
    getCategories(firebaseUser.uid).then(setCategories)
    getCompletedCoursesGroupedByCategory(firebaseUser.uid).then((map) => {
      const out: Record<string, { course: { id: string; title: string }; progress: { completedAt: { toMillis: () => number }; totalLearningHours: number } }[]> = {}
      for (const [catId, list] of Object.entries(map)) {
        out[catId] = list.map(({ course, progress }) => ({
          course: { id: course.id, title: course.title },
          progress: {
            completedAt: progress.completedAt!,
            totalLearningHours: progress.totalLearningHours ?? 0,
          },
        }))
      }
      setCompletedByCategory(out)
    })
  }, [firebaseUser?.uid])

  const categoryNames: Record<string, string> = {}
  categories.forEach((c) => { categoryNames[c.id] = c.name })

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Achievements</h1>
        <p className="mt-1 text-slate-400">Completed courses by category.</p>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/20 p-3">
            <Trophy className="h-8 w-8 text-amber-400" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {Object.values(completedByCategory).reduce((acc, arr) => acc + arr.length, 0)}
            </p>
            <p className="text-sm text-slate-400">Courses completed</p>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="text-slate-500">No categories yet. Complete courses in Skills Lab to see them here.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const completed = completedByCategory[cat.id] ?? []
            if (completed.length === 0) return null
            return (
              <section key={cat.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <h2 className="text-lg font-semibold text-white">{cat.name}</h2>
                <ul className="mt-4 space-y-3">
                  {completed.map(({ course, progress }) => (
                    <li
                      key={course.id}
                      className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
                    >
                      <BookOpen className="h-5 w-5 text-amber-400" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">{course.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            Completed {formatDate(progress.completedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3" aria-hidden />
                            {progress.totalLearningHours.toFixed(1)}h
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {categories.length > 0 && Object.keys(completedByCategory).length === 0 && (
        <p className="text-slate-500">No completed courses yet. Finish a course in Skills Lab to see it here.</p>
      )}
    </div>
  )
}
