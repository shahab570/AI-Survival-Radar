import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  FlaskConical,
  Trophy,
  Newspaper,
  Globe,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/constants'
import { cn } from '../lib/utils'

const baseNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/skills', icon: FlaskConical, label: 'Skills Lab' },
  { to: '/dashboard/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/dashboard/finland-intel', icon: Newspaper, label: 'Finland Intel' },
  { to: '/dashboard/global-trends', icon: Globe, label: 'Global Trends' },
  { to: '/dashboard/tools-buzz', icon: Wrench, label: 'Tools Buzz' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { appUser, firebaseUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const admin = isAdmin(appUser?.email ?? firebaseUser?.email ?? null)
  const navItems = admin
    ? [...baseNavItems, { to: '/dashboard/admin', icon: Shield, label: 'Admin' }]
    : baseNavItems

  const displayName = appUser?.displayName ?? firebaseUser?.displayName ?? 'Learner'
  const photoURL = appUser?.photoURL ?? firebaseUser?.photoURL ?? null

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-slate-300 lg:hidden"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-slate-700/50 bg-slate-900/95 shadow-xl transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-700/50 px-4 lg:pl-4">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-semibold text-white">AI Survival Radar</span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )
              }
              aria-current={undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700/50 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            {photoURL ? (
              <img
                src={photoURL}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/30 text-cyan-400 text-sm font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate text-sm text-slate-300">{displayName}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close overlay"
        />
      )}
    </>
  )
}
