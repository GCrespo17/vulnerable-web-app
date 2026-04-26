from __future__ import annotations

from datetime import date
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import (
    DailyLog,
    FileRecord,
    MealEntry,
    TrainerAssignment,
    User,
    WorkoutEntry,
)


DEMO_UPLOADS_DIR = Path(__file__).resolve().parents[2] / "demo_uploads"

DEMO_FILES = {
    "alice_progress_report.txt": "Alice Member progress report\nWeek: 2026-W17\nSteps average: 9,200\nCoach note: Keep the evening walks consistent.\n",
    "alice_meal_plan.txt": "Alice Member meal plan\nBreakfast: Greek yogurt and berries\nLunch: Chicken rice bowl\nDinner: Salmon with roasted vegetables\n",
    "bob_progress_report.txt": "Bob Member progress report\nWeek: 2026-W17\nStrength focus: Upper body endurance\nCoach note: Add one recovery day after circuit training.\n",
    "bob_cutting_plan.txt": "Bob Member cutting plan\nCalories target: 2100\nProtein target: 180g\nReminder: Hydrate before morning workouts.\n",
    "public_workout_template.txt": "FitTrackLab public workout template\n1. Warm-up for 10 minutes\n2. Pick 3 compound movements\n3. Log duration, reps, and notes\n",
    "private_lab_secret.txt": "FitTrackLab local lab note\nThis is fake classroom-only data for the directory traversal lab.\nRotation code: LAB-DEMO-0426\nDo not deploy this project publicly.\n",
}


def create_demo_upload_files() -> None:
    DEMO_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    for filename, content in DEMO_FILES.items():
        file_path = DEMO_UPLOADS_DIR / filename
        if not file_path.exists():
            file_path.write_text(content, encoding="utf-8")


def seed_demo_data(session: Session) -> None:
    users = _seed_users(session)
    daily_logs = _seed_daily_logs(session, users)
    _seed_workouts(session, daily_logs)
    _seed_meals(session, daily_logs)
    _seed_file_records(session, users, daily_logs)
    _seed_trainer_assignments(session, users)
    session.commit()


def _seed_users(session: Session) -> dict[str, User]:
    user_specs = [
        {"name": "Alice Member", "email": "alice@example.fit", "role": "member"},
        {"name": "Bob Member", "email": "bob@example.fit", "role": "member"},
        {"name": "Tina Trainer", "email": "trainer@example.fit", "role": "trainer"},
        {"name": "Admin User", "email": "admin@example.fit", "role": "admin"},
    ]

    users: dict[str, User] = {}
    for spec in user_specs:
        user = session.scalar(select(User).where(User.email == spec["email"]))
        if user is None:
            user = User(**spec)
            session.add(user)
            session.flush()
        users[spec["email"]] = user

    return users


def _seed_daily_logs(session: Session, users: dict[str, User]) -> dict[str, DailyLog]:
    log_specs = {
        "alice_private_strength": {
            "user": users["alice@example.fit"],
            "log_date": date(2026, 4, 20),
            "mood": "focused",
            "weight_kg": 64.2,
            "notes": "Completed a steady strength workout and tracked recovery carefully.",
            "visibility": "private",
        },
        "alice_public_cardio": {
            "user": users["alice@example.fit"],
            "log_date": date(2026, 4, 22),
            "mood": "energized",
            "weight_kg": 64.0,
            "notes": "Shared my interval run template for the class dashboard.",
            "visibility": "public",
        },
        "bob_private_cut": {
            "user": users["bob@example.fit"],
            "log_date": date(2026, 4, 21),
            "mood": "tired",
            "weight_kg": 82.5,
            "notes": "Adjusted calories slightly and kept notes on low-energy sets.",
            "visibility": "private",
        },
        "bob_public_cycle": {
            "user": users["bob@example.fit"],
            "log_date": date(2026, 4, 23),
            "mood": "steady",
            "weight_kg": 82.0,
            "notes": "Posted a public cycling day recap for the trainer review.",
            "visibility": "public",
        },
    }

    logs: dict[str, DailyLog] = {}
    for key, spec in log_specs.items():
        user = spec["user"]
        log = session.scalar(
            select(DailyLog).where(
                DailyLog.user_id == user.id,
                DailyLog.log_date == spec["log_date"],
                DailyLog.notes == spec["notes"],
            )
        )
        if log is None:
            log = DailyLog(
                user_id=user.id,
                log_date=spec["log_date"],
                mood=spec["mood"],
                weight_kg=spec["weight_kg"],
                notes=spec["notes"],
                visibility=spec["visibility"],
            )
            session.add(log)
            session.flush()
        logs[key] = log

    return logs


