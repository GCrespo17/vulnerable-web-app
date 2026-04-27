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

This project is for educational use only and must run locally inside Docker containers.

---

## Important Scope

Build only the vulnerable web application.

Do not create fixed endpoints.

Do not implement the secure version of the vulnerabilities.

Do not add `/api/fixed/...` routes.

Do not add automatic mitigations that prevent the intended vulnerabilities from working.

The app should be intentionally vulnerable but still safe for a local classroom demo.

The vulnerabilities must be limited to the local lab environment.

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

- Log in with seeded local lab credentials.
- Create a daily fitness log.
- Record workouts completed today.
- Record meals and calories.
- View daily logs.
- Download fitness-related files.
- Use intentionally vulnerable features for the security lab.

The app should look like a normal fitness tracker, not just a collection of security endpoints.

The application must use a real login flow instead of a demo user selector.

---

## Required Seed Users

Seed the database with these users.

These are fake local lab users only.

### Alice Member

- email: alice@example.fit
- password: alice123
- role: member

### Bob Member

- email: bob@example.fit
- password: bob123
- role: member

### Tina Trainer

- email: trainer@example.fit
- password: trainer123
- role: trainer

### Admin User

- email: admin@example.fit
- password: admin123
- role: admin

Do not use real passwords.

Do not store real user data.

The seeded accounts are only for the local academic lab.

---

## Authentication

Use a real login flow for the demo application.

The frontend should provide a login form with:

- email
- password

The backend should provide:

POST /api/auth/login

The backend should return a simple demo access token or session token after successful login.

Authenticated frontend requests should use:

Authorization: Bearer <token>

The backend should resolve the current user from the token.

Keep authentication simple and understandable.

This is not production authentication.

The login endpoint must intentionally contain the SQL Injection vulnerability for the academic lab.

Do not use a demo user selector.

Do not use `X-Demo-User-Id` as the main authentication mechanism.

---

## Required Vulnerabilities

### 1. SQL Injection

Create this vulnerable login endpoint:

POST /api/auth/login

The login endpoint should accept:

- email
- password

The endpoint must intentionally build the authentication SQL query unsafely using string interpolation or concatenation.

The vulnerable behavior should allow an attacker to bypass authentication and log in as another seeded user, including the admin user, in the local lab environment.

The app may also include a vulnerable search endpoint:

GET /api/search?query=

If implemented, the search endpoint should search across:

- Workout exercise names
- Workout notes
- Meal names
- Meal notes
- Daily log notes

The login SQL Injection is required.

The search SQL Injection is optional.

Do not include destructive SQL payloads.

Do not implement the fix.

Do not use parameterized SQL for the vulnerable login endpoint.

Do not use SQLAlchemy ORM filtering for the vulnerable login endpoint.

---

### 2. IDOR

Create this vulnerable endpoint:

GET /api/daily-logs/{log_id}

The endpoint should return a daily fitness log by ID.

It must intentionally skip authorization checks.

This means a user should be able to change the `log_id` and access another user's private daily log.

Example intended behavior:

- Alice can request Bob's private daily log if she knows or guesses the ID.
- Bob can request Alice's private daily log if he knows or guesses the ID.
- The backend returns the log without checking ownership.

Do not implement the fix.

Do not add backend authorization checks for this endpoint.

Do not rely on the frontend to protect this endpoint.

---

### 3. Directory Traversal

Create this vulnerable endpoint:

GET /api/files/download?filename=

The endpoint should accept a user-controlled filename.

It must intentionally use unsafe path handling by trusting the `filename` query parameter.

The vulnerability should allow traversal outside the application project directory and into the backend Docker container filesystem.

This must only apply to the backend Docker container filesystem.

The vulnerability must not expose the host machine filesystem.

The Docker setup must not mount sensitive host paths into the backend container.

Do not mount:

- the host root filesystem
- the Docker socket
- SSH directories
- browser profile directories
- real secrets
- personal files

