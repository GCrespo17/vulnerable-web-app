import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
    clearStoredDemoUser,
    getCurrentUser,
    getStoredAuthToken,
    getStoredDemoUser,
    logout,
    type DemoUser,
} from './api/client'
import DashboardPage from './pages/DashboardPage'
import DailyLogDetailPage from './pages/DailyLogDetailPage'
import FilesPage from './pages/FilesPage'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import TrackerPage from './pages/TrackerPage'

function App() {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => getStoredDemoUser())
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const hydrateAuth = async () => {
      const storedToken = getStoredAuthToken()

      if (!storedToken) {
        setAuthReady(true)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setDemoUser(currentUser)
      } catch {
        clearStoredDemoUser()
        setDemoUser(null)
      } finally {
        setAuthReady(true)
      }
    }

    void hydrateAuth()
  }, [])

  const handleSelectUser = (user: DemoUser) => {
    setDemoUser(user)
  }

  const handleSignOut = () => {
    void logout().finally(() => {
      setDemoUser(null)
    })
  }

  if (!authReady) {
    return <main className="page-shell auth-shell"><section className="auth-card"><p className="status-message">Loading session...</p></section></main>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={<LoginPage currentUser={demoUser} onUserSelected={handleSelectUser} />}
      />
      <Route
        path="/dashboard"
        element={
          demoUser ? (
            <DashboardPage currentUser={demoUser} onSwitchUser={handleSignOut} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/tracker"
        element={demoUser ? <TrackerPage currentUser={demoUser} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/daily-logs/:logId"
        element={
          demoUser ? <DailyLogDetailPage currentUser={demoUser} /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/search"
        element={demoUser ? <SearchPage currentUser={demoUser} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/files"
        element={demoUser ? <FilesPage currentUser={demoUser} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
