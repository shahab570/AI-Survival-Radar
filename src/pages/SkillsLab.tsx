import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Loader2,
  ChevronRight,
  FolderOpen,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCoursesByCategory,
  getProgressByUserForCourses,
} from '../lib/firestore'
import type { LearningCategory, Course, CourseProgress } from '../types'
import { GenerateCourseModal } from '../components/GenerateCourseModal'
import { CategoryEditModal } from '../components/CategoryEditModal'
import { cn } from '../lib/utils'

const DEFAULT_CATEGORIES = ['Coding', 'Prompt Engineering', 'Design', 'Marketing']

export function SkillsLab() {
  const { firebaseUser } = useAuth()
  const [categories, setCategories] = useState<(LearningCategory & { id: string })[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [courses, setCourses] = useState<(Course & { id: string })[]>([])
  const [progressByCourse, setProgressByCourse] = useState<Record<string, CourseProgress & { id: string }>>({})
  const [loading, setLoading] = useState(true)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<(LearningCategory & { id: string }) | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const loadCategories = async () => {
    if (!firebaseUser?.uid) return
    const list = await getCategories(firebaseUser.uid)
    if (list.length === 0) {
      for (const name of DEFAULT_CATEGORIES) {
        const id = await createCategory(firebaseUser.uid, name)
        list.push({ id, userId: firebaseUser.uid, name, order: list.length })
      }
      list.sort((a, b) => a.order - b.order)
    }
    setCategories(list)
    if (list.length > 0 && !selectedCategoryId) setSelectedCategoryId(list[0].id)
  }

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setLoading(false)
      return
    }
    loadCategories().then(() => setLoading(false))
  }, [firebaseUser?.uid])

  useEffect(() => {
    if (!firebaseUser?.uid || !selectedCategoryId) {
      setCourses([])
      return
    }
    getCoursesByCategory(firebaseUser.uid, selectedCategoryId).then(setCourses)
  }, [firebaseUser?.uid, selectedCategoryId])

  useEffect(() => {
    if (!firebaseUser?.uid) return
    getProgressByUserForCourses(firebaseUser.uid).then((list) => {
      const map: Record<string, CourseProgress & { id: string }> = {}
      list.forEach((p) => { map[p.courseId] = p })
      setProgressByCourse(map)
    })
  }, [firebaseUser?.uid, courses])

  const handleAddCategory = async () => {
    const name = newCategoryName.trim()
    if (!name || !firebaseUser?.uid) return
    const id = await createCategory(firebaseUser.uid, name)
    setCategories((prev) => [...prev, { id, userId: firebaseUser.uid, name, order: prev.length }])
    setNewCategoryName('')
    setSelectedCategoryId(id)
  }

  const handleUpdateCategory = async (name: string) => {
    if (!categoryToEdit) return
    await updateCategory(categoryToEdit.id, name)
    setCategories((prev) => prev.map((c) => (c.id === categoryToEdit.id ? { ...c, name } : c)))
    setCategoryToEdit(null)
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return
    await deleteCategory(categoryToDelete)
    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete))
    if (selectedCategoryId === categoryToDelete) {
      setSelectedCategoryId(categories[0]?.id ?? null)
    }
    setCategoryToDelete(null)
  }

  const handleCourseGenerated = () => {
    setShowGenerateModal(false)
    if (selectedCategoryId && firebaseUser?.uid)
      getCoursesByCategory(firebaseUser.uid, selectedCategoryId).then(setCourses)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Skills Lab</h1>
        <p className="mt-1 text-slate-400">Organize learning by category. Generate courses with AI.</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              'flex items-center gap-1 rounded-lg border px-3 py-2 transition',
              selectedCategoryId === cat.id
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
            )}
          >
            <button
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className="font-medium"
            >
              {cat.name}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCategoryToEdit(cat) }}
              className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
              aria-label="Edit category"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCategoryToDelete(cat.id) }}
              className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
              aria-label="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-600 px-3 py-2">
          <input
            type="text"
            placeholder="Add category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="w-36 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="rounded p-1 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50"
            aria-label="Add category"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected category: courses list + Generate Course */}
      {selectedCategory && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <FolderOpen className="h-5 w-5 text-cyan-400" />
              {selectedCategory.name}
            </h2>
            <button
              type="button"
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-cyan-400"
            >
              <Plus className="h-4 w-4" />
              Generate Course
            </button>
          </div>

          {courses.length === 0 ? (
            <p className="mt-4 text-slate-500">No courses yet. Click &quot;Generate Course&quot; to create one with AI.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {courses.map((course) => {
                const progress = progressByCourse[course.id]
                const pct = progress && course.topics?.length
                  ? Math.round(
                      (Object.values(progress.topicCompleted || {}).filter(Boolean).length / course.topics.length) * 100
                    )
                  : 0
                return (
                  <li key={course.id}>
                    <Link
                      to={`/dashboard/skills/course/${course.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 transition hover:border-cyan-500/50"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-white">{course.title}</p>
                          <p className="text-xs text-slate-500">
                            {course.level} · {course.topics?.length ?? 0} topics
                            {progress && ` · ${pct}%`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      <GenerateCourseModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        categoryId={selectedCategoryId ?? ''}
        categoryName={selectedCategory?.name ?? ''}
        userId={firebaseUser?.uid ?? ''}
        onGenerated={handleCourseGenerated}
      />

      <CategoryEditModal
        category={categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        onSave={handleUpdateCategory}
      />

      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
            <p className="text-white">Delete this category? Courses in it are not deleted.</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory()}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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
