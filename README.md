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
- **`.github/workflows/deploy-pages.yml`** — builds the frontend and deploys it to GitHub Pages on every push to `main`.

## Deployment

**Database — MongoDB Atlas**
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Add a database user and allow network access from `0.0.0.0/0` (or Render's IPs).
3. Copy your connection string — this is your `MONGO_URI`.

**Backend — Render**
1. Go to [render.com](https://render.com) → New → Blueprint, and point it at this repo (it will read `render.yaml`).
2. When prompted, set the `MONGO_URI` environment variable to your Atlas connection string.
3. Once deployed, copy the service URL (e.g. `https://taskflow-backend.onrender.com`).

**Frontend — GitHub Pages**
1. In this repo: Settings → Pages → Source → **GitHub Actions**.
2. Settings → Secrets and variables → Actions → Variables → add a repository variable `VITE_API_URL` set to `<your-render-url>/api/todos`.
3. Push to `main` (or re-run the "Deploy Frontend to GitHub Pages" workflow) — the site will be published at:
   `https://tarushchauhan73.github.io/TaskFlow/`
