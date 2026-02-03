import type { Timestamp } from 'firebase/firestore'

export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  status: UserStatus
  createdAt: Timestamp
  lastLogin: Timestamp
  preferences: {
    dailyGoalMinutes: number
    notifications: boolean
  }
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Skill {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  estimatedHours: number
  icon: string
  category: string
}

export interface SyllabusTopicInput {
  title: string
  description: string
  estimatedMinutes: number
  keyPoints: string[]
}

export interface UserProgressTopic {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt: Timestamp | null
  reflection: string
  estimatedMinutes?: number
  keyPoints?: string[]
}

export interface UserProgress {
  id?: string
  userId: string
  skillId: string
  goal: string
  level: string
  topics: UserProgressTopic[]
  startedAt: Timestamp
  lastActivityAt: Timestamp
  completedAt: Timestamp | null
  progressPercentage: number
}

export interface Achievement {
  id?: string
  userId: string
  achievementId: string
  unlockedAt: Timestamp
  type: string
  points: number
}

export interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  image?: string
  url?: string
  category: string
  excerpt?: string
  summary?: string
}

export interface ToolItem {
  id: string
  name: string
  category: string
  description: string
  url: string
  popularity?: number
  bookmarked?: boolean
  developer?: string
  reasonPopular?: string
}

export interface TrendingTopicItem {
  id: string
  title: string
  description?: string
  url?: string
}

// ---- Skills Lab: Categories & Courses ----

export interface LearningCategory {
  id: string
  userId: string
  name: string
  order: number
}

export interface CourseResource {
  title: string
  url: string
  type: 'article' | 'tutorial' | 'video'
}

export interface CourseExercise {
  title: string
  description?: string
}

export interface CourseProject {
  title: string
  description: string
}

export interface CourseTopic {
  id: string
  title: string
  description: string
  estimatedMinutes?: number
  keyPoints?: string[]
  projects?: CourseProject[]
  exercises?: CourseExercise[]
  resources?: CourseResource[]
}

export interface Course {
  id: string
  userId: string
  categoryId: string
  title: string
  goal: string
  level: string
  topics: CourseTopic[]
  createdAt: Timestamp
}

export interface CourseProgress {
  id: string
  userId: string
  courseId: string
  categoryId: string
  topicCompleted: Record<string, boolean>
  startedAt: Timestamp
  lastActivityAt: Timestamp
  completedAt: Timestamp | null
  totalLearningHours: number
}
