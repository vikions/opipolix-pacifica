from app.config import get_settings
from app.models.market import Market


class PolymarketClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def get_markets(self) -> list[Market]:
        return [
            Market(
                id="btc-above-70k-weekly",
                question="Will BTC close above $70k this week?",
                event_slug="btc-above-70k-this-week",
                category="crypto",
                related_asset="BTC",
                pacifica_market="BTC-PERP",
                probability=0.58,
                probability_change_1h=0.024,
                probability_change_24h=0.067,
                volume_24h_usd=1_820_000,
                bias="bullish",
            ),
            Market(
                id="eth-breakout-monthly",
                question="Will ETH trade above $3.6k this month?",
                event_slug="eth-breakout-monthly",
                category="crypto",
                related_asset="ETH",
                pacifica_market="ETH-PERP",
                probability=0.39,
                probability_change_1h=-0.014,
                probability_change_24h=-0.053,
                volume_24h_usd=1_110_000,
                bias="bearish",
            ),
            Market(
                id="sol-rally-weekly",
                question="Will SOL outperform BTC this week?",
                event_slug="sol-outperform-btc-weekly",
                category="crypto",
                related_asset="SOL",
                pacifica_market="SOL-PERP",
                probability=0.64,
                probability_change_1h=0.031,
                probability_change_24h=0.094,
                volume_24h_usd=890_000,
                bias="bullish",
            ),
            Market(
                id="fed-cut-july",
                question="Will the Fed cut rates by July?",
                event_slug="fed-cut-july",
                category="macro",
                probability=0.63,
                probability_change_1h=0.008,
                probability_change_24h=0.021,
                volume_24h_usd=2_450_000,
                bias="neutral",
            ),
        ]

    async def get_signals(self) -> list[Market]:
        return [
            market
            for market in await self.get_markets()
            if market.related_asset is not None and abs(market.probability_change_24h) >= 0.04
        ]
