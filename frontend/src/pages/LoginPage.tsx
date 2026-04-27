import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login, type DemoUser } from '../api/client'

type LoginPageProps = {
  currentUser: DemoUser | null
  onUserSelected: (user: DemoUser) => void
}

function LoginPage({ currentUser, onUserSelected }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email)
    }
  }, [currentUser])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await login(email, password)
      onUserSelected(response.user)
      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell auth-shell">
      <section className="auth-card">
        <p className="eyebrow">FitTrackLab</p>
        <h1>Sign in to continue</h1>
        <p className="page-copy">
          Sign in with one of the seeded local lab accounts to access the fitness tracker
          dashboard and keep your session active for the rest of the app.
        </p>

        <div className="auth-demo-note">
          <strong>Demo mode</strong>
          <span>Use the fake local lab credentials configured for this classroom project.</span>
        </div>

        {error ? <p className="status-message status-error">{error}</p> : null}

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span className="field-label">Email</span>
            <input
              className="field-input"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alice@example.fit"
              autoComplete="username"
              required
            />
          </label>
          <label className="field-group">
            <span className="field-label">Password</span>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your demo password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
