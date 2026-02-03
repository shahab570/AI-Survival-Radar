import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export function getGeminiModel(): GenerativeModel | null {
  return genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }) : null
}

export interface SyllabusTopic {
  title: string
  description: string
  estimatedMinutes: number
  keyPoints: string[]
}

export async function generateSyllabus(
  skillName: string,
  goal: string,
  level: string
): Promise<SyllabusTopic[]> {
  const model = getGeminiModel()
  if (!model) {
    return getFallbackSyllabus(skillName, goal, level)
  }

  const prompt = `Create a personalized learning curriculum for "${skillName}".
User goal: ${goal}. Experience level: ${level}.
Generate 6-8 progressive topics. For each topic provide:
- title (short, clear)
- description (2-3 sentences)
- estimatedMinutes (number, 5-30)
- keyPoints (array of 3-5 short bullet points)

Respond with ONLY a valid JSON array, no markdown or extra text. Example format:
[{"title":"...","description":"...","estimatedMinutes":15,"keyPoints":["...","..."]}]`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim()
    const parsed = JSON.parse(cleaned) as SyllabusTopic[]
    return Array.isArray(parsed) ? parsed.slice(0, 8) : getFallbackSyllabus(skillName, goal, level)
  } catch {
    return getFallbackSyllabus(skillName, goal, level)
  }
}

function getFallbackSyllabus(_skillName: string, _goal: string, _level: string): SyllabusTopic[] {
  return [
    { title: 'Introduction & context', description: 'Why this skill matters and how it fits into the AI landscape.', estimatedMinutes: 10, keyPoints: ['Context', 'Goals', 'Outcomes'] },
    { title: 'Core concepts', description: 'Foundational ideas and terminology you need to know.', estimatedMinutes: 15, keyPoints: ['Definitions', 'Concepts', 'Examples'] },
    { title: 'Hands-on basics', description: 'First practical steps and simple exercises.', estimatedMinutes: 20, keyPoints: ['Setup', 'Try it', 'Practice'] },
    { title: 'Intermediate techniques', description: 'Deeper techniques and common patterns.', estimatedMinutes: 25, keyPoints: ['Patterns', 'Best practices', 'Tips'] },
    { title: 'Real-world application', description: 'Applying the skill in realistic scenarios.', estimatedMinutes: 20, keyPoints: ['Use cases', 'Projects', 'Integration'] },
    { title: 'Review & next steps', description: 'Recap and how to keep improving.', estimatedMinutes: 10, keyPoints: ['Summary', 'Resources', 'Next skills'] },
  ]
}

// Adaptive: generate next-level syllabus excluding topics already learned in this category
export interface CourseTopicInput {
  id: string
  title: string
  description: string
  estimatedMinutes?: number
  keyPoints?: string[]
  projects?: { title: string; description: string }[]
  exercises?: { title: string; description?: string }[]
  resources?: { title: string; url: string; type: 'article' | 'tutorial' | 'video' }[]
}

