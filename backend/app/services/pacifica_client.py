from app.config import get_settings


class PacificaClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def get_positions(self) -> list[dict]:
        return [
            {
                "market": "BTC-PERP",
                "side": "long",
                "size": 1.25,
                "entry_price": 68250.0,
            }
        ]

    async def get_trades(self) -> list[dict]:
        return [
            {
                "market": "ETH-PERP",
                "side": "short",
                "size": 8.0,
                "price": 3520.5,
            }
        ]

    async def get_leaderboard(self) -> list[dict]:
        return [
            {"trader": "Pacifica Alpha", "pnl": 12450.75, "win_rate": 0.67},
            {"trader": "Market Neutral", "pnl": 9860.1, "win_rate": 0.62},
        ]
