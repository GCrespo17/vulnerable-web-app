import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
  clearStoredDemoUser,
  getStoredDemoUser,
  storeDemoUser,
  type DemoUser,
} from './api/client'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => getStoredDemoUser())

  const handleSelectUser = (user: DemoUser) => {
    storeDemoUser(user)
    setDemoUser(user)
  }

  const handleSignOut = () => {
    clearStoredDemoUser()
    setDemoUser(null)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={demoUser ? '/dashboard' : '/login'} replace />}
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
