from datetime import datetime, timezone
import logging

from app.services.pacifica_client import PacificaClient
from app.services.polymarket_client import PolymarketClient
from app.services.signal_engine import SignalEngine

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(self) -> None:
        self.pacifica = PacificaClient()
        self.polymarket = PolymarketClient()
        self.signal_engine = SignalEngine()

    async def get_overview(self) -> dict:
        polymarket_markets = []
        try:
            polymarket_markets = await self.polymarket.get_markets()
        except Exception:
            logger.exception("Failed to fetch Polymarket markets for dashboard overview")
            polymarket_markets = []

        linked_symbols = sorted(
            {market.pacifica_symbol for market in polymarket_markets if market.pacifica_symbol}
        )

        pacifica_linked = []
        try:
            pacifica_linked = await self.pacifica.get_market_snapshots(
                symbols=linked_symbols,
                limit=None,
                include_flow=True,
            )
        except Exception:
            logger.exception("Failed to fetch linked Pacifica market snapshots for dashboard overview")
            pacifica_linked = []

        pacifica_featured = []
        try:
            pacifica_featured = await self.pacifica.get_market_snapshots(limit=6, include_flow=True)
        except Exception:
            logger.exception("Failed to fetch featured Pacifica market snapshots for dashboard overview")
            pacifica_featured = []

        signals: list = []
        if polymarket_markets and pacifica_linked:
            try:
                signals = self.signal_engine.generate_from_context(polymarket_markets, pacifica_linked)
            except Exception:
                logger.exception("Failed to generate dashboard signals from context")
                signals = []
        else:
            logger.debug(
                "Skipping signal generation for dashboard overview because required inputs are missing: polymarket_markets=%s, pacifica_linked=%s",
                bool(polymarket_markets),
                bool(pacifica_linked),
            )

        return {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "pacifica": {
                "markets": pacifica_featured,
                "summary": {
                    "count": len(pacifica_featured),
                    "total_volume_24h": round(
                        sum(item.volume_24h if item.volume_24h is not None else 0.0 for item in pacifica_featured),
                        2,
                    ),
                    "total_open_interest": round(
                        sum(item.open_interest if item.open_interest is not None else 0.0 for item in pacifica_featured),
                        2,
                    ),
                },
            },
            "polymarket": {
                "markets": polymarket_markets,
                "summary": {
                    "count": len(polymarket_markets),
                    "total_volume_24h": round(
                        sum(item.volume_24h if item.volume_24h is not None else 0.0 for item in polymarket_markets),
                        2,
                    ),
                    "total_liquidity": round(
                        sum(item.liquidity if item.liquidity is not None else 0.0 for item in polymarket_markets),
                        2,
                    ),
                },
            },
            "signals": {
                "hedges": signals,
                "summary": {
                    "count": len(signals),
                    "immediate": len([signal for signal in signals if signal.urgency == "immediate"]),
                    "assets": sorted({signal.related_asset for signal in signals if signal.related_asset is not None}),
                },
            },
        }
