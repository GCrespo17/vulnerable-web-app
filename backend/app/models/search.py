from datetime import date, datetime

from pydantic import BaseModel


class SearchDailyLogResult(BaseModel):
    id: int
    user_id: int
    log_date: date
    notes: str
    visibility: str
    created_at: datetime


class SearchWorkoutResult(BaseModel):
    id: int
    daily_log_id: int
    exercise_name: str
    notes: str


class SearchMealResult(BaseModel):
    id: int
    daily_log_id: int
    meal_name: str
    notes: str


class SearchResponse(BaseModel):
    query: str
    daily_logs: list[SearchDailyLogResult]
    workouts: list[SearchWorkoutResult]
    meals: list[SearchMealResult]