def _seed_workouts(session: Session, daily_logs: dict[str, DailyLog]) -> None:
    workout_specs = [
        {
            "daily_log": daily_logs["alice_private_strength"],
            "exercise_name": "Barbell Squat",
            "sets": 4,
            "reps": 6,
            "duration_minutes": 35,
            "calories_burned": 260,
            "notes": "Worked at moderate intensity with full depth.",
        },
        {
            "daily_log": daily_logs["alice_public_cardio"],
            "exercise_name": "Track Intervals",
            "sets": 6,
            "reps": 400,
            "duration_minutes": 30,
            "calories_burned": 310,
            "notes": "Alternated fast laps with easy recovery laps.",
        },
        {
            "daily_log": daily_logs["bob_private_cut"],
            "exercise_name": "Dumbbell Bench Press",
            "sets": 4,
            "reps": 10,
            "duration_minutes": 28,
            "calories_burned": 220,
            "notes": "Reduced rest time to keep the session moving.",
        },
        {
            "daily_log": daily_logs["bob_public_cycle"],
            "exercise_name": "Stationary Bike",
            "sets": 1,
            "reps": 1,
            "duration_minutes": 45,
            "calories_burned": 400,
            "notes": "Maintained a steady aerobic pace for the full ride.",
        },
    ]

    for spec in workout_specs:
        daily_log = spec["daily_log"]
        workout = session.scalar(
            select(WorkoutEntry).where(
                WorkoutEntry.daily_log_id == daily_log.id,
                WorkoutEntry.exercise_name == spec["exercise_name"],
                WorkoutEntry.notes == spec["notes"],
            )
        )
        if workout is None:
            session.add(
                WorkoutEntry(
                    daily_log_id=daily_log.id,
                    exercise_name=spec["exercise_name"],
                    sets=spec["sets"],
                    reps=spec["reps"],
                    duration_minutes=spec["duration_minutes"],
                    calories_burned=spec["calories_burned"],
                    notes=spec["notes"],
                )
            )


def _seed_meals(session: Session, daily_logs: dict[str, DailyLog]) -> None:
    meal_specs = [
        {
            "daily_log": daily_logs["alice_private_strength"],
            "meal_name": "Protein Oats",
            "calories": 420,
            "protein_g": 32.0,
            "carbs_g": 48.0,
            "fat_g": 11.0,
            "notes": "Pre-workout breakfast with fruit and whey.",
        },
        {
            "daily_log": daily_logs["alice_public_cardio"],
            "meal_name": "Turkey Wrap",
            "calories": 530,
            "protein_g": 36.0,
            "carbs_g": 44.0,
            "fat_g": 18.0,
            "notes": "Packed lunch after track intervals.",
        },
        {
            "daily_log": daily_logs["bob_private_cut"],
            "meal_name": "Chicken Salad",
            "calories": 460,
            "protein_g": 41.0,
            "carbs_g": 18.0,
            "fat_g": 21.0,
            "notes": "High-protein lunch during the cut phase.",
        },
        {
            "daily_log": daily_logs["bob_public_cycle"],
            "meal_name": "Rice Bowl",
            "calories": 610,
            "protein_g": 38.0,
            "carbs_g": 72.0,
            "fat_g": 16.0,
            "notes": "Recovery meal after the long cycling session.",
        },
    ]

    for spec in meal_specs:
        daily_log = spec["daily_log"]
        meal = session.scalar(
            select(MealEntry).where(
                MealEntry.daily_log_id == daily_log.id,
                MealEntry.meal_name == spec["meal_name"],
                MealEntry.notes == spec["notes"],
            )
        )
        if meal is None:
            session.add(
                MealEntry(
                    daily_log_id=daily_log.id,
                    meal_name=spec["meal_name"],
                    calories=spec["calories"],
                    protein_g=spec["protein_g"],
                    carbs_g=spec["carbs_g"],
                    fat_g=spec["fat_g"],
                    notes=spec["notes"],
                )
            )


