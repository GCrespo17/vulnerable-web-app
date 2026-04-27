from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class DailyLogCreate(BaseModel):
    log_date: date
    mood: str
    weight_kg: float
    notes: str
    visibility: str


class DailyLogResponse(BaseModel):
    id: int
    user_id: int
    log_date: date
    mood: str
    weight_kg: float
    notes: str
    visibility: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DailyLogWorkoutResult(BaseModel):
    id: int
    exercise_name: str
    sets: int
    reps: int
    duration_minutes: int
    calories_burned: int
    notes: str

    model_config = ConfigDict(from_attributes=True)


class DailyLogMealResult(BaseModel):
    id: int
    meal_name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    notes: str

    model_config = ConfigDict(from_attributes=True)


class DailyLogDetailResponse(BaseModel):
    id: int
    user_id: int
    log_date: date
    mood: str
    weight_kg: float
    notes: str
    visibility: str
    created_at: datetime
    workouts: list[DailyLogWorkoutResult]
    meals: list[DailyLogMealResult]

    model_config = ConfigDict(from_attributes=True)