export async function generateAdaptiveCourseSyllabus(
  categoryName: string,
  goal: string,
  level: string,
  alreadyLearnedTopicTitles: string[],
  detailedGoal?: string,
  learningStyle?: string,
  courseStructure?: string
): Promise<CourseTopicInput[]> {
  const model = getGeminiModel()
  const excludeHint =
    alreadyLearnedTopicTitles.length > 0
      ? ` The user has already completed courses in this category covering these topics - EXCLUDE them and only suggest NEW, more advanced topics: ${alreadyLearnedTopicTitles.join(', ')}.`
      : ' This is their first course in this category - provide a solid foundation (beginner-friendly if level is Beginner).'

  const preferencesHint = detailedGoal || learningStyle || courseStructure
    ? `\n\nUser Preferences:
${detailedGoal ? `- Specific goal: ${detailedGoal}` : ''}
${learningStyle ? `- Learning style: ${learningStyle}` : ''}
${courseStructure ? `- Course structure: ${courseStructure}` : ''}`
    : ''

  const prompt = `Create a personalized learning curriculum for the category "${categoryName}".
User goal: ${goal}. Experience level: ${level}.${excludeHint}${preferencesHint}

Generate 6-8 progressive topics. For each topic provide:
- title (short, clear)
- description (2-3 sentences)
- estimatedMinutes (number, 5-30)
- keyPoints (array of 3-5 short bullet points)
- projects (array of 0-2 items: { "title": "...", "description": "..." })
- exercises (array of 0-2 items: { "title": "...", "description": "..." })
- resources (array of 0-3 items with SEARCHABLE titles - NO URLs needed)

IMPORTANT - Resources Format:
Instead of providing URLs (which may break), provide SEARCHABLE resource titles that users can easily find:
- For YouTube: "Search YouTube: [specific search term]"
- For articles: "Search Google: [article topic + site name]"
- For docs: "Official [Technology] Documentation"

Examples:
✅ Good: { "title": "Search YouTube: React Hooks Tutorial for Beginners", "type": "video" }
✅ Good: { "title": "MDN Web Docs: JavaScript Promises", "type": "tutorial" }
✅ Good: { "title": "Search Google: CSS Grid Guide CSS-Tricks", "type": "article" }
❌ Bad: { "title": "React Tutorial", "url": "https://...", "type": "video" }

This approach ensures users can always find the resources by searching, even if specific URLs change.
Respond with ONLY a valid JSON array, no markdown or extra text. Example format:
[{"title":"...","description":"...","estimatedMinutes":15,"keyPoints":["..."],"projects":[],"exercises":[],"resources":[]}]`

  if (!model) {
    console.error('❌ Gemini model not initialized. API key:', import.meta.env.VITE_GEMINI_API_KEY ? 'EXISTS' : 'MISSING')
    return getFallbackCourseTopics(categoryName, alreadyLearnedTopicTitles.length > 0)
  }

  console.log('✅ Gemini API key loaded, generating course...')
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    console.log('📝 Raw Gemini response:', text.substring(0, 200))
    const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim()
    const parsed = JSON.parse(cleaned) as CourseTopicInput[]
    if (!Array.isArray(parsed)) return getFallbackCourseTopics(categoryName, alreadyLearnedTopicTitles.length > 0)
    console.log('✅ Successfully generated', parsed.length, 'topics with Gemini AI')
    return parsed.slice(0, 8).map((t, i) => ({
      ...t,
      id: `topic-${i}`,
      title: t.title ?? '',
      description: t.description ?? '',
    }))
  } catch (error) {
    console.error('❌ Gemini API error:', error)
    alert(`⚠️ Gemini API Error: ${error instanceof Error ? error.message : String(error)}\n\nFalling back to dummy content. Check console for details.`)
    return getFallbackCourseTopics(categoryName, alreadyLearnedTopicTitles.length > 0)
  }
}

function getFallbackCourseTopics(categoryName: string, isAdvanced: boolean): CourseTopicInput[] {
  if (isAdvanced) {
    return [
      { id: 'topic-0', title: 'Advanced patterns', description: 'Deeper patterns and best practices.', estimatedMinutes: 20, keyPoints: [], projects: [], exercises: [], resources: [] },
      { id: 'topic-1', title: 'Production & scale', description: 'Taking skills to production.', estimatedMinutes: 25, keyPoints: [], projects: [], exercises: [], resources: [] },
      { id: 'topic-2', title: 'Integration & APIs', description: 'Integrating with real systems.', estimatedMinutes: 25, keyPoints: [], projects: [], exercises: [], resources: [] },
      { id: 'topic-3', title: 'Case studies', description: 'Real-world case studies.', estimatedMinutes: 20, keyPoints: [], projects: [], exercises: [], resources: [] },
    ]
  }
  return [
    { id: 'topic-0', title: 'Introduction to ' + categoryName, description: 'Why it matters and what you will learn.', estimatedMinutes: 10, keyPoints: [], projects: [], exercises: [], resources: [] },
    { id: 'topic-1', title: 'Core concepts', description: 'Foundational ideas and terminology.', estimatedMinutes: 15, keyPoints: [], projects: [], exercises: [], resources: [] },
    { id: 'topic-2', title: 'Hands-on basics', description: 'First practical steps.', estimatedMinutes: 20, keyPoints: [], projects: [], exercises: [], resources: [] },
    { id: 'topic-3', title: 'Practice & projects', description: 'Apply what you learned.', estimatedMinutes: 25, keyPoints: [], projects: [], exercises: [], resources: [] },
    { id: 'topic-4', title: 'Review & next steps', description: 'Recap and resources.', estimatedMinutes: 10, keyPoints: [], projects: [], exercises: [], resources: [] },
  ]
}
