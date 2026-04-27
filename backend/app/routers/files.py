from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.models.files import FileRecordResponse
from app.services.auth_service import get_current_user
from app.services.file_service import download_file_vulnerable, list_file_records


router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("", response_model=list[FileRecordResponse])
def get_file_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[FileRecordResponse]:
    return list_file_records(db, current_user)


@router.get("/download")
def download_file(
    filename: str,
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    return download_file_vulnerable(filename, current_user)
