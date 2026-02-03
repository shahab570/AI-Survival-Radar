import type { ToolItem, TrendingTopicItem } from '../types'

// Hottest AI Tools (Last 3 Days) - at least 10
export const HOTTEST_TOOLS: ToolItem[] = [
  { id: 'h1', name: 'ChatGPT', category: 'Chat', description: 'Conversational AI by OpenAI.', url: 'https://chat.openai.com', developer: 'OpenAI', reasonPopular: 'New model release and usage growth.', popularity: 98 },
  { id: 'h2', name: 'Claude', category: 'Chat', description: 'AI assistant by Anthropic.', url: 'https://claude.ai', developer: 'Anthropic', reasonPopular: 'Extended context and coding features.', popularity: 95 },
  { id: 'h3', name: 'Cursor', category: 'Dev Tools', description: 'AI-powered code editor.', url: 'https://cursor.com', developer: 'Cursor', reasonPopular: 'Adoption by developers for daily coding.', popularity: 92 },
  { id: 'h4', name: 'Midjourney', category: 'Image', description: 'AI image generation.', url: 'https://midjourney.com', developer: 'Midjourney', reasonPopular: 'V6 model updates.', popularity: 90 },
  { id: 'h5', name: 'Perplexity', category: 'Search', description: 'AI-powered search and answers.', url: 'https://perplexity.ai', developer: 'Perplexity', reasonPopular: 'Real-time search and citations.', popularity: 88 },
  { id: 'h6', name: 'Gemini', category: 'Chat', description: "Google's multimodal AI.", url: 'https://gemini.google.com', developer: 'Google', reasonPopular: 'Native integration across Google products.', popularity: 87 },
  { id: 'h7', name: 'Notion AI', category: 'Productivity', description: 'Writing and summarization in Notion.', url: 'https://notion.so', developer: 'Notion', reasonPopular: 'Workspace AI features.', popularity: 85 },
  { id: 'h8', name: 'Replicate', category: 'API', description: 'Run open-source models via API.', url: 'https://replicate.com', developer: 'Replicate', reasonPopular: 'Wide model catalog and ease of use.', popularity: 78 },
  { id: 'h9', name: 'Runway', category: 'Video', description: 'AI video and image tools.', url: 'https://runwayml.com', developer: 'Runway', reasonPopular: 'Gen-3 and creative tools.', popularity: 82 },
  { id: 'h10', name: 'Hugging Face', category: 'Platform', description: 'Models, datasets, and ML tools.', url: 'https://huggingface.co', developer: 'Hugging Face', reasonPopular: 'Open models and community.', popularity: 90 },
]

// Newest AI Tools in the Market
export const NEWEST_TOOLS: ToolItem[] = [
  { id: 'n1', name: 'Luma Dream Machine', category: 'Video', description: 'AI video generation from prompts.', url: 'https://lumalabs.ai', developer: 'Luma AI' },
  { id: 'n2', name: 'Devin', category: 'Dev Tools', description: 'Autonomous AI software engineer.', url: 'https://cognition.ai', developer: 'Cognition' },
  { id: 'n3', name: 'Gamma', category: 'Productivity', description: 'AI for presentations and docs.', url: 'https://gamma.app', developer: 'Gamma' },
  { id: 'n4', name: 'Suno', category: 'Audio', description: 'AI music generation.', url: 'https://suno.com', developer: 'Suno' },
  { id: 'n5', name: 'Ideogram', category: 'Image', description: 'AI image generation with text.', url: 'https://ideogram.ai', developer: 'Ideogram' },
  { id: 'n6', name: 'v0', category: 'Design', description: 'AI-generated UI components.', url: 'https://v0.dev', developer: 'Vercel' },
  { id: 'n7', name: 'Descript', category: 'Audio/Video', description: 'AI editing and overdub.', url: 'https://descript.com', developer: 'Descript' },
  { id: 'n8', name: 'Copy.ai', category: 'Marketing', description: 'AI copywriting for marketing.', url: 'https://copy.ai', developer: 'Copy.ai' },
]

// Trending Topics in AI Tools
export const TRENDING_TOPICS: TrendingTopicItem[] = [
  { id: 'tt1', title: 'AI agents', description: 'Autonomous agents that use tools and multi-step reasoning.', url: 'https://example.com' },
  { id: 'tt2', title: 'Multimodal AI', description: 'Models that handle text, image, audio, and video.', url: 'https://example.com' },
  { id: 'tt3', title: 'AI in education', description: 'Tutoring, grading, and personalized learning.', url: 'https://example.com' },
  { id: 'tt4', title: 'Open-source LLMs', description: 'Community models and local deployment.', url: 'https://example.com' },
  { id: 'tt5', title: 'AI coding assistants', description: 'Code generation, review, and refactoring.', url: 'https://example.com' },
  { id: 'tt6', title: 'AI regulation', description: 'EU AI Act and global policy developments.', url: 'https://example.com' },
]
