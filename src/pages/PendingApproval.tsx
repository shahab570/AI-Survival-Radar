import { useAuth } from '../contexts/AuthContext'
import { LogOut } from 'lucide-react'

export function PendingApproval() {
  const { appUser, firebaseUser, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center">
        <h1 className="text-xl font-bold text-white">Join request sent</h1>
        <p className="mt-2 text-slate-400">
          Your account is pending approval. An admin will review your request and you’ll be able to access the app once approved.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Logged in as {appUser?.email ?? firebaseUser?.email ?? '—'}
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
