from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.auth import (
    AuthUserResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
)
from app.database.models import User
from app.services.auth_service import get_current_user, login_user, logout_user


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def post_login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    return login_user(db, payload)


@router.get("/me", response_model=AuthUserResponse)
def get_me(current_user: User = Depends(get_current_user)) -> AuthUserResponse:
    return AuthUserResponse.model_validate(current_user)


@router.post("/logout", response_model=LogoutResponse, status_code=status.HTTP_200_OK)
def post_logout(
    authorization: str | None = Header(default=None, alias="Authorization"),
    db: Session = Depends(get_db),
) -> LogoutResponse:
    logout_user(db, authorization)
    return LogoutResponse(message="Logged out successfully.")
