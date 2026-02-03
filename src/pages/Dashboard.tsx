import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, Trophy, Newspaper, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getProgressByUserForCourses, getCourse } from '../lib/firestore'
import { FINLAND_NEWS, GLOBAL_NEWS } from '../data/news'
import { formatRelativeTime } from '../lib/utils'
import { cn } from '../lib/utils'

export function Dashboard() {
  const { appUser, firebaseUser } = useAuth()
  const [courseProgressList, setCourseProgressList] = useState<Awaited<ReturnType<typeof getProgressByUserForCourses>>>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const displayName = appUser?.displayName ?? firebaseUser?.displayName ?? 'Learner'
  const inProgress = courseProgressList.filter((p) => p.completedAt == null)
  const currentProgress = inProgress[0]
  const [currentCourseTitle, setCurrentCourseTitle] = useState<string | null>(null)
  const highlights = [...FINLAND_NEWS, ...GLOBAL_NEWS].slice(0, 3)

  useEffect(() => {
    const uid = firebaseUser?.uid
    if (!uid) {
      setLoading(false)
      return
    }
    getProgressByUserForCourses(uid).then((list) => {
      setCourseProgressList(list)
      setCompletedCount(list.filter((p) => p.completedAt != null).length)
    })
    setLoading(false)
  }, [firebaseUser?.uid])

  useEffect(() => {
    if (!currentProgress?.courseId) return
    getCourse(currentProgress.courseId).then((c) => setCurrentCourseTitle(c?.title ?? null))
  }, [currentProgress?.courseId])

  const totalTopicsCompleted = courseProgressList.reduce((acc, p) => {
    const n = Object.values(p.topicCompleted ?? {}).filter(Boolean).length
    return acc + n
  }, 0)

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Welcome back, {displayName}</h1>
        <p className="mt-1 text-slate-400">Here’s your learning overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <span className="text-sm text-slate-400">Courses completed</span>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <span className="text-sm text-slate-400">Topics completed</span>
          <p className="text-2xl font-bold text-white">{totalTopicsCompleted}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <span className="text-sm text-slate-400">In progress</span>
          <p className="text-2xl font-bold text-white">{inProgress.length}</p>
        </div>
      </div>

      {currentProgress && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <FlaskConical className="h-5 w-5 text-cyan-400" aria-hidden />
            Continue learning
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">{currentCourseTitle ?? 'Course'}</p>
              <p className="text-sm text-slate-400">
                Last activity {formatRelativeTime(currentProgress.lastActivityAt)}
              </p>
            </div>
            <Link
              to={`/dashboard/skills/course/${currentProgress.courseId}`}
              className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-cyan-400"
            >
              Continue
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {!currentProgress && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <h2 className="text-lg font-semibold text-white">Start your first course</h2>
          <p className="mt-1 text-slate-400">Add a category and generate a course with AI.</p>
          <Link
            to="/dashboard/skills"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-cyan-400"
          >
            <FlaskConical className="h-4 w-4" aria-hidden />
            Skills Lab
          </Link>
        </section>
      )}

      {completedCount > 0 && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Trophy className="h-5 w-5 text-amber-400" aria-hidden />
            Achievements
          </h2>
          <p className="mt-1 text-slate-400">You’ve completed {completedCount} course(s).</p>
          <Link
            to="/dashboard/achievements"
            className="mt-3 inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      )}

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Newspaper className="h-5 w-5 text-cyan-400" aria-hidden />
          Today’s highlights
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'block rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition hover:border-cyan-500/50'
              )}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
              )}
              <p className="font-medium text-white line-clamp-2">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.source} · {item.date}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Skills Lab</h2>
        <p className="mt-1 text-slate-400">Generate courses by category with AI.</p>
        <Link
          to="/dashboard/skills"
          className="mt-3 inline-block text-sm text-cyan-400 hover:underline"
        >
          Open Skills Lab →
        </Link>
      </section>
    </div>
  )
}
