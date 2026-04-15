from fastapi import APIRouter, Query

from app.services.pacifica_client import PacificaClient

router = APIRouter()


@router.get("/markets")
async def get_markets(
    symbols: str | None = Query(default=None, description="Comma-separated Pacifica symbols"),
) -> dict:
    client = PacificaClient()
    symbol_list = [item.strip().upper() for item in symbols.split(",") if item.strip()] if symbols else None
    return {"markets": await client.get_market_snapshots(symbols=symbol_list, limit=6, include_flow=True)}


@router.get("/market-snapshots")
async def get_market_snapshots() -> dict:
    client = PacificaClient()
    return {
        "market_snapshots": await client.get_market_snapshots(limit=6, include_flow=True)
    }


@router.get("/trades")
async def get_trades(symbol: str = Query(default="BTC")) -> dict:
    client = PacificaClient()
    symbol_upper = symbol.strip().upper()
    return {
        "symbol": symbol_upper,
        "trades": await client.get_recent_trades(symbol_upper),
    }


@router.get("/orderbook")
async def get_orderbook(symbol: str = Query(default="BTC")) -> dict:
    client = PacificaClient()
    symbol_upper = symbol.strip().upper()
    return {"orderbook": await client.get_orderbook(symbol_upper)}


@router.get("/leaderboard")
async def get_leaderboard() -> dict:
    client = PacificaClient()
    return {"leaderboard": await client.get_leaderboard()}
