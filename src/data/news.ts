import type { NewsItem } from '../types'

// Category keys for Finland Intel & Global Trends (5 categories)
export const NEWS_CATEGORIES: Record<string, string> = {
  education: 'AI Education & Training',
  research: 'AI Research & Innovation',
  jobs: 'AI Jobs & Workforce',
  policy: 'AI Policies & Regulations',
  ethics: 'AI Ethics & Challenges',
}

export const FINLAND_NEWS: NewsItem[] = [
  { id: 'fi-1', title: 'Finland boosts AI strategy with new national program', source: 'Finnish Government', date: '2025-02-01', category: 'policy', excerpt: 'New funding and initiatives to strengthen AI research and adoption.', summary: 'Government announces national AI program with focus on education and industry.', url: 'https://example.com' },
  { id: 'fi-2', title: 'Helsinki startups raise €20M for AI solutions', source: 'Nordic Tech News', date: '2025-01-30', category: 'research', excerpt: 'Several Finnish AI startups close funding rounds.', summary: 'Local AI startups secure funding for scaling.', url: 'https://example.com' },
  { id: 'fi-3', title: 'Aalto University launches AI ethics course', source: 'Aalto University', date: '2025-01-28', category: 'education', excerpt: 'Free online course on responsible AI.', summary: 'New open course on AI ethics and safety.', url: 'https://example.com' },
  { id: 'fi-4', title: 'AI jobs in Finland up 40% year-over-year', source: 'TEK', date: '2025-01-25', category: 'jobs', excerpt: 'Demand for AI and ML roles continues to grow.', summary: 'Labour market report shows strong growth in AI roles.', url: 'https://example.com' },
  { id: 'fi-5', title: 'Finnish parliament debates AI regulation', source: 'Eduskunta', date: '2025-01-22', category: 'policy', excerpt: 'Discussion on aligning with EU AI Act.', summary: 'National debate on AI policies and compliance.', url: 'https://example.com' },
  { id: 'fi-6', title: 'VTT launches new AI research initiative', source: 'VTT', date: '2025-01-20', category: 'research', excerpt: 'Focus on industrial AI applications.', summary: 'Research center expands AI capabilities.', url: 'https://example.com' },
  { id: 'fi-7', title: 'University of Helsinki expands AI curriculum', source: 'University of Helsinki', date: '2025-01-18', category: 'education', excerpt: 'New modules in ML and NLP.', summary: 'Students get more AI course options.', url: 'https://example.com' },
  { id: 'fi-8', title: 'Public discussion: AI and job displacement in Finland', source: 'Finnish Innovation Fund', date: '2025-01-15', category: 'ethics', excerpt: 'Roundtable on workforce impact.', summary: 'Stakeholders discuss AI impact on employment.', url: 'https://example.com' },
  { id: 'fi-9', title: 'Federation of Finnish Technology Industries on AI skills', source: 'Teknologiateollisuus', date: '2025-01-12', category: 'jobs', excerpt: 'Employers call for more AI training.', summary: 'Industry body highlights skills gap.', url: 'https://example.com' },
  { id: 'fi-10', title: 'Finnish AI ethics guidelines published', source: 'Ministry of Economic Affairs', date: '2025-01-10', category: 'ethics', excerpt: 'Voluntary guidelines for companies.', summary: 'New national guidelines for ethical AI use.', url: 'https://example.com' },
]

export const GLOBAL_NEWS: NewsItem[] = [
  { id: 'gl-1', title: 'Major AI lab releases new frontier model', source: 'Tech Crunch', date: '2025-02-02', category: 'research', excerpt: 'New model claims state-of-the-art on key benchmarks.', summary: 'Latest frontier model release.', url: 'https://example.com' },
  { id: 'gl-2', title: 'EU AI Act implementation guide published', source: 'EU Commission', date: '2025-02-01', category: 'policy', excerpt: 'Guidance for companies on compliance.', summary: 'Official implementation guide for EU AI Act.', url: 'https://example.com' },
  { id: 'gl-3', title: 'Open-source LLM reaches new performance milestone', source: 'VentureBeat', date: '2025-01-30', category: 'research', excerpt: 'Community model rivals closed APIs.', summary: 'Open-source model benchmarks.', url: 'https://example.com' },
  { id: 'gl-4', title: 'Global AI education initiative launches', source: 'UNESCO', date: '2025-01-28', category: 'education', excerpt: 'International framework for AI literacy.', summary: 'New global AI education program.', url: 'https://example.com' },
  { id: 'gl-5', title: 'OECD report on AI and the future of work', source: 'OECD', date: '2025-01-25', category: 'jobs', excerpt: 'Analysis of job displacement and creation.', summary: 'Report on workforce trends.', url: 'https://example.com' },
  { id: 'gl-6', title: 'US executive order on AI safety', source: 'White House', date: '2025-01-22', category: 'policy', excerpt: 'New requirements for high-impact AI systems.', summary: 'Federal AI policy update.', url: 'https://example.com' },
  { id: 'gl-7', title: 'Leading labs sign AI safety pledge', source: 'Reuters', date: '2025-01-20', category: 'ethics', excerpt: 'Voluntary commitments on safety and transparency.', summary: 'Industry safety agreement.', url: 'https://example.com' },
  { id: 'gl-8', title: 'Breakthrough in multimodal AI', source: 'Nature', date: '2025-01-18', category: 'research', excerpt: 'New architecture improves vision-language performance.', summary: 'Research paper on multimodal models.', url: 'https://example.com' },
  { id: 'gl-9', title: 'Global AI training programs expand', source: 'Coursera', date: '2025-01-15', category: 'education', excerpt: 'Platforms report surge in AI course enrollments.', summary: 'Online learning trends.', url: 'https://example.com' },
  { id: 'gl-10', title: 'Debate: AI and human dignity', source: 'Philosophy & Tech', date: '2025-01-12', category: 'ethics', excerpt: 'Academic discussion on AI ethics.', summary: 'Scholarly debate on AI ethics.', url: 'https://example.com' },
]
