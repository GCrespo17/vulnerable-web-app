from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.models.daily_logs import (
    DailyLogCreate,
    DailyLogDetailResponse,
    DailyLogResponse,
)
from app.services.auth_service import get_current_user
from app.services.daily_log_service import (
    create_daily_log,
    get_daily_log_by_id_vulnerable,
    list_daily_logs,
)


router = APIRouter(prefix="/api/daily-logs", tags=["daily-logs"])


@router.get("", response_model=list[DailyLogResponse])
def get_daily_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[DailyLogResponse]:
    return list_daily_logs(db, current_user)


@router.get("/{log_id}", response_model=DailyLogDetailResponse)
def get_daily_log_by_id(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DailyLogDetailResponse:
    current_user
    return get_daily_log_by_id_vulnerable(db, log_id)


@router.post("", response_model=DailyLogResponse, status_code=status.HTTP_201_CREATED)
def post_daily_log(
    payload: DailyLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DailyLogResponse:
    return create_daily_log(db, current_user, payload)
