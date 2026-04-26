from sqlalchemy.orm import Session

from app.database.models import User, WorkoutEntry
from app.models.workouts import WorkoutEntryCreate
from app.services.daily_log_service import get_editable_daily_log


def create_workout_entry(
    db: Session,
    current_user: User,
    log_id: int,
    payload: WorkoutEntryCreate,
) -> WorkoutEntry:
    daily_log = get_editable_daily_log(db, current_user, log_id)
    workout = WorkoutEntry(
        daily_log_id=daily_log.id,
        exercise_name=payload.exercise_name,
        sets=payload.sets,
        reps=payload.reps,
        duration_minutes=payload.duration_minutes,
        calories_burned=payload.calories_burned,
        notes=payload.notes,
    )
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout
