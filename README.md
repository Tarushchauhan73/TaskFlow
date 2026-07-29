# TaskFlow

A simple full-stack to-do app with user accounts, built with **React**, **Python (Flask)**, and **MongoDB**. Each user logs in and only sees their own tasks.

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

| Method | Endpoint             | Auth required | Description         |
|--------|-----------------------|:--------------:|----------------------|
| POST   | `/api/auth/register`  | No             | Create an account     |
| POST   | `/api/auth/login`     | No             | Log in, get a token   |
| GET    | `/api/auth/me`        | Yes            | Get current user      |
| GET    | `/api/todos`          | Yes            | Get your todos        |
| GET    | `/api/todos/:id`      | Yes            | Get one todo          |
| POST   | `/api/todos`          | Yes            | Create a todo         |
| PUT    | `/api/todos/:id`      | Yes            | Update a todo         |
| DELETE | `/api/todos/:id`      | Yes            | Delete a todo         |

Authenticated requests need an `Authorization: Bearer <token>` header, using the token returned from register/login. Tokens expire after 7 days.

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
2. Add a database user (Database Access) and, under **Network Access**, add an IP entry of `0.0.0.0/0` (Allow access from anywhere). **This step is required** — Render's free tier uses dynamic IPs, so without this the backend will fail to connect.
3. Copy your connection string — this is your `MONGO_URI`.

**Backend — Render**
1. Go to [render.com](https://render.com) → New → Blueprint, and point it at this repo (it will read `render.yaml`).
2. When prompted, set the `MONGO_URI` environment variable to your Atlas connection string. `SECRET_KEY` (used to sign login tokens) is generated automatically — no action needed.
3. Once deployed, copy the service URL (e.g. `https://taskflow-backend.onrender.com`).

If you already have this service deployed from before auth was added, go to the service's **Environment** tab in Render and add `SECRET_KEY` manually (any long random string), since existing services don't auto-pick-up new blueprint variables.

**Frontend — GitHub Pages**
1. In this repo: Settings → Pages → Source → **GitHub Actions**.
2. Settings → Secrets and variables → Actions → Variables → add a repository variable `VITE_API_URL` set to `<your-render-url>/api/todos`.
3. Push to `main` (or re-run the "Deploy Frontend to GitHub Pages" workflow) — the site will be published at:
   `https://tarushchauhan73.github.io/TaskFlow/`

