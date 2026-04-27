import { useState } from 'react'

import { searchRecords, type DemoUser, type SearchResults } from '../api/client'

type SearchPageProps = {
  currentUser: DemoUser
}

function SearchPage({ currentUser }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await searchRecords(query.trim())
      setResults(response)
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Unable to complete search.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell search-shell">
      <section className="page-header-card">
        <div>
          <p className="eyebrow">Search</p>
          <h1>Search notes and entries</h1>
          <p className="page-copy">
            Search through logs, meals, and workouts for {currentUser.name} using the same
            search bar that will support the rest of the tracker.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="field-input search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes, meals, or workouts"
          />
          <button className="primary-button search-button" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error ? <p className="status-message status-error">{error}</p> : null}
      </section>

      {results ? (
        <section className="search-results-grid">
          <article className="panel-card">
            <div className="section-heading-row">
              <h2>Daily logs</h2>
              <span className="feature-status">{results.daily_logs.length} matches</span>
            </div>
            <div className="stack-list compact-stack-list">
              {results.daily_logs.map((log) => (
                <div key={log.id} className="entry-card">
                  <strong>{new Date(log.log_date).toLocaleDateString()}</strong>
                  <p className="entry-notes">{log.notes}</p>
                </div>
              ))}
              {results.daily_logs.length === 0 ? <p className="status-message">No matches.</p> : null}
            </div>
          </article>

          <article className="panel-card">
            <div className="section-heading-row">
              <h2>Workouts</h2>
              <span className="feature-status">{results.workouts.length} matches</span>
            </div>
            <div className="stack-list compact-stack-list">
              {results.workouts.map((workout) => (
                <div key={workout.id} className="entry-card">
                  <strong>{workout.exercise_name}</strong>
                  <p className="entry-notes">{workout.notes}</p>
                </div>
              ))}
              {results.workouts.length === 0 ? <p className="status-message">No matches.</p> : null}
            </div>
          </article>

          <article className="panel-card">
            <div className="section-heading-row">
              <h2>Meals</h2>
              <span className="feature-status">{results.meals.length} matches</span>
            </div>
            <div className="stack-list compact-stack-list">
              {results.meals.map((meal) => (
                <div key={meal.id} className="entry-card">
                  <strong>{meal.meal_name}</strong>
                  <p className="entry-notes">{meal.notes}</p>
                </div>
              ))}
              {results.meals.length === 0 ? <p className="status-message">No matches.</p> : null}
            </div>
          </article>
        </section>
      ) : null}
    </main>
  )
}

export default SearchPage
