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

The application must remain local and containerized.

---

## General Rules

1. The app must run locally.
2. The app must run inside Docker containers.
3. The app must not be deployed publicly.
4. Vulnerable code must be clearly marked.
5. The app must be safe for classroom use.
6. The app must not target third-party systems.
7. The app must not include destructive payloads.
8. The app must use fake demo fitness data only.
9. The app must not store real health or nutrition data.
10. The app must not use real passwords or real personal data.
11. Documentation may include defense hints, but not complete fixed code.
12. The Directory Traversal lab may access fake files in the backend container filesystem, but must not expose the host filesystem.

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

- Log in with seeded local lab credentials.
- Create a daily fitness log.
- Add workouts.
- Add meals and calories.
- View daily logs.
- Download fitness-related demo files.
- Use the vulnerable features manually.

The app should feel like a normal web application, not only an API lab.

Do not use a demo user selector as the primary authentication flow.

---

## Seed Users

Seed the database with at least these fake local lab users.

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

These credentials are fake and must only be used in the local lab.

Do not use real passwords.

Do not store real user data.

---

## Authentication Rules

Use a real login flow for the demo application.

Required endpoint:

POST /api/auth/login

The login request should include:

- email
- password

The login response should include:

- a simple demo access token or session token
- basic user information

Authenticated requests should use:

Authorization: Bearer <token>

The backend should resolve the current user from the token.

Do not use `X-Demo-User-Id` as the main authentication mechanism.

Do not implement production-grade authentication.

Do not use real user credentials.

The login endpoint must intentionally contain the SQL Injection vulnerability.

---

## SQL Injection Rules

The required SQL Injection feature must be available at:

POST /api/auth/login

The login endpoint must intentionally build SQL unsafely.

Allowed vulnerable patterns:

- String concatenation in SQL.
- f-string SQL construction.
- Unsafe raw SQL.

The vulnerability should allow authentication bypass in the local lab.

Expected vulnerable behavior:

- A user can bypass the login check.
- A user can log in as another seeded user.
- A user can log in as the seeded admin account.

Restrictions:

- Do not include destructive SQL examples.
- Do not drop tables.
- Do not delete records.
- Do not modify records through the SQL Injection demo.
- Do not target external systems.
- Do not include real credentials.

Optional additional SQL Injection feature:

GET /api/search?query=

If implemented, this endpoint may also intentionally build SQL unsafely for search-related demonstrations.

---

## IDOR Rules

The IDOR feature must be available at:

GET /api/daily-logs/{log_id}

The endpoint must intentionally fetch a daily fitness log by ID without checking ownership or permissions.

Expected vulnerable behavior:

- Alice can access Bob's private daily log by changing the ID.
- Bob can access Alice's private daily log by changing the ID.
- Any authenticated seeded user can access another user's private daily log by changing the ID.
- The backend returns the object if it exists.

Do not add backend authorization checks to this endpoint.

Do not hide the vulnerability only with frontend UI restrictions.

Do not implement a fixed version.

---

## Directory Traversal Rules

The Directory Traversal feature must be available at:

GET /api/files/download?filename=

The endpoint must intentionally trust a user-controlled filename.

The endpoint should use unsafe path handling.

The demo should allow traversal outside the application project directory and into the backend Docker container filesystem.

This is allowed only inside the backend container.

This must not expose the host filesystem.

The Docker configuration must not mount sensitive host paths.

Do not mount:

- the host root filesystem
- the Docker socket
- SSH directories
- browser profile directories
- real secret directories
- personal file directories

Normal app files should exist in:

backend/demo_uploads/

Example normal app files:

- alice_progress_report.txt
- alice_meal_plan.txt
- bob_progress_report.txt
- bob_cutting_plan.txt
- public_workout_template.txt

Fake container-level lab files should exist in the backend container at:

/opt/fittrack-lab/

Example fake container lab files:

- container_note.txt
- fake_container_secret.txt

The fake container lab files must contain fake lab data only.

Restrictions:

- Do not expose real host files.
- Do not use host `/etc/passwd`.
- Do not use SSH keys.
- Do not use real `.env` files.
- Do not use browser cookies.
- Do not use personal files.
- Do not mount the Docker socket.
- Do not read from external systems.
- Do not implement a fixed version.

---

## Database Rules

Seed data must be deterministic.

