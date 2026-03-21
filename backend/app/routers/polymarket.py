from fastapi import APIRouter

from app.services.polymarket_client import PolymarketClient

router = APIRouter()


@router.get("/markets")
async def get_markets() -> dict:
    client = PolymarketClient()
    return {"markets": await client.get_markets()}


@router.get("/signals")
async def get_market_signals() -> dict:
    client = PolymarketClient()
    return {"signals": await client.get_signals()}
