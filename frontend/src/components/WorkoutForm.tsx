import { useState } from 'react'

import type { WorkoutCreateInput } from '../api/client'

type WorkoutFormProps = {
  onSubmit: (payload: WorkoutCreateInput) => Promise<void>
}

const initialState: WorkoutCreateInput = {
  exercise_name: '',
  sets: 3,
  reps: 8,
  duration_minutes: 20,
  calories_burned: 180,
  notes: '',
}

function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [formState, setFormState] = useState<WorkoutCreateInput>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof WorkoutCreateInput>(field: K, value: WorkoutCreateInput[K]) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await onSubmit(formState)
      setFormState(initialState)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save workout.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid two-column-grid">
        <label className="field-group">
          <span className="field-label">Exercise name</span>
          <input
            className="field-input"
            value={formState.exercise_name}
            onChange={(event) => updateField('exercise_name', event.target.value)}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Notes</span>
          <input
            className="field-input"
            value={formState.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Sets</span>
          <input
            className="field-input"
            type="number"
            min="1"
            value={formState.sets}
            onChange={(event) => updateField('sets', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Reps</span>
          <input
            className="field-input"
            type="number"
            min="1"
            value={formState.reps}
            onChange={(event) => updateField('reps', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Duration (minutes)</span>
          <input
            className="field-input"
            type="number"
            min="1"
            value={formState.duration_minutes}
            onChange={(event) => updateField('duration_minutes', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Calories burned</span>
          <input
            className="field-input"
            type="number"
            min="0"
            value={formState.calories_burned}
            onChange={(event) => updateField('calories_burned', Number(event.target.value))}
            required
          />
        </label>
      </div>

      {error ? <p className="status-message status-error">{error}</p> : null}

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving workout...' : 'Add workout'}
      </button>
    </form>
  )
}

export default WorkoutForm
