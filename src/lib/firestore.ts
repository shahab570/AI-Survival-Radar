import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  AppUser,
  UserProgress,
  Achievement,
  UserProgressTopic,
  LearningCategory,
  Course,
  CourseProgress,
  CourseTopic,
} from '../types'
import type { SyllabusTopicInput } from '../types'

const USERS = 'users'
const USER_PROGRESS = 'userProgress'
const ACHIEVEMENTS = 'achievements'
const CATEGORIES = 'categories'
const COURSES = 'courses'
const COURSE_PROGRESS = 'courseProgress'

export async function getUser(uid: string): Promise<AppUser | null> {
  const ref = doc(db, USERS, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as AppUser
  return { ...data, status: data.status ?? 'approved' }
}

export async function getPendingUsers(): Promise<(AppUser & { id: string })[]> {
  const q = query(
    collection(db, USERS),
    where('status', '==', 'pending')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppUser & { id: string }))
}

export async function updateUserStatus(uid: string, status: 'approved' | 'rejected'): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { status })
}

export async function getAllUsers(): Promise<(AppUser & { id: string })[]> {
  const snap = await getDocs(collection(db, USERS))
  return snap.docs.map((d) => {
    const data = d.data() as AppUser
    return { id: d.id, ...data, status: data.status ?? 'approved' } as AppUser & { id: string }
  })
}

export async function setUser(
  uid: string,
  data: { email: string | null; displayName: string | null; photoURL: string | null }
): Promise<void> {
  const ref = doc(db, USERS, uid)
  const existing = await getDoc(ref)
  const now = serverTimestamp() as Timestamp
  if (existing.exists()) {
    await updateDoc(ref, { lastLogin: now, ...data })
  } else {
    await setDoc(ref, {
      uid,
      ...data,
      status: 'pending',
      createdAt: now,
      lastLogin: now,
      preferences: { dailyGoalMinutes: 30, notifications: true },
    })
  }
}

export async function updateUserPreferences(
  uid: string,
  preferences: Partial<AppUser['preferences']>
): Promise<void> {
  const ref = doc(db, USERS, uid)
  await updateDoc(ref, { preferences })
}

export async function getProgressByUserAndSkill(
  userId: string,
  skillId: string
): Promise<(UserProgress & { id: string }) | null> {
  const q = query(
    collection(db, USER_PROGRESS),
    where('userId', '==', userId),
    where('skillId', '==', skillId),
    limit(1)
  )
  const snap = await getDocs(q)
  const docSnap = snap.docs[0]
  if (!docSnap) return null
  return { id: docSnap.id, ...docSnap.data() } as UserProgress & { id: string }
}

export async function getProgressByUser(userId: string): Promise<(UserProgress & { id: string })[]> {
  const q = query(
    collection(db, USER_PROGRESS),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProgress & { id: string }))
  list.sort((a, b) => {
    const tA = a.lastActivityAt?.toMillis?.() ?? 0
    const tB = b.lastActivityAt?.toMillis?.() ?? 0
    return tB - tA
  })
  return list
}

export async function createProgress(
  userId: string,
  skillId: string,
  goal: string,
  level: string,
  topics: SyllabusTopicInput[]
): Promise<string> {
  const col = collection(db, USER_PROGRESS)
  const ref = doc(col)
  const now = serverTimestamp() as Timestamp
  const userTopics: UserProgressTopic[] = topics.map((t, i) => ({
    id: `topic-${i}`,
    title: t.title,
    description: t.description,
    completed: false,
    completedAt: null,
    reflection: '',
    estimatedMinutes: t.estimatedMinutes,
    keyPoints: t.keyPoints,
  }))
  await setDoc(ref, {
    userId,
    skillId,
    goal,
    level,
    topics: userTopics,
    startedAt: now,
    lastActivityAt: now,
    completedAt: null,
    progressPercentage: 0,
  })
  return ref.id
}

export async function updateProgressTopic(
  progressId: string,
  topicIndex: number,
  reflection: string
): Promise<void> {
  const ref = doc(db, USER_PROGRESS, progressId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data() as UserProgress
  const topics = [...data.topics]
  if (topicIndex < 0 || topicIndex >= topics.length) return
  const now = serverTimestamp() as Timestamp
  topics[topicIndex] = {
    ...topics[topicIndex],
    completed: true,
    completedAt: now,
    reflection,
  }
  const completedCount = topics.filter((t) => t.completed).length
  const progressPercentage = Math.round((completedCount / topics.length) * 100)
  const isComplete = completedCount === topics.length
  await updateDoc(ref, {
    topics,
    lastActivityAt: now,
    progressPercentage,
    ...(isComplete ? { completedAt: now } : {}),
  })
}

export async function getUserAchievements(userId: string): Promise<(Achievement & { id: string })[]> {
  const q = query(
    collection(db, ACHIEVEMENTS),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement & { id: string }))
  list.sort((a, b) => {
    const tA = a.unlockedAt?.toMillis?.() ?? 0
    const tB = b.unlockedAt?.toMillis?.() ?? 0
    return tB - tA
  })
  return list
}

