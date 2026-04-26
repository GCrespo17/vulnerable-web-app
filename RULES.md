# RULES.md

## Purpose

This repository is an academic cybersecurity lab.

The application is a fitness tracker called `FitTrackLab`.

It is intentionally vulnerable and designed only for local academic cybersecurity training.

The project demonstrates three vulnerabilities:

1. SQL Injection
2. IDOR
3. Directory Traversal

The app must provide the vulnerable features so one team can attack them and another team can later defend them.

Do not implement the fixes yet.

---

## Main Rule

Build the vulnerable application only.

Do not create fixed endpoints.

Do not implement the secure solutions.

Do not add `/api/fixed/...` routes.

Do not add automatic protections that prevent the required vulnerabilities from working.

---

## General Rules

1. The app must run locally.
2. The app must not be deployed publicly.
3. Vulnerable code must be clearly marked.
4. The app must be safe for classroom use.
5. The app must not target third-party systems.
6. The app must not include destructive payloads.
7. The app must not expose real system files.
8. The app must use fake demo fitness data only.
9. The app must not store real health or nutrition data.
10. Documentation may include defense hints, but not complete fixed code.

---

## Tech Stack Rules

### Backend

Use:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Uvicorn
- uv

### Frontend

Use:

- React
- Vite
- TypeScript
- React Router
- Fetch or Axios

### Development Environment

Use:

- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container

---

## Python Dependency Rules

Use `uv` for backend dependency management.

The backend must include:

- pyproject.toml
- uv.lock

Do not create:

- requirements.txt

Do not use project instructions based on:

- pip install
- pip install -r requirements.txt
- manual virtualenv dependency installation

Use uv commands instead:

- uv sync
- uv run uvicorn app.main:app --reload
- uv run pytest
- uv add package-name
- uv remove package-name
- uv lock

The backend Dockerfile must install and use dependencies through uv.

---

## Application Rules

The app must simulate a basic fitness tracker.

Users should be able to:

- Select a demo user.
- Create a daily fitness log.
- Add workouts.
- Add meals and calories.
- View daily logs.
- Download fitness-related demo files.
- Use the vulnerable features manually.

The app should feel like a normal web application, not only an API lab.

---

## Demo Users

Seed the database with at least these users.

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

## Authentication Rules

Use simple demo authentication.

Preferred behavior:

- The frontend has a demo user selector.
- The frontend sends the selected user ID using the `X-Demo-User-Id` header.
- The backend resolves the current user from this header.

Do not implement production authentication.

---

## SQL Injection Rules

The SQL Injection feature must be available at:

GET /api/search?query=

The endpoint must intentionally build SQL unsafely.

Allowed vulnerable patterns:

- String concatenation in SQL.
- f-string SQL construction.
- Unsafe raw SQL.

The search should include:

- Workout exercise names.
- Workout notes.
- Meal names.
- Meal notes.
- Daily log notes.

The vulnerability should allow the query behavior to be manipulated.

Restrictions:

- Do not include destructive SQL examples.
- Do not drop tables.
- Do not delete records.
- Do not modify records through the SQL Injection demo.
- Focus on unauthorized visibility or filter bypass.

---

## IDOR Rules

The IDOR feature must be available at:

GET /api/daily-logs/{log_id}

The endpoint must intentionally fetch a daily fitness log by ID without checking ownership or permissions.

Expected vulnerable behavior:

- Alice can access Bob's private daily log by changing the ID.
- Bob can access Alice's private daily log by changing the ID.
- The backend returns the object if it exists.

Do not add backend authorization checks to this endpoint.

Do not hide the vulnerability only with frontend UI restrictions.

---

## Directory Traversal Rules

The Directory Traversal feature must be available at:

GET /api/files/download?filename=

The endpoint must intentionally trust a user-controlled filename.

The endpoint should use unsafe path handling.

The demo must stay inside a controlled local file area.

Use:

backend/demo_uploads/

Example files:

- alice_progress_report.txt
- alice_meal_plan.txt
- bob_progress_report.txt
- bob_cutting_plan.txt
- public_workout_template.txt
- private_lab_secret.txt

The file `private_lab_secret.txt` must be fake local lab data only.

Restrictions:

- Do not expose real host files.
- Do not use `/etc/passwd`.
- Do not use SSH keys.
- Do not use real `.env` files.
- Do not use browser cookies.
- Do not use personal files.
- Do not read files outside the controlled demo area.

---

## Database Rules

Seed data must be deterministic.

The demo must include:

