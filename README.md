# TaskFlow

A simple full-stack to-do app built with **React**, **Python (Flask)**, and **MongoDB**.

## Stack

- **Frontend:** React + Vite
- **Backend:** Python + Flask
- **Database:** MongoDB (PyMongo)
- **Tests:** Pytest + mongomock
- **CI:** GitHub Actions (tests + lint)
- **Containers:** Docker & Docker Compose

## Project structure

```
TaskFlow/
├── backend/     # Flask API
├── frontend/    # React app
└── docker-compose.yml
```

## Run locally (without Docker)

**Backend**
```bash
cd backend
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
python run.py
```

**Frontend** (in a new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:3000`, and the API at `http://localhost:5000`.

## Run with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

## API endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|--------------------|
| GET    | `/api/todos`      | Get all todos      |
| GET    | `/api/todos/:id`  | Get one todo       |
| POST   | `/api/todos`      | Create a todo      |
| PUT    | `/api/todos/:id`  | Update a todo      |
| DELETE | `/api/todos/:id`  | Delete a todo      |

## Testing

```bash
cd backend
source venv/bin/activate
pytest
```

## Linting

```bash
cd backend && flake8 .     # Python backend
cd frontend && npm run lint  # React frontend
```

## CI

- **`.github/workflows/test.yml`** — runs backend tests (pytest) on every push to `main`.
- **`.github/workflows/lint.yml`** — runs flake8 on the backend and ESLint on the frontend, on pushes and pull requests.
