from fastapi import APIRouter, Query

from app.services.polymarket_client import PolymarketClient

router = APIRouter()


@router.get("/markets")
async def get_markets(
    assets: str | None = Query(default=None, description="Comma-separated asset tickers"),
) -> dict:
    client = PolymarketClient()
    asset_list = [
        item.strip().upper()
        for item in assets.split(",")
        if item and item.strip()
    ] if assets else None
    return {"markets": await client.get_markets(assets=asset_list)}


@router.get("/signals")
async def get_market_signals() -> dict:
    client = PolymarketClient()
    return {"signals": await client.get_signals()}
