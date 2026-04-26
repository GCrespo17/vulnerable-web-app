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
