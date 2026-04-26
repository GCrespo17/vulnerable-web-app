from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.models.meals import MealEntryCreate, MealEntryResponse
from app.services.auth_service import get_current_user
from app.services.meal_service import create_meal_entry


router = APIRouter(tags=["meals"])


@router.post(
    "/api/daily-logs/{log_id}/meals",
    response_model=MealEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def post_meal_entry(
    log_id: int,
    payload: MealEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MealEntryResponse:
    return create_meal_entry(db, current_user, log_id, payload)