export async function unlockAchievement(
  userId: string,
  achievementId: string,
  type: string,
  points: number
): Promise<void> {
  const col = collection(db, ACHIEVEMENTS)
  const q = query(
    col,
    where('userId', '==', userId),
    where('achievementId', '==', achievementId),
    limit(1)
  )
  const existing = await getDocs(q)
  if (!existing.empty) return
  await setDoc(doc(col), {
    userId,
    achievementId,
    unlockedAt: serverTimestamp(),
    type,
    points,
  })
}

// ---- Categories ----

export async function getCategories(userId: string): Promise<(LearningCategory & { id: string })[]> {
  const q = query(
    collection(db, CATEGORIES),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as LearningCategory & { id: string }))
  list.sort((a, b) => a.order - b.order)
  return list
}

export async function createCategory(userId: string, name: string): Promise<string> {
  const col = collection(db, CATEGORIES)
  const snap = await getDocs(query(col, where('userId', '==', userId)))
  const order = snap.size
  const ref = doc(col)
  await setDoc(ref, { userId, name, order })
  return ref.id
}

export async function updateCategory(categoryId: string, name: string): Promise<void> {
  await updateDoc(doc(db, CATEGORIES, categoryId), { name })
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES, categoryId))
}

// ---- Courses ----

export async function getCoursesByCategory(
  userId: string,
  categoryId: string
): Promise<(Course & { id: string })[]> {
  const q = query(
    collection(db, COURSES),
    where('userId', '==', userId),
    where('categoryId', '==', categoryId)
  )
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course & { id: string }))
  list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
  return list
}

export async function getCourse(courseId: string): Promise<(Course & { id: string }) | null> {
  const ref = doc(db, COURSES, courseId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Course & { id: string }
}

export async function createCourse(
  userId: string,
  categoryId: string,
  title: string,
  goal: string,
  level: string,
  topics: CourseTopic[]
): Promise<string> {
  const ref = doc(collection(db, COURSES))
  const now = serverTimestamp() as Timestamp
  await setDoc(ref, {
    userId,
    categoryId,
    title,
    goal,
    level,
    topics,
    createdAt: now,
  })
  return ref.id
}

// ---- Course progress ----

export async function getProgressByCourse(
  userId: string,
  courseId: string
): Promise<(CourseProgress & { id: string }) | null> {
  const q = query(
    collection(db, COURSE_PROGRESS),
    where('userId', '==', userId),
    where('courseId', '==', courseId),
    limit(1)
  )
  const snap = await getDocs(q)
  const d = snap.docs[0]
  if (!d) return null
  return { id: d.id, ...d.data() } as CourseProgress & { id: string }
}

export async function getProgressByUserForCourses(
  userId: string
): Promise<(CourseProgress & { id: string })[]> {
  const q = query(
    collection(db, COURSE_PROGRESS),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseProgress & { id: string }))
}

export async function createCourseProgress(
  userId: string,
  courseId: string,
  categoryId: string
): Promise<string> {
  const ref = doc(collection(db, COURSE_PROGRESS))
  const now = serverTimestamp() as Timestamp
  await setDoc(ref, {
    userId,
    courseId,
    categoryId,
    topicCompleted: {},
    startedAt: now,
    lastActivityAt: now,
    completedAt: null,
    totalLearningHours: 0,
  })
  return ref.id
}

export async function markTopicCompleted(
  progressId: string,
  topicId: string,
  learningMinutes: number
): Promise<void> {
  const ref = doc(db, COURSE_PROGRESS, progressId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data() as CourseProgress
  const topicCompleted = { ...data.topicCompleted, [topicId]: true }
  const topicIds = Object.keys(topicCompleted).filter((k) => topicCompleted[k])
  const courseSnap = await getDoc(doc(db, COURSES, data.courseId))
  const course = courseSnap.data() as Course
  const totalTopics = course?.topics?.length ?? 0
  const isComplete = totalTopics > 0 && topicIds.length >= totalTopics
  const addedHours = learningMinutes / 60
  await updateDoc(ref, {
    topicCompleted,
    lastActivityAt: serverTimestamp(),
    totalLearningHours: (data.totalLearningHours ?? 0) + addedHours,
    ...(isComplete ? { completedAt: serverTimestamp() } : {}),
  })
}

export async function getCompletedCoursesGroupedByCategory(
  userId: string
): Promise<Record<string, { course: Course & { id: string }; progress: CourseProgress & { id: string } }[]>> {
  const progressList = await getProgressByUserForCourses(userId)
  const completed = progressList.filter((p) => p.completedAt != null)
  const byCategory: Record<string, { course: Course & { id: string }; progress: CourseProgress & { id: string } }[]> = {}
  for (const progress of completed) {
    const course = await getCourse(progress.courseId)
    if (!course) continue
    if (!byCategory[progress.categoryId]) byCategory[progress.categoryId] = []
    byCategory[progress.categoryId].push({ course, progress })
  }
  for (const key of Object.keys(byCategory)) {
    byCategory[key].sort(
      (a, b) => (b.progress.completedAt?.toMillis?.() ?? 0) - (a.progress.completedAt?.toMillis?.() ?? 0)
    )
  }
  return byCategory
}
