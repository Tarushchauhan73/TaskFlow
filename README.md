# TaskFlow

A simple full-stack to-do app built with **React**, **Node/Express**, and **MongoDB**.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Tests:** Jest + Supertest
- **CI:** GitHub Actions (tests + ESLint)
- **Containers:** Docker & Docker Compose

## Project structure

```
TaskFlow/
├── backend/     # Express API
├── frontend/    # React app
└── docker-compose.yml
```

## Run locally (without Docker)

**Backend**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
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
npm test
```

## Linting

```bash
npm run lint    # run inside backend/ or frontend/
```

## CI

- **`.github/workflows/test.yml`** — runs backend tests on every push to `main`.
- **`.github/workflows/lint.yml`** — runs ESLint on the backend and frontend on pushes and pull requests.
