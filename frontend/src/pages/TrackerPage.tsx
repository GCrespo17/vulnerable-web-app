import { useEffect, useState } from 'react'

import { createDailyLog, getDailyLogs, type DailyLog, type DailyLogCreateInput, type DemoUser } from '../api/client'
import DailyLogCard from '../components/DailyLogCard'

type TrackerPageProps = {
  currentUser: DemoUser
}

const initialLogForm: DailyLogCreateInput = {
  log_date: new Date().toISOString().slice(0, 10),
  mood: 'focused',
  weight_kg: 70,
  notes: '',
  visibility: 'private',
}

function TrackerPage({ currentUser }: TrackerPageProps) {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formState, setFormState] = useState<DailyLogCreateInput>(initialLogForm)

  useEffect(() => {
    let active = true

    const loadLogs = async () => {
      try {
        const logs = await getDailyLogs()
        if (active) {
          setDailyLogs(logs)
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load daily logs.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadLogs()

    return () => {
      active = false
    }
  }, [])

  const updateField = <K extends keyof DailyLogCreateInput>(field: K, value: DailyLogCreateInput[K]) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleCreateLog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      const createdLog = await createDailyLog(formState)
      setDailyLogs((current) => [createdLog, ...current])
      setFormState({ ...initialLogForm, log_date: formState.log_date, weight_kg: formState.weight_kg })
    } catch (createError) {
      setSaveError(createError instanceof Error ? createError.message : 'Unable to create daily log.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page-shell tracker-shell">
      <section className="page-header-card">
        <div>
          <p className="eyebrow">Tracker</p>
          <h1>Daily fitness logs</h1>
          <p className="page-copy">
            Create a new daily entry for {currentUser.name} and review the visible logs already
            available in the local demo app.
          </p>
          <p className="helper-note">
            Open any daily log below to add workouts and meals for that entry.
          </p>
        </div>
      </section>

      <section className="content-grid tracker-grid">
        <article className="panel-card">
          <h2>Create a daily log</h2>
          <form className="stack-form" onSubmit={handleCreateLog}>
            <div className="form-grid two-column-grid">
              <label className="field-group">
                <span className="field-label">Date</span>
                <input
                  className="field-input"
                  type="date"
                  value={formState.log_date}
                  onChange={(event) => updateField('log_date', event.target.value)}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Mood</span>
                <input
                  className="field-input"
                  value={formState.mood}
                  onChange={(event) => updateField('mood', event.target.value)}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Weight (kg)</span>
                <input
                  className="field-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formState.weight_kg}
                  onChange={(event) => updateField('weight_kg', Number(event.target.value))}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Visibility</span>
                <select
                  className="field-input"
                  value={formState.visibility}
                  onChange={(event) => updateField('visibility', event.target.value)}
                >
                  <option value="private">private</option>
                  <option value="public">public</option>
                </select>
              </label>
            </div>

            <label className="field-group">
              <span className="field-label">Notes</span>
              <textarea
                className="field-input field-textarea"
                value={formState.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                rows={4}
                required
              />
            </label>

            {saveError ? <p className="status-message status-error">{saveError}</p> : null}

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving log...' : 'Create daily log'}
            </button>
          </form>
        </article>

        <article className="panel-card">
          <div className="section-heading-row">
            <h2>Recent logs</h2>
            <span className="feature-status">{dailyLogs.length} entries</span>
          </div>

          {loading ? <p className="status-message">Loading daily logs...</p> : null}
          {error ? <p className="status-message status-error">{error}</p> : null}

          {!loading && !error && dailyLogs.length === 0 ? (
            <p className="status-message">No daily logs available yet.</p>
          ) : null}

          <div className="stack-list">
            {dailyLogs.map((log) => (
              <DailyLogCard key={log.id} log={log} />
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default TrackerPage