def _seed_file_records(
    session: Session,
    users: dict[str, User],
    daily_logs: dict[str, DailyLog],
) -> None:
    file_specs = [
        {
            "user": users["alice@example.fit"],
            "daily_log": daily_logs["alice_private_strength"],
            "original_name": "alice_progress_report.txt",
            "stored_name": "alice_progress_report.txt",
            "relative_path": "demo_uploads/alice_progress_report.txt",
            "content_type": "text/plain",
        },
        {
            "user": users["alice@example.fit"],
            "daily_log": daily_logs["alice_public_cardio"],
            "original_name": "alice_meal_plan.txt",
            "stored_name": "alice_meal_plan.txt",
            "relative_path": "demo_uploads/alice_meal_plan.txt",
            "content_type": "text/plain",
        },
        {
            "user": users["bob@example.fit"],
            "daily_log": daily_logs["bob_private_cut"],
            "original_name": "bob_progress_report.txt",
            "stored_name": "bob_progress_report.txt",
            "relative_path": "demo_uploads/bob_progress_report.txt",
            "content_type": "text/plain",
        },
        {
            "user": users["bob@example.fit"],
            "daily_log": daily_logs["bob_public_cycle"],
            "original_name": "bob_cutting_plan.txt",
            "stored_name": "bob_cutting_plan.txt",
            "relative_path": "demo_uploads/bob_cutting_plan.txt",
            "content_type": "text/plain",
        },
        {
            "user": users["admin@example.fit"],
            "daily_log": None,
            "original_name": "public_workout_template.txt",
            "stored_name": "public_workout_template.txt",
            "relative_path": "demo_uploads/public_workout_template.txt",
            "content_type": "text/plain",
        },
        {
            "user": users["admin@example.fit"],
            "daily_log": None,
            "original_name": "private_lab_secret.txt",
            "stored_name": "private_lab_secret.txt",
            "relative_path": "demo_uploads/private_lab_secret.txt",
            "content_type": "text/plain",
        },
    ]

    for spec in file_specs:
        user = spec["user"]
        daily_log = spec["daily_log"]
        file_record = session.scalar(
            select(FileRecord).where(
                FileRecord.user_id == user.id,
                FileRecord.stored_name == spec["stored_name"],
            )
        )
        if file_record is None:
            session.add(
                FileRecord(
                    user_id=user.id,
                    daily_log_id=daily_log.id if daily_log is not None else None,
                    original_name=spec["original_name"],
                    stored_name=spec["stored_name"],
                    relative_path=spec["relative_path"],
                    content_type=spec["content_type"],
                )
            )


def _seed_trainer_assignments(session: Session, users: dict[str, User]) -> None:
    trainer = users["trainer@example.fit"]
    member = users["alice@example.fit"]

    assignment = session.scalar(
        select(TrainerAssignment).where(
            TrainerAssignment.trainer_id == trainer.id,
            TrainerAssignment.member_id == member.id,
        )
    )
    if assignment is None:
        session.add(
            TrainerAssignment(
                trainer_id=trainer.id,
                member_id=member.id,
            )
        )
