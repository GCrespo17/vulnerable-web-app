from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)

    daily_logs: Mapped[list[DailyLog]] = relationship(back_populates="user")
    file_records: Mapped[list[FileRecord]] = relationship(back_populates="user")
    trainer_memberships: Mapped[list[TrainerAssignment]] = relationship(
        back_populates="trainer",
        foreign_keys="TrainerAssignment.trainer_id",
    )
    member_assignments: Mapped[list[TrainerAssignment]] = relationship(
        back_populates="member",
        foreign_keys="TrainerAssignment.member_id",
    )


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    mood: Mapped[str] = mapped_column(String(50), nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)
    visibility: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="daily_logs")
    workouts: Mapped[list[WorkoutEntry]] = relationship(back_populates="daily_log")
    meals: Mapped[list[MealEntry]] = relationship(back_populates="daily_log")
    file_records: Mapped[list[FileRecord]] = relationship(back_populates="daily_log")


class WorkoutEntry(Base):
    __tablename__ = "workout_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_log_id: Mapped[int] = mapped_column(
        ForeignKey("daily_logs.id"),
        nullable=False,
    )
    exercise_name: Mapped[str] = mapped_column(String(255), nullable=False)
    sets: Mapped[int] = mapped_column(Integer, nullable=False)
    reps: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    calories_burned: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)

    daily_log: Mapped[DailyLog] = relationship(back_populates="workouts")


class MealEntry(Base):
    __tablename__ = "meal_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_log_id: Mapped[int] = mapped_column(
        ForeignKey("daily_logs.id"),
        nullable=False,
    )
    meal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    calories: Mapped[int] = mapped_column(Integer, nullable=False)
    protein_g: Mapped[float] = mapped_column(Float, nullable=False)
    carbs_g: Mapped[float] = mapped_column(Float, nullable=False)
    fat_g: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)

    daily_log: Mapped[DailyLog] = relationship(back_populates="meals")


class FileRecord(Base):
    __tablename__ = "file_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    daily_log_id: Mapped[int | None] = mapped_column(
        ForeignKey("daily_logs.id"),
        nullable=True,
    )
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_name: Mapped[str] = mapped_column(String(255), nullable=False)
    relative_path: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="file_records")
    daily_log: Mapped[DailyLog | None] = relationship(back_populates="file_records")


class TrainerAssignment(Base):
    __tablename__ = "trainer_assignments"

    id: Mapped[int] = mapped_column(primary_key=True)
    trainer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    member_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    trainer: Mapped[User] = relationship(
        back_populates="trainer_memberships",
        foreign_keys=[trainer_id],
    )
    member: Mapped[User] = relationship(
        back_populates="member_assignments",
        foreign_keys=[member_id],
    )
