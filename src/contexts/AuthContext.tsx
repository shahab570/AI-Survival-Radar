import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { setUser } from '../lib/firestore'
import type { AppUser } from '../types'

interface AuthState {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    appUser: null,
    loading: true,
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ firebaseUser: null, appUser: null, loading: false })
        return
      }
      const { getUser } = await import('../lib/firestore')
      await setUser(user.uid, {
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
      })
      const appUser = await getUser(user.uid)
      setState({
        firebaseUser: user,
        appUser: appUser ?? null,
        loading: false,
      })
    })
    return () => unsub()
  }, [])

  const signInWithGoogle = async () => {
    const { googleProvider } = await import('../lib/firebase')
    await signInWithPopup(auth, googleProvider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setState({ firebaseUser: null, appUser: null, loading: false })
  }

  const value: AuthContextValue = {
    ...state,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
