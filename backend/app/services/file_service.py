from sqlalchemy import Select, and_, or_, select
from sqlalchemy.orm import Session

from app.database.models import DailyLog, FileRecord, TrainerAssignment, User


def list_file_records(db: Session, current_user: User) -> list[FileRecord]:
    query: Select[tuple[FileRecord]] = select(FileRecord).outerjoin(
        DailyLog,
        FileRecord.daily_log_id == DailyLog.id,
    )

    shared_file_filter = or_(
        and_(
            FileRecord.daily_log_id.is_(None),
            FileRecord.stored_name == "public_workout_template.txt",
        ),
        DailyLog.visibility == "public",
    )

    if current_user.role == "admin":
        pass
    elif current_user.role == "trainer":
        assigned_member_ids = select(TrainerAssignment.member_id).where(
            TrainerAssignment.trainer_id == current_user.id
        )
        query = query.where(
            or_(
                FileRecord.user_id == current_user.id,
                shared_file_filter,
                FileRecord.user_id.in_(assigned_member_ids),
            )
        )
    else:
        query = query.where(
            or_(
                FileRecord.user_id == current_user.id,
                shared_file_filter,
            )
        )

    query = query.order_by(FileRecord.created_at.desc(), FileRecord.id.desc())
    return list(db.scalars(query).unique().all())