- At least 4 users.
- At least 4 daily logs.
- At least 4 workout entries.
- At least 4 meal entries.
- At least 4 file records.
- At least one private log for Alice.
- At least one private log for Bob.
- At least one public log.
- At least one trainer assignment.
- At least one fake sensitive lab file for the Directory Traversal demonstration.

---

## Backend Folder Rules

Use this backend structure or something very close:

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

---

## Naming Rules

Use `app/db/models.py` for SQLAlchemy database models.

Use `app/models/` for Pydantic request and response models.

Do not place SQLAlchemy models inside `app/models/`.

Do not place Pydantic models inside `app/db/models.py`.

This naming convention is intentional.

---

## Services Rules

Use `app/services/` for reusable business logic.

Routers should stay thin.

Routers should handle:

- HTTP request parsing
- Dependency injection
- Response formatting
- Status codes

Services should handle:

- Demo authentication logic
- Daily log creation and lookup
- Meal creation and lookup
- Workout creation and lookup
- File listing
- Vulnerable file download logic
- Vulnerable search logic
- Seed data helpers

The intentionally vulnerable logic should live in services when appropriate.

Required vulnerability locations:

- `app/services/search_service.py` should contain the intentionally unsafe SQL construction for SQL Injection.
- `app/services/daily_log_service.py` should contain the intentionally missing authorization check for IDOR.
- `app/services/file_service.py` should contain the intentionally unsafe filename and path handling for Directory Traversal.

Do not accidentally fix these vulnerabilities in the service layer.

---

## Required Models

Use SQLAlchemy database models similar to these.

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

## Frontend Rules

The frontend must:

1. Be simple and readable.
2. Use React with Vite.
3. Use TypeScript.
4. Provide a demo user selector.
5. Provide a dashboard page.
6. Provide a tracker page.
7. Provide one lab page per vulnerability.
8. Show API responses in a readable way.
9. Include short explanations for students.
10. Make the vulnerabilities easy to test manually.

The frontend must not:

- Automate attacks against external targets.
- Encourage real-world misuse.
- Include stealth behavior.
- Include persistence behavior.
- Store real health information.
- Include finished fixes.

---

## Backend Rules

The backend must:

1. Use FastAPI.
2. Use PostgreSQL.
3. Use SQLAlchemy.
4. Use uv for dependency management.
5. Include `pyproject.toml`.
6. Include `uv.lock`.
7. Not include `requirements.txt`.
8. Include seed data.
9. Include CORS for the local frontend.
10. Keep vulnerable code easy to find.
11. Use clear status codes.
12. Return consistent JSON responses.
13. Create fake demo upload files automatically if they do not exist.

The backend must not:

- Implement fixed versions of the vulnerabilities.
- Add `/api/fixed/...` endpoints.
- Prevent the required vulnerabilities from being demonstrated.

---

## Documentation Rules

The repository must include:

- README.md
- docs/SECURITY_LAB.md
- docs/SQL_INJECTION.md
- docs/IDOR.md
- docs/DIRECTORY_TRAVERSAL.md
- docs/DEFENSE_ASSIGNMENT.md

Each vulnerability document must explain:

1. What the vulnerability is.
2. Where it appears in this app.
3. Why the vulnerable code is unsafe.
4. How to demonstrate it safely.
5. What the attacker is trying to achieve.
6. What the impact is.
7. High-level hints for how defenders could fix it later.

Do not include complete fixed code.

The README must document uv commands, not pip commands.

---

## Testing Rules

Basic backend tests are allowed.

Tests should verify:

- The app starts.
- Seed data exists.
- The vulnerable search endpoint exists.
- The vulnerable daily log endpoint exists.
- The vulnerable file download endpoint exists.
- Demo files exist.

Tests may also verify the vulnerable behavior, but must stay safe and local.

Tests must not read real host files.

Tests must not depend on external systems.

Run tests with:

uv run pytest

---

## Security Disclaimer

This project is intentionally vulnerable and is designed only for local academic cybersecurity training.

Do not deploy it publicly.

Do not use it against systems you do not own or have explicit permission to test.

Do not store real health, fitness, nutrition, or personal data in this application.

---

## Definition of Done

The project is done when:

- The app starts with Docker Compose.
- PostgreSQL starts with Docker Compose.
- The database is seeded automatically.
- The backend uses uv.
- The backend has `pyproject.toml`.
- The backend has `uv.lock`.
- The backend does not have `requirements.txt`.
- The frontend works.
- The backend works.
- The tracker page allows basic demo log creation.
- The SQL Injection vulnerability is available.
- The IDOR vulnerability is available.
- The Directory Traversal vulnerability is available in the controlled demo area.
- Documentation is complete.
- No fixed endpoints are implemented.
- No real host files or external systems are required for the demo.
