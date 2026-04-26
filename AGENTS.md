# AGENTS.md

## Project Overview

This repository contains an intentionally vulnerable academic web application for a cybersecurity class.

The application is a fitness tracker called `FitTrackLab`.

The app must include three intentionally vulnerable features:

1. SQL Injection
2. IDOR
3. Directory Traversal

The goal is that one team can attack these vulnerabilities and another team can later implement the fixes.

Do not implement the defensive solutions yet.

This project is for educational use only and must run locally.

---

## Important Scope

Build only the vulnerable web application.

Do not create fixed endpoints.

Do not implement the secure version of the vulnerabilities.

Do not add `/api/fixed/...` routes.

Do not add automatic mitigations that prevent the intended vulnerabilities from working.

The app should be intentionally vulnerable but still safe for a local classroom demo.

---

## Tech Stack

Use the following stack.

### Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Uvicorn
- Pytest, only for basic app behavior tests if useful
- uv for Python dependency management and command execution

### Frontend

- React
- Vite
- TypeScript
- React Router
- Fetch or Axios
- Basic CSS or Tailwind

### Development Environment

- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container

---

## Python Tooling

Use `uv` instead of manual `python`, `python3`, `pip`, or `requirements.txt` workflows.

The backend must use:

- `pyproject.toml`
- `uv.lock`
- uv-managed dependencies

Do not create `requirements.txt`.

Do not document setup using `pip install -r requirements.txt`.

Prefer uv commands such as:

- `uv sync`
- `uv run uvicorn app.main:app --reload`
- `uv run pytest`
- `uv add package-name`
- `uv remove package-name`

The backend Dockerfile should use uv to install dependencies.

---

## Application Theme

Build a simple fitness tracker named `FitTrackLab`.

The app should simulate a small fitness tracking platform where users can:

- Select a demo user.
- Create a daily fitness log.
- Record workouts completed today.
- Record meals and calories.
- View daily logs.
- Download fitness-related files.
- Use intentionally vulnerable features for the security lab.

The app should look like a normal fitness tracker, not just a collection of security endpoints.

---

## Required Demo Users

Seed the database with these users:

### Alice Member

- email: alice@example.fit
- role: member

### Bob Member

- email: bob@example.fit
- role: member

### Tina Trainer

- email: trainer@example.fit
- role: trainer

### Admin User

- email: admin@example.fit
- role: admin

---

## Authentication

Use simple demo authentication.

Preferred approach:

- The frontend provides a demo user selector.
- The frontend sends the selected user ID using the `X-Demo-User-Id` header.
- The backend resolves the current user from that header.

Do not implement production authentication.

This is a local academic lab.

---

## Required Vulnerabilities

### 1. SQL Injection

Create this vulnerable endpoint:

GET /api/search?query=

The endpoint should search across:

- Workout exercise names
- Workout notes
- Meal names
- Meal notes
- Daily log notes

The endpoint must intentionally build SQL unsafely using string interpolation or concatenation.

The vulnerable behavior should allow attackers to manipulate the SQL query and retrieve data they should not normally see.

Do not include destructive SQL payloads.

The demo should focus on unauthorized data visibility or bypassing filters.

Do not implement the fix.

---

### 2. IDOR

Create this vulnerable endpoint:

GET /api/daily-logs/{log_id}

The endpoint should return a daily fitness log by ID.

It must intentionally skip authorization checks.

This means a user should be able to change the `log_id` and access another user's private daily log.

Example intended behavior:

- Alice can request Bob's private daily log if she knows or guesses the ID.
- The backend returns the log without checking ownership.

Do not implement the fix.

Do not add backend authorization checks for this endpoint.

---

### 3. Directory Traversal

Create this vulnerable endpoint:

GET /api/files/download?filename=

The endpoint should accept a user-controlled filename.

It must intentionally use unsafe path handling by trusting the `filename` query parameter.

The vulnerability should allow traversal inside the controlled local demo file area.

Do not expose real host files.

Do not use `/etc/passwd`, SSH keys, real `.env` files, browser cookies, or personal files.

Use only fake demo files inside the repository.

---

## Safe Demo File Area

Create fake demo files inside:

