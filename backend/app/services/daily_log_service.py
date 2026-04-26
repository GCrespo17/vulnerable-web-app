from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session

from app.database.models import DailyLog, TrainerAssignment, User
from app.models.daily_logs import DailyLogCreate


def list_daily_logs(db: Session, current_user: User) -> list[DailyLog]:
    query: Select[tuple[DailyLog]] = select(DailyLog)

    if current_user.role == "admin":
        pass
    elif current_user.role == "trainer":
        assigned_member_ids = select(TrainerAssignment.member_id).where(
            TrainerAssignment.trainer_id == current_user.id
        )
        query = query.where(
            or_(
                DailyLog.user_id == current_user.id,
                DailyLog.visibility == "public",
                DailyLog.user_id.in_(assigned_member_ids),
            )
        )
    else:
        query = query.where(
            or_(
                DailyLog.user_id == current_user.id,
                DailyLog.visibility == "public",
            )
        )

    query = query.order_by(DailyLog.log_date.desc(), DailyLog.id.desc())
    return list(db.scalars(query).all())


def create_daily_log(
    db: Session, current_user: User, payload: DailyLogCreate
) -> DailyLog:
    daily_log = DailyLog(
        user_id=current_user.id,
        log_date=payload.log_date,
        mood=payload.mood,
        weight_kg=payload.weight_kg,
        notes=payload.notes,
        visibility=payload.visibility,
    )
    db.add(daily_log)
    db.commit()
    db.refresh(daily_log)
    return daily_log


def get_editable_daily_log(db: Session, current_user: User, log_id: int) -> DailyLog:
    daily_log = db.get(DailyLog, log_id)
    if daily_log is None:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily log not found.",
        )

    if current_user.role == "admin":
        return daily_log

    if daily_log.user_id == current_user.id:
        return daily_log

    if current_user.role == "trainer":
        assignment = db.scalar(
            select(TrainerAssignment).where(
                TrainerAssignment.trainer_id == current_user.id,
                TrainerAssignment.member_id == daily_log.user_id,
            )
        )
        if assignment is not None:
            return daily_log

    from fastapi import HTTPException, status

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You cannot modify this daily log.",
    )
