import { useEffect, useState } from 'react'
import { Shield, Check, X, Loader2, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/constants'
import { getPendingUsers, getAllUsers, updateUserStatus } from '../lib/firestore'
import type { AppUser } from '../types'
import { useNavigate } from 'react-router-dom'

export function Admin() {
  const { appUser, firebaseUser } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState<(AppUser & { id: string })[]>([])
  const [allUsers, setAllUsers] = useState<(AppUser & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  const admin = isAdmin(appUser?.email ?? firebaseUser?.email ?? null)

  useEffect(() => {
    if (!admin) {
      navigate('/dashboard')
      return
    }
    Promise.all([getPendingUsers(), getAllUsers()]).then(([p, u]) => {
      setPending(p)
      setAllUsers(u)
      setLoading(false)
    })
  }, [admin, navigate])

  const handleApprove = async (uid: string) => {
    await updateUserStatus(uid, 'approved')
    setPending((prev) => prev.filter((u) => u.uid !== uid))
    setAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, status: 'approved' as const } : u)))
  }

  const handleReject = async (uid: string) => {
    await updateUserStatus(uid, 'rejected')
    setPending((prev) => prev.filter((u) => u.uid !== uid))
    setAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, status: 'rejected' as const } : u)))
  }

  if (!admin) return null

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
          <Shield className="h-8 w-8 text-cyan-400" />
          Admin
        </h1>
        <p className="mt-1 text-slate-400">Manage join requests and user access.</p>
      </div>

      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <h2 className="text-lg font-semibold text-white">Pending join requests</h2>
        <p className="mt-1 text-sm text-slate-500">Approve or reject new user requests.</p>
        {pending.length === 0 ? (
          <p className="mt-4 text-slate-500">No pending requests.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((u) => (
              <li
                key={u.uid}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <div>
                  <p className="font-medium text-white">{u.displayName ?? u.email ?? u.uid}</p>
                  <p className="text-sm text-slate-400">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(u.uid)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(u.uid)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/50 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Users className="h-5 w-5 text-cyan-400" />
          All users
        </h2>
        <p className="mt-1 text-sm text-slate-500">View and manage existing users.</p>
        <ul className="mt-4 space-y-2">
          {allUsers.map((u) => (
            <li
              key={u.uid}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{u.displayName ?? u.email ?? u.uid}</p>
                <p className="text-sm text-slate-400">{u.email}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  (u.status ?? 'approved') === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : (u.status ?? 'approved') === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {u.status ?? 'approved'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
