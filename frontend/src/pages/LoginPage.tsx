import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getDemoUsers, type DemoUser } from '../api/client'
import UserSelector from '../components/UserSelector'

type LoginPageProps = {
  currentUser: DemoUser | null
  onUserSelected: (user: DemoUser) => void
}

function LoginPage({ currentUser, onUserSelected }: LoginPageProps) {
  const navigate = useNavigate()
  const [users, setUsers] = useState<DemoUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(currentUser?.id ?? null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const demoUsers = await getDemoUsers()
        if (!active) {
          return
        }

        setUsers(demoUsers)
        if (!selectedUserId && demoUsers[0]) {
          setSelectedUserId(demoUsers[0].id)
        }
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load demo users.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      active = false
    }
  }, [])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedUser || !password.trim()) {
      return
    }

    onUserSelected(selectedUser)
    navigate('/dashboard')
  }

  return (
    <main className="page-shell auth-shell">
      <section className="auth-card">
        <p className="eyebrow">FitTrackLab</p>
        <h1>Sign in to continue</h1>
        <p className="page-copy">
          Use one of the seeded classroom accounts to enter the local fitness tracker
          environment. The sign-in form stays in demo mode and maps your selection to the
          backend demo user header.
        </p>

        <div className="auth-demo-note">
          <strong>Demo mode</strong>
          <span>Select a seeded account and enter any password to continue.</span>
        </div>

        {loading ? <p className="status-message">Loading demo users...</p> : null}
        {error ? <p className="status-message status-error">{error}</p> : null}

        {!loading && !error ? (
          <form className="stack-form" onSubmit={handleSubmit}>
            <UserSelector
              users={users}
              selectedUserId={selectedUserId}
              onChange={setSelectedUserId}
            />
            <label className="field-group">
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter any demo password"
                autoComplete="current-password"
                required
              />
            </label>
            <button className="primary-button" type="submit">
              Sign in
            </button>
          </form>
        ) : null}
      </section>
    </main>
  )
}

export default LoginPage
