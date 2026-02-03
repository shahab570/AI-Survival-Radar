import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { SkillsLab } from './pages/SkillsLab'
import { CourseDetail } from './pages/CourseDetail'
import { Achievements } from './pages/Achievements'
import { FinlandIntel } from './pages/FinlandIntel'
import { GlobalTrends } from './pages/GlobalTrends'
import { ToolsBuzz } from './pages/ToolsBuzz'
import { Settings } from './pages/Settings'
import { Admin } from './pages/Admin'

function HomeOrLanding() {
  const { firebaseUser, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }
  if (firebaseUser) return <Navigate to="/dashboard" replace />
  return <Landing /> 
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeOrLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="skills" element={<SkillsLab />} />
            <Route path="skills/course/:courseId" element={<CourseDetail />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="finland-intel" element={<FinlandIntel />} />
            <Route path="global-trends" element={<GlobalTrends />} />
            <Route path="tools-buzz" element={<ToolsBuzz />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
