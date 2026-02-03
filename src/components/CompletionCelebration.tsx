import { Trophy, ChevronRight, Sparkles } from 'lucide-react'

interface CompletionCelebrationProps {
  skillName: string
  onContinue: () => void
  onNextSkill: () => void
}

export function CompletionCelebration({
  skillName,
  onContinue,
  onNextSkill,
}: CompletionCelebrationProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-slate-800/50 p-8 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-emerald-500/20 p-4">
          <Trophy className="h-16 w-16 text-emerald-400" aria-hidden />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">Congratulations!</h1>
      <p className="mt-2 text-slate-400">You’ve completed <strong className="text-white">{skillName}</strong>.</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400">
        <Sparkles className="h-4 w-4" aria-hidden />
        Skill added to your completed list
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Keep the momentum — try another skill to build your AI toolkit.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700"
        >
          Back to Skills Lab
        </button>
        <button
          type="button"
          onClick={onNextSkill}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-cyan-400"
        >
          Find next skill
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
