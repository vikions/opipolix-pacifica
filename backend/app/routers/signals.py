from fastapi import APIRouter

from app.services.signal_engine import SignalEngine

router = APIRouter()


@router.get("/hedges")
async def get_hedge_suggestions() -> dict:
    engine = SignalEngine()
    hedges = await engine.generate()
    return {
        "hedges": hedges,
        "summary": {
            "count": len(hedges),
            "immediate": len([signal for signal in hedges if signal.urgency == "immediate"]),
            "assets": sorted({signal.related_asset for signal in hedges}),
        },
    }
