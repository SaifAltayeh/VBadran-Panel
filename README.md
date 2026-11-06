# VBADRAN

Personal training and online coaching platform.

- `frontend` — Next.js
- `backend` — Django REST Framework and PostgreSQL

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The site runs at http://localhost:3000. If the API is offline, public pages use the local catalog so the design can still be reviewed.

## Backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
createdb vbadran
python manage.py migrate
# Local only: ALLOW_DEMO_SEED=true and DEMO_PASSWORD in backend/.env
python manage.py seed_demo
python manage.py runserver
```

`seed_demo` is local-only and loads demo packages, not Spark / Platinum / Oxygen. Create the real gym packages in the CMS.

Checkout records a pending order. Online payment is not active.
