from fastapi import APIRouter

from app.services.signal_engine import SignalEngine

router = APIRouter()


@router.get("/hedges")
async def get_hedge_suggestions() -> dict:
    engine = SignalEngine()
    return {"hedges": await engine.generate()}
