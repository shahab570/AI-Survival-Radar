import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateUserPreferences } from '../lib/firestore'

export function Settings() {
  const { firebaseUser, appUser } = useAuth()
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30)
  const [notifications, setNotifications] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (appUser?.preferences) {
      setDailyGoalMinutes(appUser.preferences.dailyGoalMinutes ?? 30)
      setNotifications(appUser.preferences.notifications ?? true)
    }
  }, [appUser])

  const handleSave = async () => {
    if (!firebaseUser?.uid) return
    setSaving(true)
    setSaved(false)
    try {
      await updateUserPreferences(firebaseUser.uid, {
        dailyGoalMinutes,
        notifications,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const displayName = appUser?.displayName ?? firebaseUser?.displayName ?? '—'
  const email = appUser?.email ?? firebaseUser?.email ?? '—'
  const photoURL = appUser?.photoURL ?? firebaseUser?.photoURL ?? null

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Settings</h1>
        <p className="mt-1 text-slate-400">Manage your account and preferences.</p>
      </div>

      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <div className="mt-4 flex items-center gap-4">
          {photoURL ? (
            <img
              src={photoURL}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/30 text-2xl font-medium text-cyan-400">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{displayName}</p>
            <p className="text-sm text-slate-400">{email}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Profile photo and name are managed by your Google account.
        </p>
      </section>

      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <h2 className="text-lg font-semibold text-white">Preferences</h2>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Daily learning goal (minutes)</span>
            <input
              type="number"
              min={5}
              max={120}
              step={5}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="mt-2 w-full max-w-[8rem] rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-slate-300">Enable notifications</span>
          </label>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-4 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-cyan-400"
        >
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save preferences'}
        </button>
      </section>

      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <h2 className="text-lg font-semibold text-white">Legal</h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href="#" className="text-cyan-400 hover:underline">
            Privacy policy
          </a>
          <a href="#" className="text-cyan-400 hover:underline">
            Terms of service
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <h2 className="text-lg font-semibold text-white">Danger zone</h2>
        <p className="mt-2 text-sm text-slate-400">
          Deleting your account will remove all progress and data. This cannot be undone.
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg border border-red-500/50 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
        >
          Delete account
        </button>
      </section>
    </div>
  )
}