backend/demo_uploads/

Example files:

- alice_progress_report.txt
- alice_meal_plan.txt
- bob_progress_report.txt
- bob_cutting_plan.txt
- public_workout_template.txt
- private_lab_secret.txt

The file `private_lab_secret.txt` must be fake local lab data only.

Do not use real secrets.

Do not read files outside the controlled demo area.

---

## Required Routes

Use these routes or very similar ones.

### Auth and demo users

GET /api/auth/users

### Normal tracker features

GET /api/daily-logs

POST /api/daily-logs

POST /api/daily-logs/{log_id}/workouts

POST /api/daily-logs/{log_id}/meals

GET /api/files

### Vulnerable features

GET /api/search?query=

GET /api/daily-logs/{log_id}

GET /api/files/download?filename=

Do not create fixed versions of these routes.

---

## Naming Convention

Use `app/db/models.py` for SQLAlchemy database models.

Use `app/models/` for Pydantic request and response models.

Do not place SQLAlchemy models inside `app/models/`.

Do not place Pydantic models inside `app/db/models.py`.

This naming convention is intentional for this project.

---

## Database Models

Create SQLAlchemy models in `app/db/models.py`.

Use models similar to the following.

### User

- id
- name
- email
- role

### DailyLog

- id
- user_id
- log_date
- mood
- weight_kg
- notes
- visibility
- created_at

### WorkoutEntry

- id
- daily_log_id
- exercise_name
- sets
- reps
- duration_minutes
- calories_burned
- notes

### MealEntry

- id
- daily_log_id
- meal_name
- calories
- protein_g
- carbs_g
- fat_g
- notes

### FileRecord

- id
- user_id
- daily_log_id
- original_name
- stored_name
- relative_path
- content_type
- created_at

### TrainerAssignment

- id
- trainer_id
- member_id

---

## Pydantic Models

Create Pydantic request and response models inside `app/models/`.

Use files similar to:

- app/models/auth.py
- app/models/daily_logs.py
- app/models/meals.py
- app/models/workouts.py
- app/models/search.py
- app/models/files.py

These files should define request and response shapes only.

Do not put database connection logic or SQLAlchemy models in `app/models/`.

---

## Services Layer

Use a `services/` folder inside `app/` for business logic.

Routers should be thin. They should handle HTTP concerns such as:

- Request parsing
- Response formatting
- Dependencies
- Status codes

Services should contain reusable application logic, including:

- Demo authentication logic
- Daily log creation and lookup
- Meal creation and lookup
- Workout creation and lookup
- File listing and vulnerable file download logic
- Vulnerable search logic
- Seed and demo data creation helpers

Keep the required vulnerabilities in the service layer when appropriate, but make them easy to find and clearly commented.

Do not accidentally fix the vulnerabilities in the service layer.

In particular:

- `search_service.py` should contain the intentionally unsafe SQL construction for SQL Injection.
- `daily_log_service.py` should contain the intentionally missing authorization check for IDOR.
- `file_service.py` should contain the intentionally unsafe filename and path handling for Directory Traversal.

Recommended service files:

- app/services/auth_service.py
- app/services/daily_log_service.py
- app/services/meal_service.py
- app/services/workout_service.py
- app/services/file_service.py
- app/services/search_service.py
- app/services/seed_service.py

---

## Project Structure

Use this structure or something very close:

    backend/
      app/
        main.py
        core/
          config.py
          security.py
        database/
          database.py
          models.py
          seed.py
        models/
          auth.py
          daily_logs.py
          meals.py
          workouts.py
          search.py
          files.py
        services/
          auth_service.py
          daily_log_service.py
          meal_service.py
          workout_service.py
          file_service.py
          search_service.py
          seed_service.py
        routers/
          auth.py
          daily_logs.py
          meals.py
          workouts.py
          files.py
          search.py
      tests/
        test_basic_app.py
        test_vulnerable_behavior.py
      pyproject.toml
      uv.lock
      Dockerfile

    frontend/
      src/
        api/
          client.ts
        components/
          UserSelector.tsx
          ResponseViewer.tsx
          VulnerabilityCard.tsx
        pages/
          LoginPage.tsx
          DashboardPage.tsx
          TrackerPage.tsx
          SearchLabPage.tsx
          DailyLogsLabPage.tsx
          FilesLabPage.tsx
        App.tsx
        main.tsx
      package.json
      Dockerfile

    docs/
      SECURITY_LAB.md
      SQL_INJECTION.md
      IDOR.md
      DIRECTORY_TRAVERSAL.md
      DEFENSE_ASSIGNMENT.md

    README.md
    docker-compose.yml
    AGENTS.md
    RULES.md
    .gitignore
    .env.example

