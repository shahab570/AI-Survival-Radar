export const ACHIEVEMENT_DEFINITIONS: Record<
  string,
  { title: string; description: string; icon: string; points: number }
> = {
  'first-skill-started': {
    title: 'First Steps',
    description: 'Started your first skill',
    icon: 'play',
    points: 10,
  },
  'first-skill-completed': {
    title: 'First Victory',
    description: 'Completed your first skill',
    icon: 'trophy',
    points: 50,
  },
  'streak-3': {
    title: 'On a Roll',
    description: '3-day learning streak',
    icon: 'flame',
    points: 20,
  },
  'streak-7': {
    title: 'Week Warrior',
    description: '7-day learning streak',
    icon: 'flame',
    points: 50,
  },
  'skills-5': {
    title: 'Rising Star',
    description: 'Completed 5 skills',
    icon: 'star',
    points: 100,
  },
  'skills-10': {
    title: 'AI Survivor',
    description: 'Completed 10 skills',
    icon: 'shield',
    points: 200,
  },
}
