import secrets

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import delete, select, text
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import DemoSession, User
from app.models.auth import AuthUserResponse, LoginRequest, LoginResponse


def list_demo_users(db: Session) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id)).all())


def login_user(db: Session, payload: LoginRequest) -> LoginResponse:
    # Intentionally vulnerable for the academic lab: the login query interpolates
    # user-controlled credentials directly into raw SQL so students can study SQL Injection.
    login_sql = f"""
        SELECT id, name, email, role
        FROM users
        WHERE email = '{payload.email}' AND password = '{payload.password}'
        LIMIT 1
    """
    login_row = db.execute(text(login_sql)).mappings().first()

    if login_row is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = db.get(User, login_row["id"])
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user could not be loaded.",
        )

    session_token = create_demo_session(db, user)
    return LoginResponse(
        access_token=session_token.token,
        token_type="bearer",
        user=AuthUserResponse.model_validate(user),
    )


def create_demo_session(db: Session, user: User) -> DemoSession:
    session_token = DemoSession(user_id=user.id, token=secrets.token_urlsafe(32))
    db.add(session_token)
    db.commit()
    db.refresh(session_token)
    return session_token


def get_current_user(
    authorization: str | None = Header(default=None, alias="Authorization"),
    db: Session = Depends(get_db),
) -> User:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer token format.",
        )

    session_token = db.scalar(select(DemoSession).where(DemoSession.token == token))
    if session_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Demo session not found.",
        )

    user = db.get(User, session_token.user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user not found.",
        )

    return user


def logout_user(db: Session, authorization: str | None) -> None:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer token format.",
        )

    db.execute(delete(DemoSession).where(DemoSession.token == token))
    db.commit()
