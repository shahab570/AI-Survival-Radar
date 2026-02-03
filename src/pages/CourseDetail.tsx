import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Target,
  FileQuestion,
  Link2,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getCourse,
  getProgressByCourse,
  markTopicCompleted,
} from '../lib/firestore'
import type { Course, CourseProgress, CourseTopic } from '../types'
import { MarkCompleteModal } from '../components/MarkCompleteModal'
import { CompletionCelebration } from '../components/CompletionCelebration'
import { cn } from '../lib/utils'

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { firebaseUser } = useAuth()
  const [course, setCourse] = useState<(Course & { id: string }) | null>(null)
  const [progress, setProgress] = useState<(CourseProgress & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0)
  const [topicToComplete, setTopicToComplete] = useState<string | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    if (!courseId || !firebaseUser?.uid) {
      setLoading(false)
      return
    }
    Promise.all([
      getCourse(courseId),
      getProgressByCourse(firebaseUser.uid, courseId),
    ]).then(([c, p]) => {
      setCourse(c ?? null)
      setProgress(p ?? null)
      setLoading(false)
    })
  }, [courseId, firebaseUser?.uid])

  const handleMarkComplete = async (learningMinutes: number) => {
    if (!progress?.id || !topicToComplete) return
    await markTopicCompleted(progress.id, topicToComplete, learningMinutes)
    const [c, p] = await Promise.all([
      getCourse(courseId!),
      getProgressByCourse(firebaseUser!.uid, courseId!),
    ])
    setCourse(c ?? null)
    setProgress(p ?? null)
    setTopicToComplete(null)
    if (p?.completedAt != null) setShowCompletion(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-400">Course not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/skills')}
          className="mt-4 text-cyan-400 hover:underline"
        >
          Back to Skills Lab
        </button>
      </div>
    )
  }

  const topics = course.topics ?? []
  const completedIds = new Set(
    progress ? Object.entries(progress.topicCompleted ?? {}).filter(([, v]) => v).map(([k]) => k) : []
  )
  const selectedTopic = topics[selectedTopicIndex]
  const isTopicCompleted = (t: CourseTopic) => completedIds.has(t.id)
  const isTopicUnlocked = (index: number) => {
    if (index === 0) return true
    return completedIds.has(topics[index - 1].id)
  }

  if (showCompletion) {
    return (
      <CompletionCelebration
        skillName={course.title}
        onContinue={() => {
          setShowCompletion(false)
          navigate('/dashboard/skills')
        }}
        onNextSkill={() => {
          setShowCompletion(false)
          navigate('/dashboard/skills')
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <button type="button" onClick={() => navigate('/dashboard/skills')} className="hover:text-white">
          Skills Lab
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{course.title}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content (left) */}
        <div className="min-w-0 flex-1 rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          {selectedTopic ? (
            <>
              <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
              <p className="mt-2 text-slate-400 whitespace-pre-wrap">{selectedTopic.description}</p>
              {selectedTopic.estimatedMinutes && (
                <p className="mt-2 text-xs text-slate-500">~{selectedTopic.estimatedMinutes} min</p>
              )}
              {selectedTopic.keyPoints && selectedTopic.keyPoints.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-300">
                  {selectedTopic.keyPoints.map((kp, i) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              )}
              {selectedTopic.projects && selectedTopic.projects.length > 0 && (
                <div className="mt-6">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <Target className="h-4 w-4 text-cyan-400" />
                    Projects
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selectedTopic.projects.map((p, i) => (
                      <li key={i} className="rounded-lg border border-slate-600 bg-slate-800/50 p-3">
                        <p className="font-medium text-white">{p.title}</p>
                        <p className="text-sm text-slate-400">{p.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedTopic.exercises && selectedTopic.exercises.length > 0 && (
                <div className="mt-6">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <FileQuestion className="h-4 w-4 text-cyan-400" />
                    Exercises
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selectedTopic.exercises.map((e, i) => (
                      <li key={i} className="rounded-lg border border-slate-600 bg-slate-800/50 p-3">
                        <p className="font-medium text-white">{e.title}</p>
                        {e.description && <p className="text-sm text-slate-400">{e.description}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedTopic.resources && selectedTopic.resources.length > 0 && (
                <div className="mt-6">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <Link2 className="h-4 w-4 text-cyan-400" />
                    Resources
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selectedTopic.resources.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          {r.title}
                        </a>
                        <span className="ml-2 text-xs text-slate-500">{r.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {isTopicUnlocked(selectedTopicIndex) && !isTopicCompleted(selectedTopic) && (
                <button
                  type="button"
                  onClick={() => setTopicToComplete(selectedTopic.id)}
                  className="mt-6 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-cyan-400"
                >
                  Mark topic as finished
                </button>
              )}
            </>
          ) : (
            <p className="text-slate-500">Select a topic from the syllabus.</p>
          )}
        </div>

        {/* Syllabus (right) */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              Syllabus
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {completedIds.size} of {topics.length} topics completed
            </p>
            <ul className="mt-4 space-y-2">
              {topics.map((topic, index) => {
                const completed = isTopicCompleted(topic)
                const unlocked = isTopicUnlocked(index)
                const selected = selectedTopicIndex === index
                return (
                  <li key={topic.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTopicIndex(index)}
                      disabled={!unlocked}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition',
                        !unlocked && 'cursor-not-allowed opacity-60',
                        selected && 'border-cyan-500 bg-cyan-500/20',
                        unlocked && !selected && 'border-slate-600 hover:border-slate-500',
                        completed && 'border-emerald-500/30 bg-emerald-500/5'
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-300">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium text-white">{topic.title}</span>
                      {!unlocked ? (
                        <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                      ) : completed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>

      <MarkCompleteModal
        isOpen={topicToComplete !== null}
        topicTitle={topics.find((t) => t.id === topicToComplete)?.title ?? ''}
        onClose={() => setTopicToComplete(null)}
        onComplete={handleMarkComplete}
      />
    </div>
  )
}
