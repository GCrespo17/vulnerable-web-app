from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.models import User
from app.models.search import (
    SearchDailyLogResult,
    SearchMealResult,
    SearchResponse,
    SearchWorkoutResult,
)


def search_records(db: Session, query: str, current_user: User) -> SearchResponse:
    current_user  # Search stays authenticated, but the vulnerable SQL ignores visibility rules.

    #Injectable Query with string interpolation
    daily_logs_sql = f"""
        SELECT id, user_id, log_date, notes, visibility, created_at
        FROM daily_logs
        WHERE LOWER(notes) LIKE LOWER('%{query}%')
        ORDER BY created_at DESC, id DESC
    """
    workouts_sql = f"""
        SELECT id, daily_log_id, exercise_name, notes
        FROM workout_entries
        WHERE LOWER(exercise_name) LIKE LOWER('%{query}%')
           OR LOWER(notes) LIKE LOWER('%{query}%')
        ORDER BY id DESC
    """
    meals_sql = f"""
        SELECT id, daily_log_id, meal_name, notes
        FROM meal_entries
        WHERE LOWER(meal_name) LIKE LOWER('%{query}%')
           OR LOWER(notes) LIKE LOWER('%{query}%')
        ORDER BY id DESC
    """

    daily_log_rows = db.execute(text(daily_logs_sql)).mappings().all()
    workout_rows = db.execute(text(workouts_sql)).mappings().all()
    meal_rows = db.execute(text(meals_sql)).mappings().all()

    return SearchResponse(
        query=query,
        daily_logs=[SearchDailyLogResult(**row) for row in daily_log_rows],
        workouts=[SearchWorkoutResult(**row) for row in workout_rows],
        meals=[SearchMealResult(**row) for row in meal_rows],
    )
