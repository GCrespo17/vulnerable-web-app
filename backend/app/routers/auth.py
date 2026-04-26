from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.auth import DemoUserResponse
from app.services.auth_service import list_demo_users


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/users", response_model=list[DemoUserResponse])
def get_demo_users(db: Session = Depends(get_db)) -> list[DemoUserResponse]:
    return list_demo_users(db)
