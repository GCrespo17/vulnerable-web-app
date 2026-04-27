import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  createMeal,
  createWorkout,
  getDailyLogDetail,
  type DailyLogDetail,
  type DemoUser,
  type MealCreateInput,
  type WorkoutCreateInput,
} from '../api/client'
import MealForm from '../components/MealForm'
import WorkoutForm from '../components/WorkoutForm'

type DailyLogDetailPageProps = {
  currentUser: DemoUser
}

function DailyLogDetailPage({ currentUser }: DailyLogDetailPageProps) {
  const { logId } = useParams()
  const parsedLogId = Number(logId)
  const [dailyLog, setDailyLog] = useState<DailyLogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDailyLog = useCallback(async () => {
    if (!Number.isFinite(parsedLogId)) {
      setError('Invalid daily log id.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const detail = await getDailyLogDetail(parsedLogId)
      setDailyLog(detail)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load daily log.')
    } finally {
      setLoading(false)
    }
  }, [parsedLogId])

  useEffect(() => {
    void loadDailyLog()
  }, [loadDailyLog])

  const handleWorkoutSubmit = async (payload: WorkoutCreateInput) => {
    await createWorkout(parsedLogId, payload)
    await loadDailyLog()
  }

  const handleMealSubmit = async (payload: MealCreateInput) => {
    await createMeal(parsedLogId, payload)
    await loadDailyLog()
  }

  return (
    <main className="page-shell detail-shell">
      <section className="page-header-card">
        <div>
          <p className="eyebrow">Daily log detail</p>
          <h1>Daily log overview</h1>
          <p className="page-copy">
            Review the selected entry for {currentUser.name}, add new workouts, and record meals
            for the day.
          </p>
        </div>
        <Link className="secondary-button button-link" to="/tracker">
          Back to tracker
        </Link>
      </section>

      {loading ? <p className="status-message">Loading daily log...</p> : null}
      {error ? <p className="status-message status-error">{error}</p> : null}

      {!loading && !error && dailyLog ? (
        <section className="detail-grid">
          <article className="panel-card">
            <div className="section-heading-row">
              <h2>{new Date(dailyLog.log_date).toLocaleDateString()}</h2>
              <span className="pill-badge">{dailyLog.visibility}</span>
            </div>

            <dl className="detail-meta-grid">
              <div>
                <dt>Mood</dt>
                <dd>{dailyLog.mood}</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{dailyLog.weight_kg} kg</dd>
              </div>
              <div>
                <dt>User</dt>
                <dd>#{dailyLog.user_id}</dd>
              </div>
            </dl>

            <p className="detail-notes">{dailyLog.notes}</p>
          </article>

          <article className="panel-card">
            <h2>Workouts</h2>
            <div className="stack-list compact-stack-list">
              {dailyLog.workouts.map((workout) => (
                <div key={workout.id} className="entry-card">
                  <div className="section-heading-row">
                    <strong>{workout.exercise_name}</strong>
                    <span className="feature-status">
                      {workout.sets} x {workout.reps}
                    </span>
                  </div>
                  <p>
                    {workout.duration_minutes} min · {workout.calories_burned} kcal
                  </p>
                  <p className="entry-notes">{workout.notes}</p>
                </div>
              ))}
              {dailyLog.workouts.length === 0 ? (
                <p className="status-message">No workouts recorded yet.</p>
              ) : null}
            </div>
            <WorkoutForm onSubmit={handleWorkoutSubmit} />
          </article>

          <article className="panel-card">
            <h2>Meals</h2>
            <div className="stack-list compact-stack-list">
              {dailyLog.meals.map((meal) => (
                <div key={meal.id} className="entry-card">
                  <div className="section-heading-row">
                    <strong>{meal.meal_name}</strong>
                    <span className="feature-status">{meal.calories} kcal</span>
                  </div>
                  <p>
                    Protein {meal.protein_g}g · Carbs {meal.carbs_g}g · Fat {meal.fat_g}g
                  </p>
                  <p className="entry-notes">{meal.notes}</p>
                </div>
              ))}
              {dailyLog.meals.length === 0 ? (
                <p className="status-message">No meals recorded yet.</p>
              ) : null}
            </div>
            <MealForm onSubmit={handleMealSubmit} />
          </article>
        </section>
      ) : null}
    </main>
  )
}

export default DailyLogDetailPage
