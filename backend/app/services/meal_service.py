from sqlalchemy.orm import Session

from app.database.models import MealEntry, User
from app.models.meals import MealEntryCreate
from app.services.daily_log_service import get_editable_daily_log


def create_meal_entry(
    db: Session,
    current_user: User,
    log_id: int,
    payload: MealEntryCreate,
) -> MealEntry:
    daily_log = get_editable_daily_log(db, current_user, log_id)
    meal = MealEntry(
        daily_log_id=daily_log.id,
        meal_name=payload.meal_name,
        calories=payload.calories,
        protein_g=payload.protein_g,
        carbs_g=payload.carbs_g,
        fat_g=payload.fat_g,
        notes=payload.notes,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal
