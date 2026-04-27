from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.database.database import Base, SessionLocal, engine
from app.database import models
from app.services.seed_service import create_demo_upload_files, seed_demo_data


def init_database() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_database_schema()
    create_demo_upload_files()

    with SessionLocal() as session:
        seed_demo_data(session)


def seed_database(session: Session) -> None:
    create_demo_upload_files()
    seed_demo_data(session)


def ensure_database_schema() -> None:
    inspector = inspect(engine)
    user_columns = {column["name"] for column in inspector.get_columns("users")}

    if "password" not in user_columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN password VARCHAR(255)")
            )
