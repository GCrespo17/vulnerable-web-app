from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileRecordResponse(BaseModel):
    id: int
    user_id: int
    daily_log_id: int | None
    original_name: str
    stored_name: str
    relative_path: str
    content_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
