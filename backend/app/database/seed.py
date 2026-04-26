from sqlalchemy.orm import Session

from app.database.database import Base, SessionLocal, engine
from app.database import models
from app.services.seed_service import create_demo_upload_files, seed_demo_data


def init_database() -> None:
    Base.metadata.create_all(bind=engine)
    create_demo_upload_files()

    with SessionLocal() as session:
        seed_demo_data(session)


def seed_database(session: Session) -> None:
    create_demo_upload_files()
    seed_demo_data(session)
