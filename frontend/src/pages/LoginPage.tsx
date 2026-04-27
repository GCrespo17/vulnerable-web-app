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

  const handleSubmit = () => {
    if (!selectedUser) {
      return
    }

    onUserSelected(selectedUser)
    navigate('/dashboard')
  }

  return (
    <main className="page-shell auth-shell">
      <section className="auth-card">
        <p className="eyebrow">FitTrackLab</p>
        <h1>Select a demo user</h1>
        <p className="page-copy">
          Choose one of the seeded classroom accounts to enter the local fitness tracker
          environment. The app will use that selection for later backend requests.
        </p>

        {loading ? <p className="status-message">Loading demo users...</p> : null}
        {error ? <p className="status-message status-error">{error}</p> : null}

        {!loading && !error ? (
          <>
            <UserSelector
              users={users}
              selectedUserId={selectedUserId}
              onChange={setSelectedUserId}
            />
            <button className="primary-button" type="button" onClick={handleSubmit}>
              Enter dashboard
            </button>
          </>
        ) : null}
      </section>
    </main>
  )
}

export default LoginPage
