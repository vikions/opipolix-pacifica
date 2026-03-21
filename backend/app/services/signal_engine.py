from app.services.pacifica_client import PacificaClient
from app.services.polymarket_client import PolymarketClient


class SignalEngine:
    def __init__(self) -> None:
        self.pacifica = PacificaClient()
        self.polymarket = PolymarketClient()

    async def generate(self) -> list[dict]:
        signals = await self.polymarket.get_signals()
        positions = await self.pacifica.get_positions()

        return [
            {
                "market": signals[0]["market"],
                "odds_shift": signals[0]["move_24h"],
                "suggested_action": "Open BTC-PERP long hedge",
                "context_position_count": len(positions),
            }
        ]
