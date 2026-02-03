import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PendingApproval } from '../pages/PendingApproval'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, appUser, loading } = useAuth()
  const location = useLocation()
  const status = appUser?.status ?? 'approved'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900" aria-busy="true">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (status !== 'approved') {
    return <PendingApproval />
  }

  return <>{children}</>
}
