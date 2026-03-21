# opipolix-pacifica

`opipolix-pacifica` is a trading analytics dashboard scaffold that combines Pacifica perpetuals data, Polymarket prediction signals, and a hedge suggestion engine.

## Stack

- Backend: Python + FastAPI
- Frontend: React + Vite + TypeScript

## Features

- Pacifica REST integration placeholders for positions, trades, and leaderboard data
- Polymarket market and signal placeholders
- Hedge engine route and service stub for matching prediction shifts with perp ideas
- Basic dashboard shell with sidebar navigation and four placeholder panels

## Project Layout

```text
opipolix-pacifica/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

The API will start on `http://localhost:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard will start on `http://localhost:5173`.

## Environment Variables

Add the following values to `backend/.env`:

- `PACIFICA_BUILDER_CODE`
- `PACIFICA_WALLET`
- `POLYMARKET_API_KEY`

## Next Steps

- Replace stub service responses with real Pacifica and Polymarket client logic
- Connect the frontend hooks and components to live backend data
- Add signal scoring, hedge sizing, and test coverage