The demo must include:

- At least 4 users with fake local lab passwords.
- At least 4 daily logs.
- At least 4 workout entries.
- At least 4 meal entries.
- At least 4 file records.
- At least one private log for Alice.
- At least one private log for Bob.
- At least one public log.
- At least one trainer assignment.
- At least one fake container-level lab file for the Directory Traversal demonstration.

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

Use `app/database/models.py` for SQLAlchemy database models.

Use `app/models/` for Pydantic request and response models.

Do not place SQLAlchemy models inside `app/models/`.

Do not place Pydantic models inside `app/database/models.py`.

This naming convention is intentional.

Do not create or use an `app/db/` folder.

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

- Login and token/session logic.
- Current-user resolution from the demo token.
- Daily log creation and lookup.
- Meal creation and lookup.
- Workout creation and lookup.
- File listing.
- Vulnerable file download logic.
- Vulnerable login SQL logic.
- Optional vulnerable search logic.
- Seed data helpers.

The intentionally vulnerable logic should live in services when appropriate.

Required vulnerability locations:

- `app/services/auth_service.py` should contain the intentionally unsafe SQL construction for login SQL Injection.
- `app/services/daily_log_service.py` should contain the intentionally missing authorization check for IDOR.
- `app/services/file_service.py` should contain the intentionally unsafe filename and path handling for Directory Traversal.
- `app/services/search_service.py` may contain optional unsafe SQL construction if the optional vulnerable search endpoint is implemented.

Do not accidentally fix these vulnerabilities in the service layer.

---

## Required Models

Use SQLAlchemy database models similar to these.

### User

- id
- name
- email
- password
- role

For this academic lab, plaintext seeded demo passwords are acceptable only because the credentials are fake and the login endpoint is intentionally vulnerable.

Do not use real passwords.

Do not use real personal data.

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

## Frontend Rules

The frontend must:

1. Be simple and readable.
2. Use React with Vite.
3. Use TypeScript.
4. Provide a real login page.
5. Store and send the demo token for authenticated requests.
6. Provide a dashboard page.
7. Provide a tracker page.
8. Provide normal daily log detail pages.
9. Provide a normal files page.
10. Optionally provide a normal search page.
11. Include short normal user-facing explanations.
12. Make the app feel like a normal fitness tracker.

The frontend must not:

- Automate attacks against external targets.
- Encourage real-world misuse.
- Include stealth behavior.
- Include persistence behavior.
- Store real health information.
- Include finished fixes.
- Include exploit instructions.
- Include attack-specific pages.
- Use a demo user selector as the primary authentication mechanism.

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
14. Create fake container-level lab files in the backend container.
15. Implement a real login endpoint.
16. Use token-based or session-like demo authentication after login.

The backend must not:

- Implement fixed versions of the vulnerabilities.
- Add `/api/fixed/...` endpoints.
- Prevent the required vulnerabilities from being demonstrated.
- Expose host files.
- Mount sensitive host paths.

---

## Docker Rules

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
4. How to demonstrate it safely in the local lab.
5. What the attacker is trying to achieve.
6. What the impact is.
7. High-level hints for how defenders could fix it later.

Do not include complete fixed code.

Do not include destructive payloads.

Do not include instructions for attacking real systems.

The README must document uv commands, not pip commands.

The documentation must clearly state that the Directory Traversal lab is limited to the backend Docker container filesystem.

---

## Testing Rules

Basic backend tests are allowed.

Tests should verify:

- The app starts.
- Seed users exist.
- The login endpoint exists.
- The login SQL Injection vulnerability exists in the local lab.
- The vulnerable daily log endpoint exists.
- The vulnerable file download endpoint exists.
- Demo files exist.
- Fake container-level lab files exist.

Tests may also verify vulnerable behavior, but must stay safe and local.

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

Do not use real passwords or real personal data.

Do not expose host files or mount sensitive host paths into the backend container.

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
- The app has a real login page.
- The tracker page allows basic demo log creation.
- The login SQL Injection vulnerability is available.
- The IDOR vulnerability is available.
- The Directory Traversal vulnerability is available inside the backend container filesystem.
- The Docker setup does not expose host secrets or host sensitive paths.
- Documentation is complete.
- No fixed endpoints are implemented.
- No real host files, real credentials, real health data, or external systems are required for the demo.
