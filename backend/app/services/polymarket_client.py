from app.config import get_settings


class PolymarketClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def get_markets(self) -> list[dict]:
        return [
            {
                "question": "Will BTC close above $70k this week?",
                "yes_price": 0.58,
                "no_price": 0.42,
            }
        ]

    async def get_signals(self) -> list[dict]:
        return [
            {
                "market": "BTC weekly close",
                "probability": 0.58,
                "move_24h": 0.06,
            }
        ]
