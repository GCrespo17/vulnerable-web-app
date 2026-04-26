from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.models.workouts import WorkoutEntryCreate, WorkoutEntryResponse
from app.services.auth_service import get_current_user
from app.services.workout_service import create_workout_entry


router = APIRouter(tags=["workouts"])


@router.post(
    "/api/daily-logs/{log_id}/workouts",
    response_model=WorkoutEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def post_workout_entry(
    log_id: int,
    payload: WorkoutEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkoutEntryResponse:
    return create_workout_entry(db, current_user, log_id, payload)