The container may include fake lab files outside the app directory so students can demonstrate traversal safely.

Example fake container-level lab files:

- /opt/fittrack-lab/container_note.txt
- /opt/fittrack-lab/fake_container_secret.txt

These files must contain fake lab data only.

Do not use real secrets.

Do not use real personal files.

Do not implement the fix.

---

## Demo File Areas

Use two types of demo files.

### Normal app upload files

Create fake app files inside:

backend/demo_uploads/

Example files:

- alice_progress_report.txt
- alice_meal_plan.txt
- bob_progress_report.txt
- bob_cutting_plan.txt
- public_workout_template.txt

These files are used by normal app functionality.

### Fake container-level lab files

Create fake lab files inside the backend Docker container outside the project directory.

Recommended container path:

/opt/fittrack-lab/

Example files:

- container_note.txt
- fake_container_secret.txt

These files are used only to demonstrate Directory Traversal inside the container filesystem.

They must contain fake local lab data only.

Do not include real secrets.

Do not expose host files.

Do not mount sensitive host directories into the container.

---

## Required Routes

Use these routes or very similar ones.

### Authentication

POST /api/auth/login

GET /api/auth/me

POST /api/auth/logout

### Normal tracker features

GET /api/daily-logs

POST /api/daily-logs

POST /api/daily-logs/{log_id}/workouts

POST /api/daily-logs/{log_id}/meals

GET /api/files

### Vulnerable features

POST /api/auth/login

GET /api/daily-logs/{log_id}

GET /api/files/download?filename=

### Optional vulnerable feature

GET /api/search?query=

Do not create fixed versions of these routes.

---

## Naming Convention

Use `app/database/models.py` for SQLAlchemy database models.

Use `app/models/` for Pydantic request and response models.

Do not place SQLAlchemy models inside `app/models/`.

Do not place Pydantic models inside `app/database/models.py`.

This naming convention is intentional for this project.

Do not create or use an `app/db/` folder.

---

## Database Models

Create SQLAlchemy models in `app/database/models.py`.

Use models similar to the following.

### User

- id
- name
- email
- password
- role

For this academic lab, plaintext seeded demo passwords are acceptable only because the login endpoint is intentionally vulnerable and the credentials are fake.

Do not use real passwords.

Do not store real user data.

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

### DemoSession or AuthToken

Optional simple model for demo authentication.

If implemented, it may include:

- id
- user_id
- token
- created_at

Keep this simple.

Do not implement production authentication.

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

- Login and token/session logic.
- Current-user resolution from the demo token.
- Daily log creation and lookup.
- Meal creation and lookup.
- Workout creation and lookup.
- File listing and vulnerable file download logic.
- Vulnerable login SQL logic.
- Optional vulnerable search logic.
- Seed and demo data creation helpers.

Keep the required vulnerabilities in the service layer when appropriate, but make them easy to find and clearly commented.

Do not accidentally fix the vulnerabilities in the service layer.

In particular:

- `auth_service.py` should contain the intentionally unsafe SQL construction for the login SQL Injection.
- `daily_log_service.py` should contain the intentionally missing authorization check for IDOR.
- `file_service.py` should contain the intentionally unsafe filename and path handling for Directory Traversal.
- `search_service.py` may contain an additional intentionally unsafe SQL construction if the optional vulnerable search feature is implemented.

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
          ResponseViewer.tsx
          DailyLogCard.tsx
          MealForm.tsx
          WorkoutForm.tsx
          FileList.tsx
        pages/
          LoginPage.tsx
          DashboardPage.tsx
          TrackerPage.tsx
          DailyLogDetailPage.tsx
          SearchPage.tsx
          FilesPage.tsx
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

1. Login page.
2. Dashboard page.
3. Tracker page where a user can add daily logs, workouts, and meals.
4. Daily log detail page.
5. Files page.
6. Optional search page.
7. Clear normal app navigation.

