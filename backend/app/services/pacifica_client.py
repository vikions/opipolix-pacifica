from app.config import get_settings
from app.models.position import Position


class PacificaClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def get_positions(self) -> list[Position]:
        return [
            Position(
                market="BTC-PERP",
                asset="BTC",
                side="long",
                size=1.25,
                entry_price=68250.0,
                mark_price=69410.0,
                leverage=3.4,
                notional_usd=86762.5,
                unrealized_pnl_usd=1450.0,
            ),
            Position(
                market="ETH-PERP",
                asset="ETH",
                side="long",
                size=18.0,
                entry_price=3520.5,
                mark_price=3468.0,
                leverage=2.8,
                notional_usd=62424.0,
                unrealized_pnl_usd=-945.0,
            ),
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
            {
                "trader": "Pacifica Alpha",
                "pnl": 12450.75,
                "win_rate": 0.67,
                "favorite_market": "BTC-PERP",
            },
            {
                "trader": "Market Neutral",
                "pnl": 9860.1,
                "win_rate": 0.62,
                "favorite_market": "ETH-PERP",
            },
            {
                "trader": "Shelby Desk",
                "pnl": 8122.4,
                "win_rate": 0.59,
                "favorite_market": "SOL-PERP",
            },
        ]
