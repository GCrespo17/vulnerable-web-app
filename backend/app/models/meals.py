from pydantic import BaseModel, ConfigDict


class MealEntryCreate(BaseModel):
    meal_name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    notes: str


class MealEntryResponse(BaseModel):
    id: int
    daily_log_id: int
    meal_name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    notes: str

    model_config = ConfigDict(from_attributes=True)