The frontend should behave like a normal fitness tracker.

The frontend should not include the fixes.

The frontend should not include exploit instructions.

The frontend should not include attack-specific pages.

The frontend should not use a demo user selector.

The frontend should store and send the demo token for authenticated requests.

Authenticated requests should use:

Authorization: Bearer <token>

---

## Backend Requirements

- Use FastAPI routers.
- Use SQLAlchemy.
- Use PostgreSQL.
- Use uv for backend dependency management.
- Use `pyproject.toml` instead of `requirements.txt`.
- Seed the database with fake users, passwords, logs, workouts, meals, trainer assignments, and file records.
- Create normal demo upload files automatically if they do not exist.
- Create fake container-level lab files inside the backend container.
- Configure CORS for the React frontend.
- Use environment variables.
- Return consistent JSON responses.
- Keep the vulnerable code easy to find and understand.
- Implement a real login endpoint.
- Use token-based or session-like demo authentication after login.

The backend must not:

- Implement fixed versions of the vulnerabilities.
- Add `/api/fixed/...` endpoints.
- Prevent the required vulnerabilities from being demonstrated.
- Expose host files.
- Mount sensitive host paths.

---

## Docker Requirements

The app must run through Docker Compose.

The Docker setup should include:

- PostgreSQL container.
- Backend container.
- Frontend container.

The backend container may contain fake lab files outside the application project directory, such as:

- /opt/fittrack-lab/container_note.txt
- /opt/fittrack-lab/fake_container_secret.txt

These files must contain fake data only.

The Docker setup must not mount sensitive host paths into the backend container.

Do not mount:

- /
- /var/run/docker.sock
- ~/.ssh
- browser profile directories
- real secret directories
- personal file directories

The Directory Traversal vulnerability should demonstrate access within the backend container filesystem only.

It must not expose the host filesystem.

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
- Safe local demonstration notes.
- Expected attacker goal.
- Impact.
- Hints for how defenders could fix it later.

Do not provide complete fixed code in the documentation.

Do not include destructive payloads.

Do not include instructions for attacking real systems.

The documentation should clearly state that the Directory Traversal lab is limited to the backend Docker container filesystem.

---

## Safety Boundaries

This project is a local academic lab.

Do not:

- Add malware.
- Add persistence.
- Add credential theft beyond fake local lab authentication bypass.
- Add phishing.
- Add port scanning.
- Add network exploitation.
- Add payloads intended for third-party systems.
- Add destructive SQL payloads.
- Add instructions for attacking real applications.
- Add code that targets the host filesystem.
- Mount sensitive host paths into the backend container.
- Store real health, fitness, nutrition, or personal data.
- Store real credentials.

Do:

- Keep examples local and controlled.
- Keep demonstration steps minimal and educational.
- Make vulnerabilities easy to identify for the class.
- Include warnings that the app must not be deployed publicly.
- Keep all Directory Traversal demonstrations inside the backend container filesystem.
- Use only fake data, fake passwords, and fake lab files.

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
- Keep Docker configuration safe from host exposure.

---

## Completion Criteria

The task is complete when:

1. `docker compose up --build` starts the app.
2. The frontend can call the backend.
3. PostgreSQL is seeded with fake demo users, passwords, daily logs, workouts, meals, trainer assignments, and files.
4. The backend uses `pyproject.toml` and `uv.lock`.
5. There is no `requirements.txt`.
6. The real login flow exists.
7. The login SQL Injection vulnerability exists and is testable locally.
8. The IDOR vulnerability exists and is testable locally.
9. The Directory Traversal vulnerability exists and is testable inside the backend container filesystem.
10. The Docker setup does not expose the host filesystem or host secrets.
11. README explains how to run the project using uv and Docker Compose.
12. Documentation explains how each vulnerability works at a high level.
13. No fixed endpoints are implemented.
14. No real health data, real credentials, real host files, or external systems are required for the demo.
