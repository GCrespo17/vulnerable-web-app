from pathlib import Path

from fastapi import HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import Select, and_, or_, select
from sqlalchemy.orm import Session

from app.database.models import DailyLog, FileRecord, TrainerAssignment, User


DEMO_UPLOADS_DIR = Path(__file__).resolve().parents[2] / "demo_uploads"
DEMO_PUBLIC_UPLOADS_DIR = DEMO_UPLOADS_DIR / "public"


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


def download_file_vulnerable(filename: str, current_user: User) -> FileResponse:
    current_user

    # Intentionally vulnerable for the academic lab: this trusts the user-controlled
    # filename and appends it directly to the download base path without safe checks.
    requested_path = DEMO_PUBLIC_UPLOADS_DIR / filename

    if not requested_path.exists() or not requested_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested file was not found.",
        )

    return FileResponse(path=requested_path, filename=requested_path.name)
