import { useEffect, useState } from 'react'
import { Trophy, BookOpen, Clock, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getCategories, deleteCourse, deleteCourseProgress } from '../lib/firestore'
import { getCompletedCoursesGroupedByCategory } from '../lib/firestore'
import type { LearningCategory } from '../types'
import { formatDate } from '../lib/utils'

export function Achievements() {
  const { firebaseUser } = useAuth()
  const [categories, setCategories] = useState<(LearningCategory & { id: string })[]>([])
  const [completedByCategory, setCompletedByCategory] = useState<
    Record<string, { course: { id: string; title: string }; progress: { id: string; completedAt: { toMillis: () => number }; totalLearningHours: number } }[]>
  >({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseUser?.uid) return
    setError(null)

    Promise.allSettled([
      getCategories(firebaseUser.uid),
      getCompletedCoursesGroupedByCategory(firebaseUser.uid)
    ]).then(([categoriesResult, coursesResult]) => {
      // Handle Categories
      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value)
      } else {
        console.error('Failed to load categories', categoriesResult.reason)
        setError('Failed to load categories. Please ensure database rules are deployed.')
      }

      // Handle Courses
      if (coursesResult.status === 'fulfilled') {
        const map = coursesResult.value
        const out: Record<string, { course: { id: string; title: string }; progress: { id: string; completedAt: { toMillis: () => number }; totalLearningHours: number } }[]> = {}
        for (const [catId, list] of Object.entries(map)) {
          out[catId] = list.map(({ course, progress }) => ({
            course: { id: course.id, title: course.title },
            progress: {
              id: progress.id,
              completedAt: progress.completedAt!,
              totalLearningHours: progress.totalLearningHours ?? 0,
            },
          }))
        }
        setCompletedByCategory(out)
      } else {
        console.error('Failed to load courses', coursesResult.reason)
        // Only set main error if we haven't already
        setError((prev) => prev || 'Failed to load completed courses.')
      }
    })
  }, [firebaseUser?.uid])

  const [courseToDelete, setCourseToDelete] = useState<{ id: string; progressId: string; title: string } | null>(null)

  const handleDeleteCourse = async () => {
    if (!courseToDelete || !firebaseUser?.uid) return

    console.log('Attempting to delete course:', courseToDelete)

    // 1. Try to delete the course document
    // This might fail if we don't have permission (e.g. somehow UID mismatch), but that's okay.
    try {
      await deleteCourse(courseToDelete.id)
      console.log('✅ Course document deleted')
    } catch (e) {
      console.warn('⚠️ Could not delete course doc (permission issue or already deleted):', e)
    }

    // 2. Try to delete the progress document
    // This removes it from the list view, which is the most important part for the user.
    if (courseToDelete.progressId) {
      try {
        await deleteCourseProgress(courseToDelete.progressId)
        console.log('✅ Course progress document deleted')
      } catch (e) {
        console.error('❌ Could not delete progress doc:', e)
        alert('Failed to delete course progress. Please try refreshing the page.')
      }
    } else {
      console.warn('⚠️ No progressId found. The app might need a refresh.')
    }

    setCourseToDelete(null)

    // Refresh data
    getCompletedCoursesGroupedByCategory(firebaseUser.uid).then((map) => {
      const out: Record<string, { course: { id: string; title: string }; progress: { id: string; completedAt: { toMillis: () => number }; totalLearningHours: number } }[]> = {}
      for (const [catId, list] of Object.entries(map)) {
        out[catId] = list.map(({ course, progress }) => ({
          course: { id: course.id, title: course.title },
          progress: {
            id: progress.id,
            completedAt: progress.completedAt!,
            totalLearningHours: progress.totalLearningHours ?? 0,
          },
        }))
      }
      setCompletedByCategory(out)
    })
  }

  const categoryNames: Record<string, string> = {}
  categories.forEach((c) => { categoryNames[c.id] = c.name })

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Achievements</h1>
        <p className="mt-1 text-slate-400">Completed courses by category.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          <p>⚠️ {error}</p>
          <p className="mt-1 text-sm text-red-400/80 font-mono">Run: npx firebase deploy --only firestore:rules</p>
        </div>
      )}

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
                      className="group flex flex-wrap items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 transition hover:border-slate-600"
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
                      <button
                        type="button"
                        onClick={() => setCourseToDelete({ id: course.id, progressId: progress.id, title: course.title })}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Delete ${course.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {/* Show completed courses that don't have a category (orphaned) */}
      {Object.entries(completedByCategory).map(([catId, courses]) => {
        const categoryExists = categories.some(c => c.id === catId)
        if (categoryExists || courses.length === 0) return null

        return (
          <section key={catId} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="text-lg font-semibold text-white">Completed Courses (Category Deleted)</h2>
            <ul className="mt-4 space-y-3">
              {courses.map(({ course, progress }) => (
                <li
                  key={course.id}
                  className="group flex flex-wrap items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 transition hover:border-slate-600"
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
                  <button
                    type="button"
                    onClick={() => setCourseToDelete({ id: course.id, progressId: progress.id, title: course.title })}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Delete ${course.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {categories.length > 0 && Object.keys(completedByCategory).length === 0 && (
        <p className="text-slate-500">No completed courses yet. Finish a course in Skills Lab to see it here.</p>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCourseToDelete(null)} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white">Delete Course?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete <span className="font-medium text-white">"{courseToDelete.title}"</span>?
              This will remove all progress and cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
