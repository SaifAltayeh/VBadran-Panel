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
python manage.py seed_demo
python manage.py runserver
```

Admin: http://localhost:8000/admin/

Seeded accounts use the password in `DEMO_PASSWORD` (default `Vbadran2026!`).

- `admin@vbadran.com` — Django admin
- `client@vbadran.com` — client dashboard
- `coach@vbadran.com` — coach side of messages

The dashboard also has a “Preview the client platform” path on the login screen when you only want to walk the interface.

Checkout records a pending order. Card numbers stay in the browser. Mark an order paid in Django admin to create the account and assign the program.
