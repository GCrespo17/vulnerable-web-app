import { useState } from 'react'

import type { MealCreateInput } from '../api/client'

type MealFormProps = {
  onSubmit: (payload: MealCreateInput) => Promise<void>
}

const initialState: MealCreateInput = {
  meal_name: '',
  calories: 450,
  protein_g: 30,
  carbs_g: 40,
  fat_g: 14,
  notes: '',
}

function MealForm({ onSubmit }: MealFormProps) {
  const [formState, setFormState] = useState<MealCreateInput>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof MealCreateInput>(field: K, value: MealCreateInput[K]) => {
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
      setError(submitError instanceof Error ? submitError.message : 'Unable to save meal.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid two-column-grid">
        <label className="field-group">
          <span className="field-label">Meal name</span>
          <input
            className="field-input"
            value={formState.meal_name}
            onChange={(event) => updateField('meal_name', event.target.value)}
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
          <span className="field-label">Calories</span>
          <input
            className="field-input"
            type="number"
            min="0"
            value={formState.calories}
            onChange={(event) => updateField('calories', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Protein (g)</span>
          <input
            className="field-input"
            type="number"
            min="0"
            step="0.1"
            value={formState.protein_g}
            onChange={(event) => updateField('protein_g', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Carbs (g)</span>
          <input
            className="field-input"
            type="number"
            min="0"
            step="0.1"
            value={formState.carbs_g}
            onChange={(event) => updateField('carbs_g', Number(event.target.value))}
            required
          />
        </label>

        <label className="field-group">
          <span className="field-label">Fat (g)</span>
          <input
            className="field-input"
            type="number"
            min="0"
            step="0.1"
            value={formState.fat_g}
            onChange={(event) => updateField('fat_g', Number(event.target.value))}
            required
          />
        </label>
      </div>

      {error ? <p className="status-message status-error">{error}</p> : null}

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving meal...' : 'Add meal'}
      </button>
    </form>
  )
}

export default MealForm