---

## Frontend Requirements

Create a simple React UI with:

1. Demo user selector.
2. Dashboard page.
3. Tracker page where a user can add daily logs, workouts, and meals.
4. SQL Injection lab page.
5. IDOR lab page.
6. Directory Traversal lab page.
7. API response viewer.
8. Short educational explanations.

The frontend should make the vulnerable features easy to test manually.

The frontend should not include the fixes.

The frontend should not hide the vulnerabilities.

---

## Backend Requirements

- Use FastAPI routers.
- Use SQLAlchemy.
- Use PostgreSQL.
- Use uv for backend dependency management.
- Use `pyproject.toml` instead of `requirements.txt`.
- Seed the database with demo users, logs, workouts, meals, trainer assignments, and file records.
- Create demo upload files automatically if they do not exist.
- Configure CORS for the React frontend.
- Use environment variables.
- Return consistent JSON responses.
- Keep the vulnerable code easy to find and understand.

---

## Documentation Requirements

Create:

- README.md
- docs/SECURITY_LAB.md
- docs/SQL_INJECTION.md
- docs/IDOR.md
- docs/DIRECTORY_TRAVERSAL.md
- docs/DEFENSE_ASSIGNMENT.md

Each vulnerability document should include:

- What the vulnerability is.
- Where it exists in this app.
- Why the vulnerable code is unsafe.
- Safe local demonstration steps.
- Expected attacker goal.
- Impact.
- Hints for how defenders could fix it later.

Do not provide complete fixed code in the documentation.

---

## Safety Boundaries

This project is a local academic lab.

Do not:

- Add malware.
- Add persistence.
- Add credential theft.
- Add phishing.
- Add port scanning.
- Add network exploitation.
- Add payloads intended for third-party systems.
- Add destructive SQL payloads.
- Add instructions for attacking real applications.
- Add code that reads arbitrary host files outside the controlled demo directory.
- Store real health, fitness, nutrition, or personal data.

Do:

- Keep examples local and controlled.
- Keep demonstration steps minimal and educational.
- Make vulnerabilities easy to identify for the class.
- Include warnings that the app must not be deployed publicly.

---

## Development Commands

Prefer these commands.

### Docker

docker compose up --build

docker compose down -v

### Backend local commands

cd backend

uv sync

uv run uvicorn app.main:app --reload

uv run pytest

### Backend dependency commands

cd backend

uv add package-name

uv remove package-name

uv lock

### Frontend local commands

cd frontend

npm install

npm run dev

npm run build

---

## Code Quality Expectations

- Keep code simple and readable.
- Prefer explicitness over clever abstractions.
- Do not over-engineer authentication.
- Make vulnerable code easy to locate.
- Add comments only where they help explain the vulnerable behavior.
- Do not accidentally fix the required vulnerabilities.
- Keep routers thin.
- Put reusable business logic in services.
- Keep database models and Pydantic models separate.
- Keep the app small enough for an academic project.

---

## Completion Criteria

The task is complete when:

1. `docker compose up --build` starts the app.
2. The frontend can call the backend.
3. PostgreSQL is seeded with demo users, daily logs, workouts, meals, trainer assignments, and files.
4. The backend uses `pyproject.toml` and `uv.lock`.
5. There is no `requirements.txt`.
6. The SQL Injection vulnerability exists and is testable.
7. The IDOR vulnerability exists and is testable.
8. The Directory Traversal vulnerability exists and is testable in the controlled demo area.
9. README explains how to run the project using uv and Docker Compose.
10. Documentation explains how each vulnerability works.
11. No fixed endpoints are implemented.
12. No real host files or external systems are required for the demo.
