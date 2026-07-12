# Study Abroad CRM

Full-stack CRM for an overseas education consultancy. Manage student enquiries, counselling workflow, follow-ups, and admissions progress.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios |
| Backend | Django, Django REST Framework |
| Database | SQLite (local) · Postgres via `DATABASE_URL` (production) |
| Auth (demo) | Session flag in the browser (no real login API yet) |

## Project layout

```
ERP/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── constants/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/  # Axios API clients
│       └── utils/
└── backend/           # Django project
    ├── crm_backend/   # settings + urls
    └── leads/         # models, APIs, dashboard, export
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (3.12 works)
- Git (optional)

## Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Optional: demo counselors + 5 sample students (skipped if leads already exist)
python manage.py seed_demo_data

# Start the API server
python manage.py runserver
```

API base URL: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

Admin (optional): [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

```bash
python manage.py createsuperuser
```

### Main API routes

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/leads/` | List / create students |
| GET/PATCH/DELETE | `/api/leads/:id/` | Student detail |
| GET | `/api/leads/export/` | CSV export |
| GET | `/api/leads/filter-options/` | Filter dropdown values |
| GET/POST | `/api/employees/` | Counselors |
| GET/POST | `/api/lead-notes/` | Notes |
| GET/POST | `/api/followups/` | Follow-ups |
| GET | `/api/activity-logs/` | Student timeline |
| GET | `/api/dashboard/summary/` | Dashboard cards |

Query params on `/api/leads/` support search, stage, sub_stage, country, course, intake, employee, priority, lead_source, and date range.

## Frontend setup

```bash
cd frontend

npm install
npm run dev
```

App URL: [http://localhost:5173](http://localhost:5173)

### Optional API URL

Create `frontend/.env` if the backend is not on the default host:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Restart `npm run dev` after changing env values.

### Production build

```bash
cd frontend
npm run build
npm run preview
```

## Production deploy (persistent leads)

Netlify hosts the **frontend only**. The Django API must use a **managed Postgres** database. SQLite on the app server is wiped on restart/redeploy, which resets the list to the 5 demo students.

### 1. Backend (e.g. Render)

1. Create a **PostgreSQL** database on Render (or another host).
2. Create a **Web Service** from this repo:
   - Root directory: `backend`
   - Build command: `./build.sh` (or `bash build.sh`)
   - Start command: from `Procfile` (`gunicorn …`)
3. Link the database so `DATABASE_URL` is set automatically, **or** paste the Internal Database URL into the web service env.
4. Set at least:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | from Postgres service (auto-linked on Render) |
| `DJANGO_SECRET_KEY` | long random string |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `your-api.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://leadmanagement-system.netlify.app` |

`build.sh` runs migrations and `seed_demo_data`. Seeding only adds sample students when the DB has **no** leads, so redeploys keep real data. Set `SEED_DEMO_DATA=false` to skip seeding.

See `backend/.env.example` for the full list.

### 2. Frontend (Netlify)

Set and redeploy:

```
VITE_API_URL=https://your-api.onrender.com/api
```

Without this, the built app may call `localhost` and will not see your production database.

## Features

- Multi-step **Add Student** form (personal, education, preferences, counselling, documents, follow-up)
- Study abroad **stage / sub-stage** workflow
- Advanced filtering and search (server-side)
- Student details: notes, follow-ups, activity timeline
- Round Robin counselor assignment on new enquiries
- Dashboard summary cards and charts
- CSV export of all student fields

## Default login

Open the app and use the Login page. Sign-in is a local demo gate (no password check against Django).

## Development tips

1. Start backend first (`runserver`), then frontend (`npm run dev`).
2. CORS is enabled for `http://localhost:5173`.
3. Local default DB is SQLite at `backend/db.sqlite3`. Production must set `DATABASE_URL` (Postgres).
4. New students are assigned to active employees in Round Robin order.

## License

Private / assessment project — use as needed for your team.
