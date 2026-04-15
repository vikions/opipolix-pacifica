from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import dashboard, pacifica, polymarket, signals

app = FastAPI(
    title="opipolix-pacifica API",
    description="FastAPI backend for Pacifica and Polymarket analytics.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pacifica.router, prefix="/api/pacifica", tags=["pacifica"])
app.include_router(polymarket.router, prefix="/api/polymarket", tags=["polymarket"])
app.include_router(signals.router, prefix="/api/signals", tags=["signals"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
