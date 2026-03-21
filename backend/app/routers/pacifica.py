from fastapi import APIRouter

from app.services.pacifica_client import PacificaClient

router = APIRouter()


@router.get("/positions")
async def get_positions() -> dict:
    client = PacificaClient()
    return {"positions": await client.get_positions()}


@router.get("/trades")
async def get_trades() -> dict:
    client = PacificaClient()
    return {"trades": await client.get_trades()}


@router.get("/leaderboard")
async def get_leaderboard() -> dict:
    client = PacificaClient()
    return {"leaderboard": await client.get_leaderboard()}
