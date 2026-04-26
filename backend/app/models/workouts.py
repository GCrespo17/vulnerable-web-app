from pydantic import BaseModel, ConfigDict


class WorkoutEntryCreate(BaseModel):
    exercise_name: str
    sets: int
    reps: int
    duration_minutes: int
    calories_burned: int
    notes: str


class WorkoutEntryResponse(BaseModel):
    id: int
    daily_log_id: int
    exercise_name: str
    sets: int
    reps: int
    duration_minutes: int
    calories_burned: int
    notes: str

    model_config = ConfigDict(from_attributes=True)
