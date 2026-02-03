import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Shaktih from './pages/Shaktih'
import Shiksha from './pages/Shiksha'
import Samruddhih from './pages/Samruddhih'
import UdyamKosh from './pages/UdyamKosh'
import StartupGuide from './pages/StartupGuide'
import ViyaApply from './pages/ViyaApply'
import Unnati from './pages/Unnati'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Docs from './pages/Docs'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'

function Notifications() {
  const { notifications } = useAuth()
  if (!notifications || notifications.length === 0) return null
  return (
    <div className="notifications" role="status" aria-live="polite">
      {notifications.map(n => (
        <div key={n.id} className="notification">
          <div className="notification-message">{n.msg}</div>
          {n.explanation && (
            <div className="notification-explanation">
              <strong>Why am I seeing this?</strong> {n.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location }, replace: true })
    }
  }, [user, loading, navigate, location])

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  if (!user) return null

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<Docs />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <div className="app">
              <Header />
              <Notifications />
              <main id="main">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shiksha" element={<Shiksha />} />
                  <Route path="/samruddhih" element={<Samruddhih />} />
                  <Route path="/apply" element={<ViyaApply />} />
                  <Route path="/udyam-kosh" element={<UdyamKosh />} />
                  <Route path="/startup-guide" element={<StartupGuide />} />
                  <Route path="/unnati" element={<Unnati />} />
                  <Route path="/shaktih" element={<Shaktih />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}
